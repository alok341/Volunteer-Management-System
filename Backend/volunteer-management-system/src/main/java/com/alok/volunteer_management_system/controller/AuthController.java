package com.alok.volunteer_management_system.controller;

import com.alok.volunteer_management_system.DTOs.request.EmailRequest;
import com.alok.volunteer_management_system.DTOs.request.LoginRequest;
import com.alok.volunteer_management_system.DTOs.request.RegisterRequest;
import com.alok.volunteer_management_system.DTOs.response.UserResponse;
import com.alok.volunteer_management_system.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        log.info("REST request to register user: {}", registerRequest.getEmail());
        try {
            UserResponse response = authService.register(registerRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Registration failed: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        log.info("REST request to login user: {}", loginRequest.getEmail());
        try {
            UserResponse response = authService.login(loginRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Login failed: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        log.info("REST request to verify email with token: {}", token);
        try {
            authService.verifyEmail(token);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Email verified successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Email verification failed: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerificationEmail(@RequestBody EmailRequest emailRequest) {
        log.info("REST request to resend verification email to: {}", emailRequest.getEmail());
        try {
            authService.resendVerificationEmail(emailRequest.getEmail());
            Map<String, String> response = new HashMap<>();
            response.put("message", "Verification email resent successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Resend verification failed: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        log.info("REST request to get profile for user: {}", userId);
        try {
            UserResponse response = authService.getProfile(userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Get profile failed: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}