package com.alok.volunteer_management_system.repository;



import com.alok.volunteer_management_system.model.Task;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskRepository extends MongoRepository<Task, String> {

    // Find all tasks for a specific user
    List<Task> findByUserId(String userId);

    // Find task by ID and userId (to ensure user can only access their own tasks)
    Task findByIdAndUserId(String id, String userId);

    // Delete task by ID and userId
    void deleteByIdAndUserId(String id, String userId);
}