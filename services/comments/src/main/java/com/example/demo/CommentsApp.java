package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import jakarta.persistence.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@SpringBootApplication
public class CommentsApp {
    public static void main(String[] args) {
        SpringApplication.run(CommentsApp.class, args);
    }
}

@Entity
@Table(name = "comments")
class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "document_id", nullable = false)
    private Long documentId;

    @Column(name = "user_name")
    private String user;

    @Column(columnDefinition = "TEXT")
    private String text;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getDocumentId() { return documentId; }
    public void setDocumentId(Long documentId) { this.documentId = documentId; }
    public String getUser() { return user; }
    public void setUser(String user) { this.user = user; }
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByDocumentIdOrderByCreatedAtDesc(Long documentId);
}

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "*")
class CommentController {

    private final CommentRepository repository;

    public CommentController(CommentRepository repository) {
        this.repository = repository;
    }

    /** GET /api/comments?documentId=123 — fetch comments for a document */
    @GetMapping
    public List<Comment> getComments(@RequestParam(required = false) Long documentId) {
        if (documentId != null) {
            return repository.findByDocumentIdOrderByCreatedAtDesc(documentId);
        }
        return repository.findAll();
    }

    /** POST /api/comments — create comment (JSON body: {documentId, user, text}) */
    @PostMapping
    public Comment create(@RequestBody Map<String, Object> body) {
        Comment c = new Comment();
        c.setDocumentId(Long.valueOf(body.get("documentId").toString()));
        c.setUser((String) body.getOrDefault("user", "Anonymous"));
        c.setText((String) body.getOrDefault("text", ""));
        c.setCreatedAt(LocalDateTime.now());
        return repository.save(c);
    }

    /** GET /api/comments/{id} */
    @GetMapping("/{id}")
    public Comment getById(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }

    /** DELETE /api/comments/{id} */
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }

    /** Health check */
    @GetMapping("/health")
    public String health() {
        return "Comments Service is running";
    }
}
