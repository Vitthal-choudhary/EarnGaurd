package com.earnguard.service;

import com.earnguard.config.JwtTokenProvider;
import com.earnguard.exception.UnauthorizedException;
import com.earnguard.model.dto.AuthResponse;
import com.earnguard.model.dto.LoginRequest;
import com.earnguard.model.entity.AdminUser;
import com.earnguard.model.entity.Worker;
import com.earnguard.repository.AdminUserRepository;
import com.earnguard.repository.WorkerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final WorkerRepository workerRepository;
    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthResponse loginWorker(LoginRequest request) {
        Worker worker = workerRepository.findByPhone(request.getIdentifier())
                .orElseThrow(() -> new UnauthorizedException("Invalid phone number or password"));

        if (!passwordEncoder.matches(request.getPassword(), worker.getPassword())) {
            throw new UnauthorizedException("Invalid phone number or password");
        }
        if (!"active".equals(worker.getStatus())) {
            throw new UnauthorizedException("Account is " + worker.getStatus());
        }

        String token = jwtTokenProvider.generateToken(worker.getId(), "WORKER");
        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .role("WORKER")
                .id(worker.getId())
                .name(worker.getName())
                .build();
    }

    public AuthResponse loginAdmin(LoginRequest request) {
        AdminUser admin = adminUserRepository.findByUsername(request.getIdentifier())
                .orElseThrow(() -> new UnauthorizedException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            throw new UnauthorizedException("Invalid username or password");
        }

        String token = jwtTokenProvider.generateToken(admin.getUsername(), "ADMIN");
        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .role("ADMIN")
                .id(String.valueOf(admin.getId()))
                .name(admin.getFullName() != null ? admin.getFullName() : admin.getUsername())
                .build();
    }
}
