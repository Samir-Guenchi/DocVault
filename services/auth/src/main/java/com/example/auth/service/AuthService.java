package com.example.auth.service;

import com.example.auth.dto.LoginRequest;
import com.example.auth.dto.LoginResponse;
import com.example.auth.dto.RegisterRequest;
import com.example.auth.entity.User;
import com.example.auth.repository.UserDepartmentRepository;
import com.example.auth.repository.UserRepository;
import com.example.auth.security.JwtTokenProvider;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserDepartmentRepository userDepartmentRepository;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);
    
    public String hashPassword(String password, String salt) {
        return passwordEncoder.encode(salt + password);
    }
    
    public boolean verifyPassword(String rawPassword, String salt, String hashedPassword) {
        return passwordEncoder.matches(salt + rawPassword, hashedPassword);
    }
    
    public String generateSalt() {
        return UUID.randomUUID().toString();
    }
    
    @Transactional
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        
        if (!"active".equals(user.getStatus())) {
            throw new RuntimeException("Account is suspended");
        }
        
        if (!verifyPassword(request.getPassword(), user.getSalt(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }
        
        // Update last login timestamp
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
        
        // Generate JWT token
        String token = jwtTokenProvider.generateToken(user);
        
        return new LoginResponse(token, user);
    }
    
    @Transactional
    public User register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = new User();
        user.setEmail(request.getEmail());
        user.setName(request.getName() != null ? request.getName() : request.getEmail().split("@")[0]);
        
        // Generate salt and hash password
        String salt = generateSalt();
        user.setSalt(salt);
        user.setPasswordHash(hashPassword(request.getPassword(), salt));
        
        user.setCreatedAt(LocalDateTime.now());
        user.setStatus("active");
        
        // Add roles
        if (request.getRoles() != null && !request.getRoles().isEmpty()) {
            for (String role : request.getRoles()) {
                user.addRole(role);
            }
        } else {
            user.addRole("user"); // Default role
        }
        
        return userRepository.save(user);
    }
    
    @Transactional
    public void logout(String token) {
        String email = jwtTokenProvider.extractEmail(token);
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setLastLogout(LocalDateTime.now());
        userRepository.save(user);
    }
    
    public Map<String, Object> validateToken(String token) {
        if (!jwtTokenProvider.validateToken(token)) {
            throw new RuntimeException("Invalid token");
        }
        
        Claims claims = jwtTokenProvider.extractClaims(token);
        Map<String, Object> result = new HashMap<>();
        result.put("valid", true);
        result.put("userId", claims.get("userId"));
        result.put("email", claims.getSubject());
        result.put("name", claims.get("name"));
        result.put("roles", claims.get("roles"));
        result.put("departments", claims.get("departments"));
        
        return result;
    }
    
    @Transactional
    public User assignDepartment(Long userId, Long departmentId, String departmentName) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.addDepartment(departmentId, departmentName);
        return userRepository.save(user);
    }
    
    @Transactional
    public void removeDepartment(Long userId, Long departmentId) {
        userDepartmentRepository.deleteByUserIdAndDepartmentId(userId, departmentId);
    }
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    @Transactional
    public User suspendUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setStatus("suspended");
        return userRepository.save(user);
    }
    
    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        userRepository.delete(user);
    }
}
