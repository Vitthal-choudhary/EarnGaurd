package com.earnguard.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {
    private long totalWorkers;
    private long activePolicies;
    private long pendingClaims;
    private long flaggedClaims;
    private BigDecimal totalPayoutsIssued;
    private long totalClaims;
    private long approvedClaims;
    private long rejectedClaims;
    // Fields expected by the frontend
    private BigDecimal todayPayouts;
    private double claimApprovalRate;
    private String avgClaimTime;
    private long fraudAlertsToday;
}
