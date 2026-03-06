package com.alok.volunteer_management_system.controller;

import com.alok.volunteer_management_system.DTOs.response.TaskResponse;
import com.alok.volunteer_management_system.DTOs.response.UserResponse;
import com.alok.volunteer_management_system.model.Task;
import com.alok.volunteer_management_system.model.User;
import com.alok.volunteer_management_system.repository.TaskRepository;
import com.alok.volunteer_management_system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;

    // GET all users (Admin only)
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        log.info("REST request to get all users by admin");

        try {
            List<User> users = userRepository.findAll();
            List<UserResponse> responses = users.stream()
                    .map(this::toUserResponse)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            log.error("Get all users failed: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // GET user by ID (Admin only)
    @GetMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUserById(@PathVariable String id) {
        log.info("REST request to get user by id: {} by admin", id);

        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            return ResponseEntity.ok(toUserResponse(user));
        } catch (Exception e) {
            log.error("Get user by id failed: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // DELETE user (Admin only)
    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        log.info("REST request to delete user by id: {} by admin", id);

        try {
            // First delete all tasks of this user
            List<Task> userTasks = taskRepository.findByUserId(id);
            for (Task task : userTasks) {
                taskRepository.deleteById(task.getId());
            }

            // Then delete the user
            userRepository.deleteById(id);

            Map<String, String> response = new HashMap<>();
            response.put("message", "User and all associated tasks deleted successfully by admin");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Delete user failed: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // GET all tasks from all users (Admin only)
    @GetMapping("/tasks/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllTasks() {
        log.info("REST request to get all tasks by admin");

        try {
            List<Task> tasks = taskRepository.findAll();
            List<TaskResponse> responses = tasks.stream()
                    .map(this::toTaskResponse)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            log.error("Get all tasks failed: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // DELETE any task by ID (Admin only)
    @DeleteMapping("/tasks/{taskId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteAnyTask(@PathVariable String taskId) {
        log.info("REST request to delete task by id: {} by admin", taskId);

        try {
            Task task = taskRepository.findById(taskId)
                    .orElseThrow(() -> new RuntimeException("Task not found"));

            taskRepository.deleteById(taskId);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Task deleted successfully by admin");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Delete task failed: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Helper method to convert User to UserResponse
    private UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .impactScore(user.getImpactScore())
                .totalHours(user.getTotalHours())
                .emailVerified(user.isEmailVerified())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    // Helper method to convert Task to TaskResponse
    private TaskResponse toTaskResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .userId(task.getUserId())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}