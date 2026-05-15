package com.example.auth.dto;

import lombok.Data;

@Data
public class AssignDepartmentRequest {
    private Long userId;
    private Long departmentId;
    private String departmentName;
}
