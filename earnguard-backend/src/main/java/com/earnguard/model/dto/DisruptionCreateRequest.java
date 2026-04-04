package com.earnguard.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DisruptionCreateRequest {
    @NotBlank
    private String triggerId;

    @NotNull
    private Integer disruptionHours;

    private String zoneAffected;
}
