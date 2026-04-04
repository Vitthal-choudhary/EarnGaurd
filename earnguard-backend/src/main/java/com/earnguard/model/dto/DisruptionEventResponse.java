package com.earnguard.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DisruptionEventResponse {
    private String id;
    private String name;
    private String description;
    private String severity;
    private String zone;
    private Instant startTime;
    private Instant endTime;
    private Boolean isActive;
}
