package com.alok.volunteer_management_system.DTOs.response;

import com.alok.volunteer_management_system.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private String id;
    private String name;
    private String email;
    private Role role;
    private Integer impactScore;
    private Double totalHours;
    private boolean emailVerified;
    private String token;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
