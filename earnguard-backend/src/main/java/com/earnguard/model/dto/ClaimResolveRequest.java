package com.earnguard.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ClaimResolveRequest {
    @NotBlank(message = "Status is required")
    private String status; // approved, rejected, paid

    private String adminNotes;
}
