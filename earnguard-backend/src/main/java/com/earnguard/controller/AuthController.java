package com.earnguard.controller;

import com.earnguard.model.dto.ApiResponse;
import com.earnguard.model.dto.AuthResponse;
import com.earnguard.model.dto.LoginRequest;
import com.earnguard.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/worker/login")
    public ResponseEntity<ApiResponse<AuthResponse>> workerLogin(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.loginWorker(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    @PostMapping("/admin/login")
    public ResponseEntity<ApiResponse<AuthResponse>> adminLogin(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.loginAdmin(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }
}
