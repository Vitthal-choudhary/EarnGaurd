package com.earnguard.controller;

import com.earnguard.model.dto.ApiResponse;
import com.earnguard.model.entity.PremiumPlan;
import com.earnguard.repository.PremiumPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plans")
@RequiredArgsConstructor
public class PolicyController {

    private final PremiumPlanRepository premiumPlanRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PremiumPlan>>> getPlans() {
        return ResponseEntity.ok(ApiResponse.ok(premiumPlanRepository.findAll()));
    }
}
