package com.earnguard.controller;

import com.earnguard.model.dto.ApiResponse;
import com.earnguard.model.dto.ClaimResponse;
import com.earnguard.model.dto.DisruptionCreateRequest;
import com.earnguard.model.entity.Claim;
import com.earnguard.service.ClaimService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/worker/disruptions")
@RequiredArgsConstructor
public class ClaimController {

    private final ClaimService claimService;

    @PostMapping
    public ResponseEntity<ApiResponse<ClaimResponse>> submitClaim(
            Authentication auth,
            @Valid @RequestBody DisruptionCreateRequest request) {
        Claim claim = claimService.submitClaim(auth.getName(), request);
        return ResponseEntity.ok(ApiResponse.ok("Claim submitted successfully", claimService.toResponse(claim)));
    }
}
