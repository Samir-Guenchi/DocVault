package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "documents")
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(name = "created_at")
    private LocalDate createdAt = LocalDate.now();

    private String owner;

    @Column(name = "category_id")
    private Long categoryId;

    @Column(name = "department_id")
    private Long departmentId;

    @Column(name = "file_type")
    private String fileType;

    @Column(name = "size_kb")
    private Integer sizeKb;

    private String sensitivity = "internal";

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String t) { this.title = t; }
    public String getDescription() { return description; }
    public void setDescription(String d) { this.description = d; }
    public LocalDate getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDate c) { this.createdAt = c; }
    public String getOwner() { return owner; }
    public void setOwner(String o) { this.owner = o; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long c) { this.categoryId = c; }
    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long d) { this.departmentId = d; }
    public String getFileType() { return fileType; }
    public void setFileType(String f) { this.fileType = f; }
    public Integer getSizeKb() { return sizeKb; }
    public void setSizeKb(Integer s) { this.sizeKb = s; }
    public String getSensitivity() { return sensitivity; }
    public void setSensitivity(String s) { this.sensitivity = s; }
}
