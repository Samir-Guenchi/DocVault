package com.example.comments.repository;

import com.example.comments.entity.Comment;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.data.cassandra.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CommentRepository extends CassandraRepository<Comment, UUID> {
    
    @Query("SELECT * FROM comments WHERE document_id = ?0 ALLOW FILTERING")
    List<Comment> findByDocumentId(Long documentId);
    
    @Query("SELECT * FROM comments WHERE user_id = ?0 ALLOW FILTERING")
    List<Comment> findByUserId(Long userId);
}
