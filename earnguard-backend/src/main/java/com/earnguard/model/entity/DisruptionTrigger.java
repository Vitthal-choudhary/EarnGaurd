package com.earnguard.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "disruption_triggers")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DisruptionTrigger {

    @Id
    @Column(length = 20)
    private String id;

    @Column(length = 100, nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 100)
    private String threshold;

    @Column(length = 50)
    private String icon;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();
}
