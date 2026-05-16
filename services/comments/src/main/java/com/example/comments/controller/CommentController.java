package com.example.comments.controller;

import com.example.comments.dto.CommentRequest;
import com.example.comments.entity.Comment;
import com.example.comments.service.CommentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "*")
public class CommentController {
    
    private final CommentService commentService;
    
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }
    
    private String extractAuthHeader(jakarta.servlet.http.HttpServletRequest request) {
        return request.getHeader("Authorization");
    }
    
    @PostMapping
    public ResponseEntity<?> createComment(@RequestBody CommentRequest request, jakarta.servlet.http.HttpServletRequest httpRequest) {
        String authHeader = extractAuthHeader(httpRequest);
        if (!commentService.hasAccessToDocument(request.getDocumentId(), authHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied to this document");
        }
        
        Comment comment = commentService.createComment(
            request.getDocumentId(),
            request.getUserId(),
            request.getUserName(),
            request.getText()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(comment);
    }
    
    @GetMapping
    public ResponseEntity<?> getComments(
            @RequestParam(required = false) Long documentId,
            @RequestParam(required = false) Long userId,
            jakarta.servlet.http.HttpServletRequest httpRequest) {
        
        String authHeader = extractAuthHeader(httpRequest);
        
        if (documentId != null) {
            if (!commentService.hasAccessToDocument(documentId, authHeader)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(List.of());
            }
            return ResponseEntity.ok(commentService.getCommentsByDocumentId(documentId));
        } else if (userId != null) {
            return ResponseEntity.ok(commentService.getCommentsByUserId(userId));
        } else {
            return ResponseEntity.ok(commentService.getAllComments());
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable String id) {
        try {
            UUID commentId = UUID.fromString(id);
            commentService.deleteComment(commentId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Comments Service is running");
    }
}
