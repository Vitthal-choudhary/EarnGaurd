package com.earnguard.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "Identifier is required")
    private String identifier; // phone for worker, username for admin

    @NotBlank(message = "Password is required")
    private String password;

    private String role; // "WORKER" or "ADMIN", defaults to WORKER if absent
}
