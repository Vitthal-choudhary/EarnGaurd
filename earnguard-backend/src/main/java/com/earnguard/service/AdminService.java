package com.earnguard.service;

import com.earnguard.model.dto.AdminDashboardResponse;
import com.earnguard.model.entity.Claim;
import com.earnguard.model.entity.Worker;
import com.earnguard.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final WorkerRepository workerRepository;
    private final PolicyRepository policyRepository;
    private final ClaimRepository claimRepository;
    private final WeatherAlertRepository alertRepository;
    private final DisruptionTriggerRepository triggerRepository;

    public AdminDashboardResponse getDashboardStats() {
        long totalWorkers = workerRepository.count();
        long activePolicies = policyRepository.countByStatus("active");
        long pendingClaims = claimRepository.countByStatus("under_review");
        long flaggedClaims = claimRepository.countByFlaggedTrue();
        BigDecimal totalPayouts = claimRepository.sumPaidPayouts();
        long totalClaims = claimRepository.count();
        long approvedClaims = claimRepository.countByStatus("approved")
                + claimRepository.countByStatus("auto_approved")
                + claimRepository.countByStatus("paid");
        long rejectedClaims = claimRepository.countByStatus("rejected");

        BigDecimal safePayouts = totalPayouts != null ? totalPayouts : BigDecimal.ZERO;
        double approvalRate = totalClaims > 0 ? Math.round((double) approvedClaims / totalClaims * 1000) / 10.0 : 0;

        return AdminDashboardResponse.builder()
                .totalWorkers(totalWorkers)
                .activePolicies(activePolicies)
                .pendingClaims(pendingClaims)
                .flaggedClaims(flaggedClaims)
                .totalPayoutsIssued(safePayouts)
                .totalClaims(totalClaims)
                .approvedClaims(approvedClaims)
                .rejectedClaims(rejectedClaims)
                .todayPayouts(safePayouts)
                .claimApprovalRate(approvalRate)
                .avgClaimTime("< 60 sec")
                .fraudAlertsToday(flaggedClaims)
                .build();
    }

    public List<Worker> getAllWorkers() {
        return workerRepository.findAll();
    }

    public List<Claim> getAllClaims() {
        return claimRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Claim> getFlaggedClaims() {
        return claimRepository.findByFlaggedTrueOrderByCreatedAtDesc();
    }

    public Map<String, Object> getFraudStats() {
        long flagged = claimRepository.countByFlaggedTrue();
        long total = claimRepository.count();
        double fraudRate = total > 0 ? (double) flagged / total * 100 : 0;
        return Map.of(
                "flaggedClaims", flagged,
                "totalClaims", total,
                "fraudRate", Math.round(fraudRate * 10.0) / 10.0
        );
    }
}
