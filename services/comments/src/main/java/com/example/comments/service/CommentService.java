package com.example.comments.service;

import com.example.comments.entity.Comment;
import com.example.comments.repository.CommentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CommentService {
    
    private final CommentRepository commentRepository;
    
    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
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
