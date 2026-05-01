"""
DMS Translation Consumer Service
Consumes translated documents from Kafka and persists them to PostgreSQL
"""

import os
import json
import logging
from kafka import KafkaConsumer
import psycopg2
from psycopg2.extras import Json
import time

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Configuration from environment variables
KAFKA_BOOTSTRAP_SERVERS = os.getenv('KAFKA_BOOTSTRAP_SERVERS', 'localhost:9093')
KAFKA_GROUP_ID = os.getenv('KAFKA_GROUP_ID', 'translation-consumer')
KAFKA_INPUT_TOPIC = os.getenv('KAFKA_INPUT_TOPIC', 'dms.documents.translated')
AUTO_OFFSET_RESET = os.getenv('AUTO_OFFSET_RESET', 'earliest')

POSTGRES_HOST = os.getenv('POSTGRES_HOST', 'localhost')
POSTGRES_PORT = os.getenv('POSTGRES_PORT', '5432')
POSTGRES_DB = os.getenv('POSTGRES_DB', 'dms')
POSTGRES_USER = os.getenv('POSTGRES_USER', 'postgres')
POSTGRES_PASSWORD = os.getenv('POSTGRES_PASSWORD', 'postgres')


class TranslationConsumer:
    def __init__(self):
        """Initialize Kafka consumer and PostgreSQL connection"""
        logger.info("Initializing Translation Consumer Service...")
        
        # Create Kafka consumer
        self.consumer = KafkaConsumer(
            KAFKA_INPUT_TOPIC,
            bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
            group_id=KAFKA_GROUP_ID,
            auto_offset_reset=AUTO_OFFSET_RESET,
            enable_auto_commit=False,  # Manual commit for reliability
            value_deserializer=lambda m: json.loads(m.decode('utf-8')),
            key_deserializer=lambda m: m.decode('utf-8') if m else None
        )
        
        # Connect to PostgreSQL
        self.connect_to_postgres()
        
        # Create translations table if not exists
        self.create_translations_table()
        
        logger.info(f"Connected to Kafka: {KAFKA_BOOTSTRAP_SERVERS}")
        logger.info(f"Consuming from: {KAFKA_INPUT_TOPIC}")
        logger.info(f"Consumer group: {KAFKA_GROUP_ID}")
        logger.info(f"PostgreSQL: {POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}")
    
    def connect_to_postgres(self, max_retries=5):
        """Connect to PostgreSQL with retry logic"""
        for attempt in range(max_retries):
            try:
                self.conn = psycopg2.connect(
                    host=POSTGRES_HOST,
                    port=POSTGRES_PORT,
                    database=POSTGRES_DB,
                    user=POSTGRES_USER,
                    password=POSTGRES_PASSWORD
                )
                self.conn.autocommit = False
                logger.info("Connected to PostgreSQL successfully")
                return
            except psycopg2.OperationalError as e:
                logger.warning(f"PostgreSQL connection attempt {attempt + 1} failed: {e}")
                if attempt < max_retries - 1:
                    time.sleep(2 ** attempt)
                else:
                    raise
    
    def create_translations_table(self):
        """Create translations table if it doesn't exist"""
        try:
            cursor = self.conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS document_translations (
                    id BIGSERIAL PRIMARY KEY,
                    document_id BIGINT NOT NULL,
                    original_title TEXT,
                    original_description TEXT,
                    translations JSONB NOT NULL,
                    translated_at BIGINT NOT NULL,
                    translator_service TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(document_id)
                )
            """)
            
            # Create index on document_id for faster lookups
            cursor.execute("""
                CREATE INDEX IF NOT EXISTS idx_translations_document_id 
                ON document_translations(document_id)
            """)
            
            self.conn.commit()
            cursor.close()
            logger.info("Translations table ready")
        except Exception as e:
            logger.error(f"Failed to create translations table: {e}")
            self.conn.rollback()
            raise
    
    def save_translation(self, translation_data):
        """
        Save translation to PostgreSQL
        
        Args:
            translation_data: Dictionary containing translation information
            
        Returns:
            True if successful, False otherwise
        """
        try:
            cursor = self.conn.cursor()
            
            document_id = translation_data.get('documentId')
            original_title = translation_data.get('originalTitle', '')
            original_description = translation_data.get('originalDescription', '')
            translations = translation_data.get('translations', {})
            translated_at = translation_data.get('translatedAt')
            translator_service = translation_data.get('translatorService', 'unknown')
            
            # Insert or update translation
            cursor.execute("""
                INSERT INTO document_translations 
                (document_id, original_title, original_description, translations, translated_at, translator_service)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON CONFLICT (document_id) 
                DO UPDATE SET
                    original_title = EXCLUDED.original_title,
                    original_description = EXCLUDED.original_description,
                    translations = EXCLUDED.translations,
                    translated_at = EXCLUDED.translated_at,
                    translator_service = EXCLUDED.translator_service,
                    created_at = CURRENT_TIMESTAMP
            """, (
                document_id,
                original_title,
                original_description,
                Json(translations),
                translated_at,
                translator_service
            ))
            
            self.conn.commit()
            cursor.close()
            
            logger.info(f"Saved translation for document {document_id} to PostgreSQL")
            logger.info(f"Languages: {', '.join(translations.keys())}")
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to save translation: {e}", exc_info=True)
            self.conn.rollback()
            return False
    
    def process_translation(self, message):
        """
        Process a translation message
        
        Args:
            message: Kafka message containing translation data
            
        Returns:
            True if successful, False otherwise
        """
        try:
            translation_data = message.value
            document_id = translation_data.get('documentId')
            
            logger.info(f"Processing translation for document: {document_id}")
            
            # Save to PostgreSQL
            success = self.save_translation(translation_data)
            
            if success:
                logger.info(f"Successfully processed translation for document {document_id}")
            else:
                logger.error(f"Failed to process translation for document {document_id}")
            
            return success
            
        except Exception as e:
            logger.error(f"Error processing translation: {e}", exc_info=True)
            return False
    
    def run(self):
        """Main consumer loop"""
        logger.info("Translation Consumer started. Waiting for messages...")
        
        try:
            for message in self.consumer:
                logger.info(f"Received message from partition {message.partition} "
                           f"offset {message.offset}")
                
                # Process the translation
                success = self.process_translation(message)
                
                if success:
                    # Commit offset only after successful processing
                    self.consumer.commit()
                    logger.info("Offset committed successfully")
                else:
                    logger.error("Processing failed - offset NOT committed. "
                               "Will retry on restart.")
                    
        except KeyboardInterrupt:
            logger.info("Shutting down gracefully...")
        except Exception as e:
            logger.error(f"Fatal error in consumer loop: {e}", exc_info=True)
        finally:
            self.close()
    
    def close(self):
        """Clean up resources"""
        logger.info("Closing connections...")
        self.consumer.close()
        if hasattr(self, 'conn'):
            self.conn.close()
        logger.info("Translation Consumer stopped")


def main():
    """Entry point"""
    logger.info("=" * 60)
    logger.info("DMS Translation Consumer Service")
    logger.info("=" * 60)
    logger.info(f"Kafka Brokers: {KAFKA_BOOTSTRAP_SERVERS}")
    logger.info(f"Input Topic: {KAFKA_INPUT_TOPIC}")
    logger.info(f"Consumer Group: {KAFKA_GROUP_ID}")
    logger.info(f"PostgreSQL: {POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}")
    logger.info("=" * 60)
    
    service = TranslationConsumer()
    service.run()


if __name__ == '__main__':
    main()
