package com.example.demo.controller;

import com.example.demo.entity.AppUser;
import com.example.demo.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository repo;

    public UserController(UserRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<AppUser> getAll() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppUser> getById(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /** Simple login — matches email + password, returns user or 401 */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> creds) {
        String email = creds.get("email");
        String password = creds.get("password");
        return repo.findByEmail(email)
                .filter(u -> u.getPassword().equals(password) && !"suspended".equals(u.getStatus()))
                .map(u -> ResponseEntity.ok((Object) u))
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid credentials or suspended account")));
    }

    @PostMapping
    public ResponseEntity<AppUser> create(@RequestBody AppUser user) {
        if (user.getStatus() == null) user.setStatus("active");
        return ResponseEntity.status(HttpStatus.CREATED).body(repo.save(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AppUser> update(@PathVariable Long id, @RequestBody AppUser updated) {
        return repo.findById(id).map(u -> {
            if (updated.getName() != null) u.setName(updated.getName());
            if (updated.getEmail() != null) u.setEmail(updated.getEmail());
            if (updated.getRole() != null) u.setRole(updated.getRole());
            if (updated.getDepartmentId() != null) u.setDepartmentId(updated.getDepartmentId());
            if (updated.getStatus() != null) u.setStatus(updated.getStatus());
            if (updated.getPassword() != null) u.setPassword(updated.getPassword());
            return ResponseEntity.ok(repo.save(u));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}")
    public ResponseEntity<AppUser> patch(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        return repo.findById(id).map(u -> {
            updates.forEach((k, v) -> {
                switch (k) {
                    case "name" -> u.setName((String) v);
                    case "email" -> u.setEmail((String) v);
                    case "role" -> u.setRole((String) v);
                    case "status" -> u.setStatus((String) v);
                    case "departmentId" -> u.setDepartmentId(Long.valueOf(v.toString()));
                }
            });
            return ResponseEntity.ok(repo.save(u));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (repo.existsById(id)) { repo.deleteById(id); return ResponseEntity.noContent().build(); }
        return ResponseEntity.notFound().build();
    }
}
