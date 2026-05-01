package com.example.demo.service;

import com.example.demo.event.DocumentUploadedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

/**
 * Service responsible for publishing document events to Kafka
 */
@Service
public class DocumentEventPublisher {
    
    private static final Logger logger = LoggerFactory.getLogger(DocumentEventPublisher.class);
    
    private final KafkaTemplate<String, Object> kafkaTemplate;
    
    @Value("${kafka.topic.document-uploaded:dms.documents.uploaded}")
    private String documentUploadedTopic;
    
    public DocumentEventPublisher(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }
    
    /**
     * Publish document uploaded event to Kafka
     * 
     * @param event The document uploaded event
     */
    public void publishDocumentUploaded(DocumentUploadedEvent event) {
        try {
            // Use documentId as message key for partition ordering
            String key = String.valueOf(event.getDocumentId());
            
            logger.info("Publishing document uploaded event: {}", event);
            
            CompletableFuture<SendResult<String, Object>> future = 
                kafkaTemplate.send(documentUploadedTopic, key, event);
            
            future.whenComplete((result, ex) -> {
                if (ex == null) {
                    logger.info("Successfully published event for document {} to partition {} offset {}",
                            event.getDocumentId(),
                            result.getRecordMetadata().partition(),
                            result.getRecordMetadata().offset());
                } else {
                    logger.error("Failed to publish event for document {}: {}",
                            event.getDocumentId(), ex.getMessage());
                }
            });
            
        } catch (Exception e) {
            logger.error("Error publishing document uploaded event: {}", e.getMessage(), e);
        }
    }
}
