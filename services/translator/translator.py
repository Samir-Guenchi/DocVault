"""
DMS Translator Service
Consumes document upload events from Kafka, translates using Gemini API,
and publishes translations back to Kafka.
"""

import os
import json
import time
import logging
from kafka import KafkaConsumer, KafkaProducer
from kafka.errors import KafkaError
import requests

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Configuration from environment variables
KAFKA_BOOTSTRAP_SERVERS = os.getenv('KAFKA_BOOTSTRAP_SERVERS', 'localhost:9093')
KAFKA_GROUP_ID = os.getenv('KAFKA_GROUP_ID', 'translator-service')
KAFKA_INPUT_TOPIC = os.getenv('KAFKA_INPUT_TOPIC', 'dms.documents.uploaded')
KAFKA_OUTPUT_TOPIC = os.getenv('KAFKA_OUTPUT_TOPIC', 'dms.documents.translated')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'AIzaSyA6enE-LWircHC2tSGFQEAkn5AvHmto_c8')
AUTO_OFFSET_RESET = os.getenv('AUTO_OFFSET_RESET', 'latest')

# Target languages for translation
TARGET_LANGUAGES = ['French', 'Spanish', 'Arabic']

class TranslatorService:
    def __init__(self):
        """Initialize Kafka consumer and producer"""
        logger.info("Initializing Translator Service...")
        
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
        
        # Create Kafka producer
        self.producer = KafkaProducer(
            bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
            value_serializer=lambda v: json.dumps(v).encode('utf-8'),
            key_serializer=lambda k: k.encode('utf-8') if k else None,
            acks='all',  # Wait for all replicas
            retries=3
        )
        
        logger.info(f"Connected to Kafka: {KAFKA_BOOTSTRAP_SERVERS}")
        logger.info(f"Consuming from: {KAFKA_INPUT_TOPIC}")
        logger.info(f"Publishing to: {KAFKA_OUTPUT_TOPIC}")
        logger.info(f"Consumer group: {KAFKA_GROUP_ID}")
    
    def translate_with_gemini(self, text, target_language, max_retries=3):
        """
        Translate text using Gemini API with retry logic
        
        Args:
            text: Text to translate
            target_language: Target language name
            max_retries: Maximum number of retry attempts
            
        Returns:
            Translated text or None if failed
        """
        if not GEMINI_API_KEY:
            logger.error("GEMINI_API_KEY not set!")
            return None
        
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={GEMINI_API_KEY}"
        
        prompt = f"Translate the following text to {target_language}. Only return the translation, no explanations:\n\n{text}"
        
        payload = {
            "contents": [{
                "parts": [{
                    "text": prompt
                }]
            }]
        }
        
        for attempt in range(max_retries):
            try:
                logger.info(f"Calling Gemini API (attempt {attempt + 1}/{max_retries})...")
                response = requests.post(url, json=payload, timeout=30)
                
                if response.status_code == 200:
                    result = response.json()
                    translation = result['candidates'][0]['content']['parts'][0]['text']
                    logger.info(f"Translation successful: {target_language}")
                    return translation.strip()
                else:
                    logger.error(f"Gemini API error: {response.status_code} - {response.text}")
                    
            except requests.exceptions.Timeout:
                logger.warning(f"Gemini API timeout (attempt {attempt + 1})")
            except requests.exceptions.RequestException as e:
                logger.error(f"Gemini API request failed: {e}")
            except (KeyError, IndexError) as e:
                logger.error(f"Failed to parse Gemini response: {e}")
            
            # Exponential backoff
            if attempt < max_retries - 1:
                wait_time = 2 ** attempt
                logger.info(f"Retrying in {wait_time} seconds...")
                time.sleep(wait_time)
        
        logger.error(f"Failed to translate after {max_retries} attempts")
        return None
    
    def process_document(self, message):
        """
        Process a document upload event
        
        Args:
            message: Kafka message containing document metadata
        """
        try:
            document = message.value
            document_id = document.get('documentId')
            title = document.get('title', '')
            description = document.get('description', '')
            
            logger.info(f"Processing document: {document_id} - {title}")
            
            # Combine title and description for translation
            text_to_translate = f"{title}\n\n{description}" if description else title
            
            if not text_to_translate.strip():
                logger.warning(f"No text to translate for document {document_id}")
                return True  # Skip but don't fail
            
            # Translate to each target language
            translations = {}
            all_successful = True
            
            for language in TARGET_LANGUAGES:
                translation = self.translate_with_gemini(text_to_translate, language)
                
                if translation:
                    translations[language.lower()] = translation
                else:
                    logger.error(f"Failed to translate to {language}")
                    all_successful = False
                    break  # Stop on first failure
            
            if not all_successful:
                logger.error(f"Translation failed for document {document_id}")
                return False  # Don't commit offset
            
            # Create translation event
            translation_event = {
                'documentId': document_id,
                'originalTitle': title,
                'originalDescription': description,
                'translations': translations,
                'translatedAt': int(time.time() * 1000),
                'translatorService': 'gemini-translator-v1'
            }
            
            # Publish to output topic
            future = self.producer.send(
                KAFKA_OUTPUT_TOPIC,
                key=str(document_id),
                value=translation_event
            )
            
            # Wait for confirmation
            record_metadata = future.get(timeout=10)
            logger.info(f"Published translation to {record_metadata.topic} "
                       f"partition {record_metadata.partition} "
                       f"offset {record_metadata.offset}")
            
            return True
            
        except Exception as e:
            logger.error(f"Error processing document: {e}", exc_info=True)
            return False
    
    def run(self):
        """Main consumer loop"""
        logger.info("Translator Service started. Waiting for messages...")
        
        try:
            for message in self.consumer:
                logger.info(f"Received message from partition {message.partition} "
                           f"offset {message.offset}")
                
                # Process the document
                success = self.process_document(message)
                
                if success:
                    # Commit offset only after successful processing
                    self.consumer.commit()
                    logger.info("Offset committed successfully")
                else:
                    logger.error("Processing failed - offset NOT committed. "
                               "Will retry on restart.")
                    # In production, consider implementing dead letter queue
                    
        except KeyboardInterrupt:
            logger.info("Shutting down gracefully...")
        except Exception as e:
            logger.error(f"Fatal error in consumer loop: {e}", exc_info=True)
        finally:
            self.close()
    
    def close(self):
        """Clean up resources"""
        logger.info("Closing Kafka connections...")
        self.consumer.close()
        self.producer.close()
        logger.info("Translator Service stopped")


def main():
    """Entry point"""
    logger.info("=" * 60)
    logger.info("DMS Translator Service")
    logger.info("=" * 60)
    logger.info(f"Kafka Brokers: {KAFKA_BOOTSTRAP_SERVERS}")
    logger.info(f"Input Topic: {KAFKA_INPUT_TOPIC}")
    logger.info(f"Output Topic: {KAFKA_OUTPUT_TOPIC}")
    logger.info(f"Consumer Group: {KAFKA_GROUP_ID}")
    logger.info(f"Target Languages: {', '.join(TARGET_LANGUAGES)}")
    logger.info("=" * 60)
    
    if not GEMINI_API_KEY:
        logger.error("GEMINI_API_KEY environment variable is not set!")
        logger.error("Please set it before starting the service.")
        return
    
    service = TranslatorService()
    service.run()


if __name__ == '__main__':
    main()
