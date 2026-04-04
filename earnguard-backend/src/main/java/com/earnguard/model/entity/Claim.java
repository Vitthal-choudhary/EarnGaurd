package com.earnguard.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "claims")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Claim {

    @Id
    @Column(length = 20)
    private String id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "worker_id", nullable = false)
    private Worker worker;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trigger_id")
    private DisruptionTrigger trigger;

    @Column(name = "trigger_name", length = 100)
    private String triggerName;

    @Column(name = "zone_affected", length = 100)
    private String zoneAffected;

    @Column(name = "disruption_hours")
    @Builder.Default
    private Integer disruptionHours = 1;

    @Column(name = "payout_amount", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal payoutAmount = BigDecimal.ZERO;

    @Column(length = 30)
    @Builder.Default
    private String status = "under_review";

    @Column(name = "fraud_score", precision = 5, scale = 4)
    @Builder.Default
    private BigDecimal fraudScore = BigDecimal.ZERO;

    @Builder.Default
    private Boolean flagged = false;

    @Column(name = "admin_notes", columnDefinition = "TEXT")
    private String adminNotes;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    @Column(name = "resolved_at")
    private Instant resolvedAt;
}
