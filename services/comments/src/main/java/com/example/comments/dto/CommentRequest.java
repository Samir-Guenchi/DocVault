package com.example.comments.dto;

public class CommentRequest {
    private Long documentId;
    private Long userId;
    private String userName;
    private String text;
    
    public CommentRequest() {}
    
    public CommentRequest(Long documentId, Long userId, String userName, String text) {
        this.documentId = documentId;
        this.userId = userId;
        this.userName = userName;
        this.text = text;
    }
    
    // Getters and Setters
    public Long getDocumentId() {
        return documentId;
    }
    
    public void setDocumentId(Long documentId) {
        this.documentId = documentId;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getUserName() {
        return userName;
    }
    
    public void setUserName(String userName) {
        this.userName = userName;
    }
    
    public String getText() {
        return text;
    }
    
    public void setText(String text) {
        this.text = text;
    }
}
