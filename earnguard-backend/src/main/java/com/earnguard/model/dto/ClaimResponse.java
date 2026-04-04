package com.earnguard.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClaimResponse {
    private String id;
    private String workerId;
    private String workerName;
    private String triggerId;
    private String triggerName;
    private String zoneAffected;
    private Integer disruptionHours;
    private BigDecimal payoutAmount;
    private String status;
    private BigDecimal fraudScore;
    private Boolean flagged;
    private String adminNotes;
    private Instant createdAt;
    private Instant resolvedAt;
}
