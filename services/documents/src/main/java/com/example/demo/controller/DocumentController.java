package com.example.demo.controller;

import com.example.demo.entity.Document;
import com.example.demo.event.DocumentUploadedEvent;
import com.example.demo.repository.DocumentRepository;
import com.example.demo.service.DocumentEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "*")
public class DocumentController {

    private final DocumentRepository repo;
    private final DocumentEventPublisher eventPublisher;

    public DocumentController(DocumentRepository repo, DocumentEventPublisher eventPublisher) {
        this.repo = repo;
        this.eventPublisher = eventPublisher;
    }

    @GetMapping
    public List<Document> getAll() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Document> getById(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Document> create(@RequestBody Document doc) {
        if (doc.getCreatedAt() == null) doc.setCreatedAt(LocalDate.now());
        Document saved = repo.save(doc);

        // Publish Kafka event
        try {
            DocumentUploadedEvent event = new DocumentUploadedEvent(
                saved.getId(), saved.getTitle(), saved.getDescription(),
                saved.getOwner(), saved.getCategoryId(), saved.getDepartmentId(),
                saved.getFileType(), saved.getSizeKb(), saved.getSensitivity()
            );
            eventPublisher.publishDocumentUploaded(event);
        } catch (Exception e) {
            // Kafka may not be running — don't fail the upload
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Document> patch(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        return repo.findById(id).map(doc -> {
            updates.forEach((k, v) -> {
                switch (k) {
                    case "title" -> doc.setTitle((String) v);
                    case "description" -> doc.setDescription((String) v);
                    case "owner" -> doc.setOwner((String) v);
                    case "categoryId" -> doc.setCategoryId(Long.valueOf(v.toString()));
                    case "departmentId" -> doc.setDepartmentId(Long.valueOf(v.toString()));
                    case "fileType" -> doc.setFileType((String) v);
                    case "sensitivity" -> doc.setSensitivity((String) v);
                }
            });
            return ResponseEntity.ok(repo.save(doc));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (repo.existsById(id)) { repo.deleteById(id); return ResponseEntity.noContent().build(); }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Documents Service is running");
    }
}
