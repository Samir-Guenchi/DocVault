package com.example.demo.event;

import java.time.Instant;

/**
 * Event published when a document is uploaded
 * Contains all metadata needed for downstream processing
 */
public class DocumentUploadedEvent {
    
    private Long documentId;
    private String title;
    private String description;
    private String owner;
    private Long categoryId;
    private Long departmentId;
    private String fileType;
    private Integer sizeKb;
    private String sensitivity;
    private Long uploadedAt;
    
    // Constructors
    public DocumentUploadedEvent() {
        this.uploadedAt = Instant.now().toEpochMilli();
    }
    
    public DocumentUploadedEvent(Long documentId, String title, String description, 
                                 String owner, Long categoryId, Long departmentId,
                                 String fileType, Integer sizeKb, String sensitivity) {
        this.documentId = documentId;
        this.title = title;
        this.description = description;
        this.owner = owner;
        this.categoryId = categoryId;
        this.departmentId = departmentId;
        this.fileType = fileType;
        this.sizeKb = sizeKb;
        this.sensitivity = sensitivity;
        this.uploadedAt = Instant.now().toEpochMilli();
    }
    
    // Getters and Setters
    public Long getDocumentId() {
        return documentId;
    }
    
    public void setDocumentId(Long documentId) {
        this.documentId = documentId;
    }
    
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
    
    public Long getUploadedAt() {
        return uploadedAt;
    }
    
    public void setUploadedAt(Long uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
    
    @Override
    public String toString() {
        return "DocumentUploadedEvent{" +
                "documentId=" + documentId +
                ", title='" + title + '\'' +
                ", owner='" + owner + '\'' +
                ", fileType='" + fileType + '\'' +
                ", uploadedAt=" + uploadedAt +
                '}';
    }
}
