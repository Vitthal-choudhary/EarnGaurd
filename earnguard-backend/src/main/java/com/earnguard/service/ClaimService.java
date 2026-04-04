package com.earnguard.service;

import com.earnguard.exception.BadRequestException;
import com.earnguard.exception.ResourceNotFoundException;
import com.earnguard.model.dto.ClaimResponse;
import com.earnguard.model.dto.DisruptionCreateRequest;
import com.earnguard.model.entity.Claim;
import com.earnguard.model.entity.DisruptionTrigger;
import com.earnguard.model.entity.Policy;
import com.earnguard.model.entity.Worker;
import com.earnguard.repository.ClaimRepository;
import com.earnguard.repository.DisruptionTriggerRepository;
import com.earnguard.repository.PolicyRepository;
import com.earnguard.repository.WorkerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final WorkerRepository workerRepository;
    private final DisruptionTriggerRepository triggerRepository;
    private final PolicyRepository policyRepository;

    @Transactional
    public Claim submitClaim(String workerId, DisruptionCreateRequest req) {
        Worker worker = workerRepository.findById(workerId)
                .orElseThrow(() -> new ResourceNotFoundException("Worker not found"));

        DisruptionTrigger trigger = triggerRepository.findById(req.getTriggerId())
                .orElseThrow(() -> new ResourceNotFoundException("Trigger not found: " + req.getTriggerId()));

        Policy policy = policyRepository.findTopByWorker_IdAndStatusOrderByCreatedAtDesc(workerId, "active")
                .orElseThrow(() -> new BadRequestException("No active policy. Please subscribe to a plan first."));

        // Simple payout: hourly earnings * disruption hours, capped by policy coverage
        BigDecimal baseAmount = worker.getAvgHourlyEarnings()
                .multiply(BigDecimal.valueOf(req.getDisruptionHours()));
        BigDecimal payoutAmount = baseAmount.min(policy.getCoverageCap());

        String claimId = "CLM-" + workerId.substring(workerId.length() - 4).toUpperCase()
                + "-" + System.currentTimeMillis() % 100000;

        Claim claim = Claim.builder()
                .id(claimId)
                .worker(worker)
                .trigger(trigger)
                .triggerName(trigger.getName())
                .zoneAffected(req.getZoneAffected() != null ? req.getZoneAffected() : worker.getZone())
                .disruptionHours(req.getDisruptionHours())
                .payoutAmount(payoutAmount)
                .status("under_review")
                .fraudScore(BigDecimal.ZERO)
                .flagged(false)
                .build();

        return claimRepository.save(claim);
    }

    @Transactional
    public Claim resolveClaim(String claimId, String status, String adminNotes) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found: " + claimId));

        List<String> allowedStatuses = List.of("approved", "rejected", "paid");
        if (!allowedStatuses.contains(status)) {
            throw new BadRequestException("Invalid status: " + status);
        }

        claim.setStatus(status);
        claim.setAdminNotes(adminNotes);
        claim.setResolvedAt(Instant.now());
        return claimRepository.save(claim);
    }

    public ClaimResponse toResponse(Claim claim) {
        return ClaimResponse.builder()
                .id(claim.getId())
                .workerId(claim.getWorker().getId())
                .workerName(claim.getWorker().getName())
                .triggerId(claim.getTrigger() != null ? claim.getTrigger().getId() : null)
                .triggerName(claim.getTriggerName())
                .zoneAffected(claim.getZoneAffected())
                .disruptionHours(claim.getDisruptionHours())
                .payoutAmount(claim.getPayoutAmount())
                .status(claim.getStatus())
                .fraudScore(claim.getFraudScore())
                .flagged(claim.getFlagged())
                .adminNotes(claim.getAdminNotes())
                .createdAt(claim.getCreatedAt())
                .resolvedAt(claim.getResolvedAt())
                .build();
    }
}
