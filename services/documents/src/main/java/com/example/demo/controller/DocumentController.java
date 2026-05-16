package com.example.demo.controller;

import com.example.demo.entity.Document;
import com.example.demo.event.DocumentUploadedEvent;
import com.example.demo.repository.DocumentRepository;
import com.example.demo.service.DocumentEventPublisher;
import com.example.demo.service.S3StorageService;
import com.example.demo.service.AuditService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "*")
public class DocumentController {

    private final DocumentRepository repo;
    private final DocumentEventPublisher eventPublisher;
    private final S3StorageService s3StorageService;
    private final AuditService auditService;

    public DocumentController(DocumentRepository repo, DocumentEventPublisher eventPublisher,
                              S3StorageService s3StorageService, AuditService auditService) {
        this.repo = repo;
        this.eventPublisher = eventPublisher;
        this.s3StorageService = s3StorageService;
        this.auditService = auditService;
    }

    @GetMapping
    public ResponseEntity<List<Document>> getAll(HttpServletRequest request) {
        @SuppressWarnings("unchecked")
        List<Integer> userDepartments = (List<Integer>) request.getAttribute("userDepartments");
        List<String> userRoles = (List<String>) request.getAttribute("userRoles");
        
        // Admin can see all documents
        if (userRoles != null && userRoles.contains("admin")) {
            return ResponseEntity.ok(repo.findAll());
        }
        
        // Users see only documents from their departments
        if (userDepartments == null || userDepartments.isEmpty()) {
            return ResponseEntity.ok(List.of()); // No departments = no documents
        }
        
        List<Long> deptIds = userDepartments.stream().map(Long::valueOf).toList();
        return ResponseEntity.ok(repo.findByDepartmentIdIn(deptIds));
    }

    @GetMapping("/{id}")
    @Cacheable(value = "documents", key = "#id")
    public ResponseEntity<?> getById(@PathVariable Long id, HttpServletRequest request) {
        @SuppressWarnings("unchecked")
        List<Integer> userDepartments = (List<Integer>) request.getAttribute("userDepartments");
        List<String> userRoles = (List<String>) request.getAttribute("userRoles");
        
        return repo.findById(id).map(doc -> {
            // Admin can see all documents
            if (userRoles != null && userRoles.contains("admin")) {
                return ResponseEntity.ok(doc);
            }
            
            // Check if user has access to this document's department
            if (userDepartments != null && userDepartments.contains(doc.getDepartmentId().intValue())) {
                return ResponseEntity.ok(doc);
            }
            
            // 403 Forbidden (not 404) - document exists but user doesn't have access
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", "Access denied to this document"));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/translations")
    public ResponseEntity<?> getTranslations(@PathVariable Long id, HttpServletRequest request) {
        @SuppressWarnings("unchecked")
        List<Integer> userDepartments = (List<Integer>) request.getAttribute("userDepartments");
        List<String> userRoles = (List<String>) request.getAttribute("userRoles");

        return repo.findById(id).map(doc -> {
            boolean hasAccess = false;
            if (userRoles != null && userRoles.contains("admin")) {
                hasAccess = true;
            } else if (userDepartments != null && userDepartments.contains(doc.getDepartmentId().intValue())) {
                hasAccess = true;
            }

            if (!hasAccess) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access denied to this document"));
            }

            String translations = repo.findTranslationsByDocumentId(id);
            if (translations == null) {
                return ResponseEntity.ok(Map.of());
            }
            // Return raw JSON string as application/json
            return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body(translations);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @CacheEvict(value = "documents", allEntries = true)
    public ResponseEntity<Document> create(@RequestBody Document doc, HttpServletRequest request) {
        // SECURITY: Extract owner from JWT, never trust request body
        Long ownerId = (Long) request.getAttribute("userId");
        String ownerEmail = (String) request.getAttribute("userEmail");
        String ownerName = (String) request.getAttribute("userName");
        
        if (ownerId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        // Set owner information from JWT
        doc.setOwnerId(ownerId);
        doc.setOwner(ownerName != null ? ownerName : ownerEmail);
        
        if (doc.getCreatedAt() == null) doc.setCreatedAt(LocalDate.now());
        Document saved = repo.save(doc);

        auditService.logEvent("CREATE_DOCUMENT", doc.getOwner(), "Document", saved.getId().toString(), "Document created successfully");

        // Publish Kafka event
        publishKafkaEvent(saved);

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    /**
     * Upload document with file attachment to S3/MinIO
     * Accepts multipart form data with file + metadata fields
     */
    @PostMapping("/upload")
    @CacheEvict(value = "documents", allEntries = true)
    public ResponseEntity<Document> uploadWithFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false, defaultValue = "") String description,
            @RequestParam(value = "categoryId", required = false, defaultValue = "1") Long categoryId,
            @RequestParam(value = "departmentId", required = false, defaultValue = "1") Long departmentId,
            @RequestParam(value = "sensitivity", required = false, defaultValue = "internal") String sensitivity,
            HttpServletRequest request) {

        // SECURITY: Extract owner from JWT, never trust request parameters
        Long ownerId = (Long) request.getAttribute("userId");
        String ownerEmail = (String) request.getAttribute("userEmail");
        String ownerName = (String) request.getAttribute("userName");
        
        if (ownerId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            // Upload file to S3/MinIO
            String fileUrl = s3StorageService.uploadFile(file);

            // Determine file type from original filename
            String originalFilename = file.getOriginalFilename();
            String fileType = "pdf";
            if (originalFilename != null && originalFilename.contains(".")) {
                fileType = originalFilename.substring(originalFilename.lastIndexOf(".") + 1);
            }

            // Create document record
            Document doc = new Document();
            doc.setTitle(title);
            doc.setDescription(description);
            doc.setOwner(ownerName != null ? ownerName : ownerEmail);
            doc.setOwnerId(ownerId);
            doc.setCategoryId(categoryId);
            doc.setDepartmentId(departmentId);
            doc.setFileType(fileType);
            doc.setSizeKb((int) (file.getSize() / 1024));
            doc.setSensitivity(sensitivity);
            doc.setFileUrl(fileUrl);
            doc.setCreatedAt(LocalDate.now());

            Document saved = repo.save(doc);

            auditService.logEvent("UPLOAD_DOCUMENT", doc.getOwner(), "Document", saved.getId().toString(), "Document uploaded with file");

            // Publish Kafka event
            publishKafkaEvent(saved);

            return ResponseEntity.status(HttpStatus.CREATED).body(saved);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PatchMapping("/{id}")
    @CacheEvict(value = "documents", key = "#id")
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
                    case "fileUrl" -> doc.setFileUrl((String) v);
                }
            });
            return ResponseEntity.ok(repo.save(doc));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @CacheEvict(value = "documents", key = "#id")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (repo.existsById(id)) { 
            repo.deleteById(id); 
            auditService.logEvent("DELETE_DOCUMENT", "System", "Document", id.toString(), "Document deleted");
            return ResponseEntity.noContent().build(); 
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Documents Service is running");
    }

    /** Publish Kafka event (non-blocking — Kafka may not be running) */
    private void publishKafkaEvent(Document saved) {
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
    }
}
