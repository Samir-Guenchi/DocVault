package com.example.auth.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@EqualsAndHashCode(exclude = {"userRoles", "userDepartments"})
@ToString(exclude = {"userRoles", "userDepartments"})
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @JsonIgnore
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;
    
    @JsonIgnore
    @Column(nullable = false)
    private String salt;
    
    @Column(name = "last_login")
    private LocalDateTime lastLogin;
    
    @Column(name = "last_logout")
    private LocalDateTime lastLogout;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(length = 50)
    private String status = "active";
    
    @Column(name = "name")
    private String name;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JsonProperty("roles")
    private Set<UserRole> userRoles = new HashSet<>();
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JsonProperty("departments")
    private Set<UserDepartment> userDepartments = new HashSet<>();
    
    // Helper method to get role names
    @JsonIgnore
    public Set<String> getRoleNames() {
        Set<String> roleNames = new HashSet<>();
        for (UserRole ur : userRoles) {
            roleNames.add(ur.getRole());
        }
        return roleNames;
    }
    
    // Helper method to get department IDs
    @JsonIgnore
    public Set<Long> getDepartmentIds() {
        Set<Long> deptIds = new HashSet<>();
        for (UserDepartment ud : userDepartments) {
            deptIds.add(ud.getDepartmentId());
        }
        return deptIds;
    }
    
    // Helper method to add role
    public void addRole(String roleName) {
        UserRole userRole = new UserRole();
        userRole.setUser(this);
        userRole.setRole(roleName);
        this.userRoles.add(userRole);
    }
    
    // Helper method to add department
    public void addDepartment(Long departmentId, String departmentName) {
        UserDepartment userDept = new UserDepartment();
        userDept.setUser(this);
        userDept.setDepartmentId(departmentId);
        userDept.setDepartmentName(departmentName);
        this.userDepartments.add(userDept);
    }
}
