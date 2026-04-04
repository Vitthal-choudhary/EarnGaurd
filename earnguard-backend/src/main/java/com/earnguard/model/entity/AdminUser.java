package com.earnguard.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "admin_users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AdminUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 50, unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(length = 100, unique = true)
    private String email;

    @Column(name = "full_name", length = 100)
    private String fullName;

    @Column(length = 20)
    @Builder.Default
    private String role = "ADMIN";

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();
}
