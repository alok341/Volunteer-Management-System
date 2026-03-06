package com.alok.volunteer_management_system.repository;


import com.alok.volunteer_management_system.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
    Optional<User> findByVerificationToken(String token);
}