package com.alok.volunteer_management_system.DTOs.response;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponse {

    private String id;

    private String title;

    private String description;

    private String status;

    private String userId;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
