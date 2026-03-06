package com.alok.volunteer_management_system.controller;

import com.alok.volunteer_management_system.DTOs.request.TaskRequest;
import com.alok.volunteer_management_system.DTOs.response.TaskResponse;
import com.alok.volunteer_management_system.service.TaskService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@Slf4j
public class TaskController {

    private final TaskService taskService;

    // CREATE Task
    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody TaskRequest taskRequest) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        log.info("REST request to create task for user: {}", userId);

        try {
            TaskResponse response = taskService.createTask(taskRequest, userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Create task failed: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // GET ALL Tasks for logged in user
    @GetMapping
    public ResponseEntity<?> getAllTasks() {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        log.info("REST request to get all tasks for user: {}", userId);

        try {
            List<TaskResponse> responses = taskService.getTasksByUser(userId);
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            log.error("Get all tasks failed: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // GET Task by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getTaskById(@PathVariable String id) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        log.info("REST request to get task by id: {} for user: {}", id, userId);

        try {
            TaskResponse response = taskService.getTaskById(id, userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Get task by id failed: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // UPDATE Task
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable String id, @RequestBody TaskRequest taskRequest) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        log.info("REST request to update task by id: {} for user: {}", id, userId);

        try {
            TaskResponse response = taskService.updateTask(id, taskRequest, userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Update task failed: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // DELETE Task
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable String id) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        log.info("REST request to delete task by id: {} for user: {}", id, userId);

        try {
            taskService.deleteTask(id, userId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Task deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Delete task failed: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}