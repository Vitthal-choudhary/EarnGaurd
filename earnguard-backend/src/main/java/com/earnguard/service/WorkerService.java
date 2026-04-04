package com.earnguard.service;

import com.earnguard.exception.ResourceNotFoundException;
import com.earnguard.model.dto.ClaimResponse;
import com.earnguard.model.entity.*;
import com.earnguard.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class WorkerService {

    private final WorkerRepository workerRepository;
    private final PolicyRepository policyRepository;
    private final ClaimRepository claimRepository;
    private final WeatherAlertRepository weatherAlertRepository;
    private final PremiumPlanRepository premiumPlanRepository;
    private final DisruptionTriggerRepository triggerRepository;

    public Worker getWorker(String workerId) {
        return workerRepository.findById(workerId)
                .orElseThrow(() -> new ResourceNotFoundException("Worker not found: " + workerId));
    }

    public Policy getActivePolicy(String workerId) {
        return policyRepository.findTopByWorker_IdAndStatusOrderByCreatedAtDesc(workerId, "active")
                .orElseThrow(() -> new ResourceNotFoundException("No active policy for worker: " + workerId));
    }

    public List<Claim> getWorkerClaims(String workerId) {
        return claimRepository.findByWorker_IdOrderByCreatedAtDesc(workerId);
    }

    public List<WeatherAlert> getActiveAlerts(String zone) {
        return weatherAlertRepository.findByZoneAndIsActiveTrueOrderByCreatedAtDesc(zone);
    }

    public List<WeatherAlert> getAllActiveAlerts() {
        return weatherAlertRepository.findByIsActiveTrueOrderByCreatedAtDesc();
    }

    public List<PremiumPlan> getAllPlans() {
        return premiumPlanRepository.findAll();
    }

    public List<DisruptionTrigger> getActiveTriggers() {
        return triggerRepository.findByIsActiveTrue();
    }

    public Policy updatePolicy(String workerId, String planId) {
        Worker worker = getWorker(workerId);
        PremiumPlan plan = premiumPlanRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("Plan not found: " + planId));

        // Expire existing active policy
        policyRepository.findTopByWorker_IdAndStatusOrderByCreatedAtDesc(workerId, "active")
                .ifPresent(p -> {
                    p.setStatus("cancelled");
                    policyRepository.save(p);
                });

        java.time.LocalDate today = java.time.LocalDate.now();
        Policy newPolicy = Policy.builder()
                .id("POL-" + workerId + "-" + System.currentTimeMillis())
                .worker(worker)
                .plan(plan)
                .weeklyPremium(plan.getWeeklyPremium())
                .coverageCap(plan.getCoverageCap())
                .startDate(today)
                .endDate(today.plusDays(30))
                .status("active")
                .riskTier("medium")
                .build();

        return policyRepository.save(newPolicy);
    }

    public Map<String, Object> getWorkerStats(String workerId) {
        Worker worker = getWorker(workerId);
        List<Claim> allClaims = claimRepository.findByWorker_IdOrderByCreatedAtDesc(workerId);
        List<String> approvedStatuses = List.of("auto_approved", "approved", "paid");

        long totalClaims = allClaims.size();
        long approvedClaimsCount = allClaims.stream()
                .filter(c -> approvedStatuses.contains(c.getStatus()))
                .count();

        java.math.BigDecimal protectedAmount = allClaims.stream()
                .filter(c -> approvedStatuses.contains(c.getStatus()))
                .map(Claim::getPayoutAmount)
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);

        int disruptionHours = allClaims.stream()
                .filter(c -> approvedStatuses.contains(c.getStatus()))
                .mapToInt(c -> c.getDisruptionHours() != null ? c.getDisruptionHours() : 0)
                .sum();

        java.math.BigDecimal totalEarnings = worker.getAvgDailyEarnings() != null
                ? worker.getAvgDailyEarnings().multiply(java.math.BigDecimal.valueOf(30))
                : java.math.BigDecimal.ZERO;

        java.math.BigDecimal premiumsPaid = policyRepository
                .findTopByWorker_IdAndStatusOrderByCreatedAtDesc(workerId, "active")
                .map(p -> p.getWeeklyPremium().multiply(java.math.BigDecimal.valueOf(4)))
                .orElse(java.math.BigDecimal.ZERO);

        java.math.BigDecimal netProtection = protectedAmount.subtract(premiumsPaid);

        Map<String, Object> result = new java.util.HashMap<>();
        result.put("totalClaims", totalClaims);
        result.put("approvedClaims", approvedClaimsCount);
        result.put("totalPayout", protectedAmount);
        result.put("totalEarnings", totalEarnings);
        result.put("protectedAmount", protectedAmount);
        result.put("premiumsPaid", premiumsPaid);
        result.put("netProtection", netProtection);
        result.put("claimsCount", approvedClaimsCount);
        result.put("disruptionHours", disruptionHours);
        return result;
    }
}
