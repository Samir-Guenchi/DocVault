package com.example.demo.repository;

import com.example.demo.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByOwner(String owner);
    List<Document> findByCategoryId(Long categoryId);
    List<Document> findByDepartmentId(Long departmentId);
    List<Document> findByDepartmentIdIn(List<Long> departmentIds);
    
    @Query(value = "SELECT translations FROM document_translations WHERE document_id = :documentId", nativeQuery = true)
    String findTranslationsByDocumentId(@Param("documentId") Long documentId);
}
