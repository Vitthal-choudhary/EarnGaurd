package com.earnguard.controller;

import com.earnguard.model.dto.ApiResponse;
import com.earnguard.model.entity.DisruptionTrigger;
import com.earnguard.model.entity.WeatherAlert;
import com.earnguard.repository.DisruptionTriggerRepository;
import com.earnguard.repository.WeatherAlertRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/disruptions")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class DisruptionController {

    private final DisruptionTriggerRepository triggerRepository;
    private final WeatherAlertRepository alertRepository;

    @GetMapping("/triggers")
    public ResponseEntity<ApiResponse<List<DisruptionTrigger>>> getTriggers() {
        return ResponseEntity.ok(ApiResponse.ok(triggerRepository.findAll()));
    }

    @GetMapping("/alerts")
    public ResponseEntity<ApiResponse<List<WeatherAlert>>> getAlerts() {
        return ResponseEntity.ok(ApiResponse.ok(alertRepository.findAll()));
    }
}
