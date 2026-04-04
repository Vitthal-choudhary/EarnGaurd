package com.earnguard.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "policies")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Policy {

    @Id
    @Column(length = 30)
    private String id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "worker_id", nullable = false)
    private Worker worker;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id", nullable = false)
    private PremiumPlan plan;

    @Column(name = "weekly_premium", nullable = false, precision = 10, scale = 2)
    private BigDecimal weeklyPremium;

    @Column(name = "coverage_cap", nullable = false, precision = 10, scale = 2)
    private BigDecimal coverageCap;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(length = 20)
    @Builder.Default
    private String status = "active";

    @Column(name = "risk_tier", length = 20)
    @Builder.Default
    private String riskTier = "medium";

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}
