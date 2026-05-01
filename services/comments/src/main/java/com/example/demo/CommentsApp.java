package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import jakarta.persistence.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

@SpringBootApplication
public class CommentsApp {
    public static void main(String[] args) {
        SpringApplication.run(CommentsApp.class, args);
    }
}

@Entity
class Comment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    public Long docId;
    public String content;
}

interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByDocId(Long docId);
}

@RestController
@RequestMapping("/comments")
class CommentController {
    private final CommentRepository repository;
    public CommentController(CommentRepository repository) { this.repository = repository; }
    @GetMapping("/list/{docId}")
    public List<Comment> list(@PathVariable Long docId) { return repository.findByDocId(docId); }
    @PostMapping("/add")
    public Comment add(@RequestParam Long docId, @RequestParam String content) { Comment c = new Comment(); c.docId = docId; c.content = content; return repository.save(c); }
}
