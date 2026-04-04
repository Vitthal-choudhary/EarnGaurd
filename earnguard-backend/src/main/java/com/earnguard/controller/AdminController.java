package com.earnguard.controller;

import com.earnguard.model.dto.AdminDashboardResponse;
import com.earnguard.model.dto.ApiResponse;
import com.earnguard.model.dto.ClaimResolveRequest;
import com.earnguard.model.dto.ClaimResponse;
import com.earnguard.model.entity.Claim;
import com.earnguard.model.entity.WeatherAlert;
import com.earnguard.model.entity.Worker;
import com.earnguard.repository.WeatherAlertRepository;
import com.earnguard.service.AdminService;
import com.earnguard.service.ClaimService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final ClaimService claimService;
    private final WeatherAlertRepository alertRepository;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminDashboardResponse>> getStats() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getDashboardStats()));
    }

    @GetMapping("/workers")
    public ResponseEntity<ApiResponse<List<Worker>>> getWorkers() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getAllWorkers()));
    }

    @GetMapping("/claims")
    public ResponseEntity<ApiResponse<List<ClaimResponse>>> getClaims() {
        List<ClaimResponse> claims = adminService.getAllClaims()
                .stream().map(claimService::toResponse).toList();
        return ResponseEntity.ok(ApiResponse.ok(claims));
    }

    @PatchMapping("/claims/{id}")
    public ResponseEntity<ApiResponse<ClaimResponse>> resolveClaim(
            @PathVariable String id,
            @Valid @RequestBody ClaimResolveRequest request) {
        Claim claim = claimService.resolveClaim(id, request.getStatus(), request.getAdminNotes());
        return ResponseEntity.ok(ApiResponse.ok("Claim updated", claimService.toResponse(claim)));
    }

    @GetMapping("/zones")
    public ResponseEntity<ApiResponse<List<WeatherAlert>>> getZones() {
        return ResponseEntity.ok(ApiResponse.ok(alertRepository.findAll()));
    }

    @GetMapping("/payouts")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPayouts() {
        AdminDashboardResponse stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.ok(Map.of("stats", stats, "weekly", List.of())));
    }

    @GetMapping("/fraud")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getFraudData() {
        List<ClaimResponse> flagged = adminService.getFlaggedClaims()
                .stream().map(claimService::toResponse).toList();
        Map<String, Object> stats = adminService.getFraudStats();
        return ResponseEntity.ok(ApiResponse.ok(Map.of("flaggedClaims", flagged, "stats", stats)));
    }
}
