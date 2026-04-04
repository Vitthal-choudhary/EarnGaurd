package com.earnguard.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "workers")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Worker {

    @Id
    @Column(length = 20)
    private String id;

    @Column(length = 100, nullable = false)
    private String name;

    @Column(length = 20, unique = true, nullable = false)
    private String phone;

    @Column(nullable = false)
    private String password;

    @Column(length = 100, nullable = false)
    private String zone;

    @Column(length = 10, nullable = false)
    private String pincode;

    @Column(length = 50, nullable = false)
    private String platform;

    @Column(name = "avg_daily_earnings", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal avgDailyEarnings = BigDecimal.ZERO;

    @Column(name = "avg_hourly_earnings", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal avgHourlyEarnings = BigDecimal.ZERO;

    @Column(name = "working_hours_start")
    @Builder.Default
    private Integer workingHoursStart = 9;

    @Column(name = "working_hours_end")
    @Builder.Default
    private Integer workingHoursEnd = 21;

    @Column(name = "tenure_months")
    @Builder.Default
    private Integer tenureMonths = 0;

    @Column(name = "trust_score")
    @Builder.Default
    private Integer trustScore = 100;

    @Column(length = 20)
    @Builder.Default
    private String status = "active";

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;

    @JsonIgnore
    @OneToMany(mappedBy = "worker", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Policy> policies = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "worker", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Claim> claims = new ArrayList<>();
}
