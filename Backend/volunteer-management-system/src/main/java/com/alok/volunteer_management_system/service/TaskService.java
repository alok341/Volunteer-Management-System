package com.alok.volunteer_management_system.service;

import com.alok.volunteer_management_system.DTOs.request.TaskRequest;
import com.alok.volunteer_management_system.DTOs.response.TaskResponse;
import com.alok.volunteer_management_system.model.Task;
import com.alok.volunteer_management_system.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TaskService {

    private final TaskRepository taskRepository;

    // CREATE task
    public TaskResponse createTask(TaskRequest taskRequest, String userId) {
        log.info("Inside TaskService : createTask() for user: {}", userId);

        Task task = Task.builder()
                .title(taskRequest.getTitle())
                .description(taskRequest.getDescription())
                .status(taskRequest.getStatus() != null ? taskRequest.getStatus() : "PENDING")
                .userId(userId)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Task savedTask = taskRepository.save(task);
        log.info("Task created successfully with ID: {} for user: {}", savedTask.getId(), userId);

        return toResponse(savedTask);
    }

    // GET all tasks for a user
    public List<TaskResponse> getTasksByUser(String userId) {
        log.info("Inside TaskService : getTasksByUser() for user: {}", userId);

        List<Task> tasks = taskRepository.findByUserId(userId);
        return tasks.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // GET single task by ID
    public TaskResponse getTaskById(String taskId, String userId) {
        log.info("Inside TaskService : getTaskById() for task: {} and user: {}", taskId, userId);

        Task task = taskRepository.findByIdAndUserId(taskId, userId);
        if (task == null) {
            log.error("Task not found with ID: {} for user: {}", taskId, userId);
            throw new RuntimeException("Task not found or you don't have permission to access it");
        }

        return toResponse(task);
    }

    // UPDATE task
    public TaskResponse updateTask(String taskId, TaskRequest taskRequest, String userId) {
        log.info("Inside TaskService : updateTask() for task: {} and user: {}", taskId, userId);

        Task existingTask = taskRepository.findByIdAndUserId(taskId, userId);
        if (existingTask == null) {
            log.error("Task not found with ID: {} for user: {}", taskId, userId);
            throw new RuntimeException("Task not found or you don't have permission to update it");
        }

        // Update fields
        if (taskRequest.getTitle() != null) {
            existingTask.setTitle(taskRequest.getTitle());
        }
        if (taskRequest.getDescription() != null) {
            existingTask.setDescription(taskRequest.getDescription());
        }
        if (taskRequest.getStatus() != null) {
            existingTask.setStatus(taskRequest.getStatus());
        }
        existingTask.setUpdatedAt(LocalDateTime.now());

        Task updatedTask = taskRepository.save(existingTask);
        log.info("Task updated successfully with ID: {} for user: {}", updatedTask.getId(), userId);

        return toResponse(updatedTask);
    }

    // DELETE task
    public void deleteTask(String taskId, String userId) {
        log.info("Inside TaskService : deleteTask() for task: {} and user: {}", taskId, userId);

        Task existingTask = taskRepository.findByIdAndUserId(taskId, userId);
        if (existingTask == null) {
            log.error("Task not found with ID: {} for user: {}", taskId, userId);
            throw new RuntimeException("Task not found or you don't have permission to delete it");
        }

        taskRepository.deleteByIdAndUserId(taskId, userId);
        log.info("Task deleted successfully with ID: {} for user: {}", taskId, userId);
    }

    // Helper method to convert Task to TaskResponse
    private TaskResponse toResponse(Task task) {
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