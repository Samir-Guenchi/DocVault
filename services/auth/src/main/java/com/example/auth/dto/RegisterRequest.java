package com.example.auth.dto;

import lombok.Data;
import java.util.Set;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String name;
    private Set<String> roles;
}
