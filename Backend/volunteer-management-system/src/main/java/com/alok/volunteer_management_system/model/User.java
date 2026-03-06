package com.alok.volunteer_management_system.model;

import com.alok.volunteer_management_system.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    private String id;

    private String name;

    @Indexed(unique = true)
    private String email;

    private String password;

    private Role role;

    private Integer impactScore;

    private Double totalHours;

    // Email verification fields
    private boolean emailVerified;
    private String verificationToken;
    private LocalDateTime verificationExpires;

    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}