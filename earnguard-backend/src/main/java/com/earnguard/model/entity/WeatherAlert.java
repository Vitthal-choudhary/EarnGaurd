package com.earnguard.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "weather_alerts")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class WeatherAlert {

    @Id
    @Column(length = 20)
    private String id;

    @Column(length = 30, nullable = false)
    private String type;

    @Column(length = 20, nullable = false)
    private String severity;

    @Column(length = 100)
    private String zone;

    @Column(length = 10)
    private String pincode;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(name = "start_time")
    private Instant startTime;

    @Column(name = "end_time")
    private Instant endTime;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();
}
