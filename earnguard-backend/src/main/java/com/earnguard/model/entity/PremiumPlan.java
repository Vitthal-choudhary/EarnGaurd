package com.earnguard.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "premium_plans")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PremiumPlan {

    @Id
    @Column(length = 20)
    private String id;

    @Column(length = 100, nullable = false)
    private String name;

    @Column(name = "weekly_premium", nullable = false, precision = 10, scale = 2)
    private BigDecimal weeklyPremium;

    @Column(name = "coverage_cap", nullable = false, precision = 10, scale = 2)
    private BigDecimal coverageCap;

    @Column(length = 30)
    private String color;

    @Column(name = "is_recommended")
    @Builder.Default
    private Boolean isRecommended = false;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "plan_trigger_coverage",
            joinColumns = @JoinColumn(name = "plan_id"))
    @Column(name = "trigger_description")
    @Builder.Default
    private List<String> triggerCoverages = new ArrayList<>();
}
