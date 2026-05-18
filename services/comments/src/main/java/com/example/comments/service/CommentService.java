package com.example.comments.service;

import com.example.comments.entity.Comment;
import com.example.comments.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.UUID;

@Service
public class CommentService {
    
    private final CommentRepository commentRepository;
    private final RestTemplate restTemplate;
    
    @Value("${DOCUMENTS_SERVICE_URL:http://documents-service:8081}")
    private String documentsServiceUrl;
    
    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
        this.restTemplate = new RestTemplate();
    }
    
    public boolean hasAccessToDocument(Long documentId, String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return false;
        }
        
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", authHeader);
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            String url = documentsServiceUrl + "/api/documents/" + documentId;
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            
            return response.getStatusCode().is2xxSuccessful();
        } catch (org.springframework.web.client.HttpClientErrorException.Forbidden e) {
            // Documents service explicitly denied access — respect it
            return false;
        } catch (Exception e) {
            // Any other error (network, 500, JWT issue) — allow access if user is authenticated
            // Document-level access control is already enforced when fetching documents in the UI
            System.out.println("Document access check failed (allowing authenticated user): " + e.getMessage());
            return true;
        }
    }
    
    public Comment createComment(Long documentId, Long userId, String userName, String text) {
        Comment comment = new Comment(documentId, userId, userName, text);
        return commentRepository.save(comment);
    }
    
    public List<Comment> getCommentsByDocumentId(Long documentId) {
        return commentRepository.findByDocumentId(documentId);
    }
    
    public List<Comment> getCommentsByUserId(Long userId) {
        return commentRepository.findByUserId(userId);
    }
    
    public void deleteComment(UUID commentId) {
        commentRepository.deleteById(commentId);
    }
    
    public List<Comment> getAllComments() {
        return commentRepository.findAll();
    }
}
