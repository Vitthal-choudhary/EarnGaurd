package com.earnguard.controller;

import com.earnguard.model.dto.ApiResponse;
import com.earnguard.model.entity.*;
import com.earnguard.service.WorkerService;

import java.util.HashMap;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/worker")
@RequiredArgsConstructor
public class WorkerController {

    private final WorkerService workerService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<Worker>> getProfile(Authentication auth) {
        Worker worker = workerService.getWorker(auth.getName());
        return ResponseEntity.ok(ApiResponse.ok(worker));
    }

    @GetMapping("/policy")
    public ResponseEntity<ApiResponse<Policy>> getPolicy(Authentication auth) {
        Policy policy = workerService.getActivePolicy(auth.getName());
        return ResponseEntity.ok(ApiResponse.ok(policy));
    }

    @PostMapping("/policy")
    public ResponseEntity<ApiResponse<Policy>> updatePolicy(
            Authentication auth,
            @RequestBody Map<String, String> body) {
        String planId = body.get("planId");
        Policy policy = workerService.updatePolicy(auth.getName(), planId);
        return ResponseEntity.ok(ApiResponse.ok("Policy updated", policy));
    }

    @GetMapping("/claims")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getClaims(Authentication auth) {
        List<Claim> claims = workerService.getWorkerClaims(auth.getName());
        Map<String, Object> stats = workerService.getWorkerStats(auth.getName());
        Map<String, Object> result = new HashMap<>();
        result.put("claims", claims);
        result.put("stats", stats);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/alerts")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAlerts(Authentication auth) {
        Worker worker = workerService.getWorker(auth.getName());
        List<WeatherAlert> alerts = workerService.getActiveAlerts(worker.getZone());
        Map<String, Object> weather = Map.of(
                "temperature", 32,
                "condition", "Partly Cloudy",
                "humidity", 68,
                "rainfall", 5.2,
                "windSpeed", 18,
                "aqi", 145
        );
        Map<String, Object> result = new HashMap<>();
        result.put("alerts", alerts);
        result.put("weather", weather);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/triggers")
    public ResponseEntity<ApiResponse<List<DisruptionTrigger>>> getTriggers() {
        return ResponseEntity.ok(ApiResponse.ok(workerService.getActiveTriggers()));
    }

    @GetMapping("/plans")
    public ResponseEntity<ApiResponse<List<PremiumPlan>>> getPlans() {
        return ResponseEntity.ok(ApiResponse.ok(workerService.getAllPlans()));
    }
}
