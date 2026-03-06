package com.alok.volunteer_management_system.model;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tasks")
public class Task {

    @Id
    private String id;

    private String title;

    private String description;

    private String status; // PENDING, IN_PROGRESS, COMPLETED

    private String userId; // Reference to the user who owns this task

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}