package com.example.comments.entity;

import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.Table;
import org.springframework.data.cassandra.core.mapping.Column;

import java.time.Instant;
import java.util.UUID;

@Table("comments")
public class Comment {
    
    @PrimaryKey
    private UUID id;
    
    @Column("document_id")
    private Long documentId;
    
    @Column("user_id")
    private Long userId;
    
    @Column("user_name")
    private String userName;
    
    @Column("text")
    private String text;
    
    @Column("created_at")
    private Instant createdAt;
    
    public Comment() {
        this.id = UUID.randomUUID();
        this.createdAt = Instant.now();
    }
    
    public Comment(Long documentId, Long userId, String userName, String text) {
        this();
        this.documentId = documentId;
        this.userId = userId;
        this.userName = userName;
        this.text = text;
    }
    
    // Getters and Setters
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
    }
    
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
    
    public Instant getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
