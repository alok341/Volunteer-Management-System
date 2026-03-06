package com.alok.volunteer_management_system.DTOs.request;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}
