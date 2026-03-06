package com.alok.volunteer_management_system.DTOs.request;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskRequest {

    private String title;

    private String description;

    private String status; // PENDING, IN_PROGRESS, COMPLETED
}