package com.example.demo.service;

import com.example.demo.event.DocumentUploadedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Service for document operations
 * Publishes events to Kafka when documents are uploaded
 */
@Service
public class DocumentService {
    
    private static final Logger logger = LoggerFactory.getLogger(DocumentService.class);
    
    private final DocumentEventPublisher eventPublisher;
    
    public DocumentService(DocumentEventPublisher eventPublisher) {
        this.eventPublisher = eventPublisher;
    }
    
    /**
     * Upload a document and publish event
     * 
     * @param document The document to upload
     * @return The uploaded document with ID
     */
    public DocumentUploadedEvent uploadDocument(DocumentUploadRequest request) {
        logger.info("Uploading document: {}", request.getTitle());
        
        // In real implementation, save to database first
        // For now, simulate with a generated ID
        Long documentId = System.currentTimeMillis();
        
        // Create event
        DocumentUploadedEvent event = new DocumentUploadedEvent(
            documentId,
            request.getTitle(),
            request.getDescription(),
            request.getOwner(),
            request.getCategoryId(),
            request.getDepartmentId(),
            request.getFileType(),
            request.getSizeKb(),
            request.getSensitivity()
        );
        
        // Publish to Kafka
        eventPublisher.publishDocumentUploaded(event);
        
        logger.info("Document uploaded successfully: {}", documentId);
        
        return event;
    }
    
    /**
     * Document upload request DTO
     */
    public static class DocumentUploadRequest {
        private String title;
        private String description;
        private String owner;
        private Long categoryId;
        private Long departmentId;
        private String fileType;
        private Integer sizeKb;
        private String sensitivity;
        
        // Getters and Setters
        public String getTitle() {
            return title;
        }
        
        public void setTitle(String title) {
            this.title = title;
        }
        
        public String getDescription() {
            return description;
        }
        
        public void setDescription(String description) {
            this.description = description;
        }
        
        public String getOwner() {
            return owner;
        }
        
        public void setOwner(String owner) {
            this.owner = owner;
        }
        
        public Long getCategoryId() {
            return categoryId;
        }
        
        public void setCategoryId(Long categoryId) {
            this.categoryId = categoryId;
        }
        
        public Long getDepartmentId() {
            return departmentId;
        }
        
        public void setDepartmentId(Long departmentId) {
            this.departmentId = departmentId;
        }
        
        public String getFileType() {
            return fileType;
        }
        
        public void setFileType(String fileType) {
            this.fileType = fileType;
        }
        
        public Integer getSizeKb() {
            return sizeKb;
        }
        
        public void setSizeKb(Integer sizeKb) {
            this.sizeKb = sizeKb;
        }
        
        public String getSensitivity() {
            return sensitivity;
        }
        
        public void setSensitivity(String sensitivity) {
            this.sensitivity = sensitivity;
        }
    }
}
