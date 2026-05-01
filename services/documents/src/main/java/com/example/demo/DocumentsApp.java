package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import jakarta.persistence.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

@SpringBootApplication
public class DocumentsApp {
    public static void main(String[] args) {
        SpringApplication.run(DocumentsApp.class, args);
    }
}

@Entity
class Document {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    public String title;
}

interface DocumentRepository extends JpaRepository<Document, Long> {}

@RestController
@RequestMapping("/documents")
class DocumentController {
    private final DocumentRepository repository;
    public DocumentController(DocumentRepository repository) { this.repository = repository; }
    @GetMapping("/list")
    public List<Document> list() { return repository.findAll(); }
    @PostMapping("/add")
    public Document add(@RequestParam String title) { Document d = new Document(); d.title = title; return repository.save(d); }
    @GetMapping("/get/{id}")
    public Document get(@PathVariable Long id) { return repository.findById(id).orElse(null); }
}
