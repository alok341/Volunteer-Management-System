package com.alok.volunteer_management_system.service;

import com.alok.volunteer_management_system.DTOs.request.LoginRequest;
import com.alok.volunteer_management_system.DTOs.request.RegisterRequest;
import com.alok.volunteer_management_system.DTOs.response.UserResponse;
import com.alok.volunteer_management_system.enums.Role;
import com.alok.volunteer_management_system.exceptions.ResourceExistsException;
import com.alok.volunteer_management_system.model.User;
import com.alok.volunteer_management_system.repository.UserRepository;
import com.alok.volunteer_management_system.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;

    public UserResponse register(RegisterRequest registerRequest) {
        log.info("Inside AuthService : register() for email: {}", registerRequest.getEmail());

        // Check if email already exists
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            log.error("Email already exists: {}", registerRequest.getEmail());
            throw new ResourceExistsException("Email already exists");
        }

        // Create new user
        User newUser = toDocument(registerRequest);
        User savedUser = userRepository.save(newUser);
        log.info("User registered successfully with ID: {}", savedUser.getId());

        // Send verification email
        sendVerificationEmail(savedUser);



        // Convert to response with token
        UserResponse response = toResponse(savedUser);


        return response;
    }

    private void sendVerificationEmail(User user) {
        log.info("Inside AuthService : sendVerificationEmail() to {}", user.getEmail());
        try {
            // Backend verification endpoint
            String verificationLink = "http://localhost:8080/api/auth/verify-email?token=" + user.getVerificationToken();

            String htmlContent = String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Email Verification</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h2 style="color: #4CAF50; margin-bottom: 0;">SevaSetu</h2>
                        <p style="color: #666; margin-top: 5px;">Volunteer Management Platform</p>
                    </div>
                    
                    <h3 style="color: #333;">Welcome to SevaSetu, %s!</h3>
                    
                    <p>Thank you for registering as a volunteer. Please verify your email address to activate your account:</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="%s" style="background-color: #4CAF50; color: white; padding: 14px 28px; 
                            text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">
                            Verify Email Address
                        </a>
                    </div>
                    
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p style="margin: 0; color: #666; font-size: 14px;">
                            <strong>Or copy this link to your browser:</strong><br>
                            <span style="color: #4CAF50; word-break: break-all;">%s</span>
                        </p>
                    </div>
                    
                    <p style="color: #e74c3c; font-size: 14px;">
                        ⚠️ This verification link will expire in 24 hours.
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    
                    <p style="color: #666; font-size: 13px; text-align: center;">
                        If you didn't register for SevaSetu, please ignore this email.<br>
                        &copy; 2024 SevaSetu. All rights reserved.
                    </p>
                </div>
            </body>
            </html>
            """, user.getName(), verificationLink, verificationLink);

            emailService.sendHtmlEmail(
                    user.getEmail(),
                    "🔐 Verify Your Email - SevaSetu Volunteer Platform",
                    htmlContent
            );

            log.info("Verification email sent successfully to: {}", user.getEmail());

        } catch (Exception e) {
            log.error("Failed to send verification email to: {}", user.getEmail(), e);

        }
    }

    public UserResponse login(LoginRequest loginRequest) {
        log.info("Inside AuthService : login() for email: {}", loginRequest.getEmail());

        // Find user by email
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Invalid email or password"));

        // Check password
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            log.error("Invalid password for email: {}", loginRequest.getEmail());
            throw new BadCredentialsException("Invalid email or password");
        }

        // Check if email is verified
        if (!user.isEmailVerified()) {
            log.error("Email not verified for user: {}", user.getEmail());
            throw new RuntimeException("Email is not verified. Please verify your email before logging in.");
        }

        // Generate JWT token with role
        String token = jwtUtil.generateToken(user.getId(), user.getRole());
        log.info("User logged in successfully: {} with role: {}", user.getEmail(), user.getRole());

        UserResponse response = toResponse(user);
        response.setToken(token);
        return response;
    }

    public void verifyEmail(String token) {
        log.info("Inside AuthService : verifyEmail() with token: {}", token);

        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid verification token"));

        // Check if token expired
        if (user.getVerificationExpires() != null &&
                user.getVerificationExpires().isBefore(LocalDateTime.now())) {
            log.error("Verification token expired for user: {}", user.getEmail());
            throw new RuntimeException("Verification link has expired. Please request a new one.");
        }

        // Update user
        user.setEmailVerified(true);
        user.setVerificationToken(null);
        user.setVerificationExpires(null);
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);
        log.info("Email verified successfully for user: {}", user.getEmail());
    }

    public void resendVerificationEmail(String email) {
        log.info("Inside AuthService : resendVerificationEmail() for email: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found"));

        if (user.isEmailVerified()) {
            log.error("Email already verified for user: {}", email);
            throw new RuntimeException("Email is already verified");
        }

        // Generate new verification token
        user.setVerificationToken(UUID.randomUUID().toString());
        user.setVerificationExpires(LocalDateTime.now().plusHours(24));
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);
        log.info("New verification token generated for user: {}", email);

        // Send new verification email
        sendVerificationEmail(user);
    }

    public UserResponse getProfile(String userId) {
        log.info("Inside AuthService : getProfile() for userId: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return toResponse(user);
    }

    private UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole() != null ? user.getRole() : Role.VOLUNTEER)
                .impactScore(user.getImpactScore() != null ? user.getImpactScore() : 0)
                .totalHours(user.getTotalHours() != null ? user.getTotalHours() : 0.0)
                .emailVerified(user.isEmailVerified())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    private User toDocument(RegisterRequest registerRequest) {
        LocalDateTime now = LocalDateTime.now();

        return User.builder()
                .name(registerRequest.getName())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(registerRequest.getRole() != null ? registerRequest.getRole() : Role.VOLUNTEER)
                .impactScore(0)
                .totalHours(0.0)
                .emailVerified(false)
                .verificationToken(UUID.randomUUID().toString())
                .verificationExpires(now.plusHours(24))
                .createdAt(now)
                .updatedAt(now)
                .build();
    }
}
