package com.example.auth.repository;

import com.example.auth.entity.UserDepartment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserDepartmentRepository extends JpaRepository<UserDepartment, Long> {
    List<UserDepartment> findByUserId(Long userId);
    void deleteByUserIdAndDepartmentId(Long userId, Long departmentId);
}
