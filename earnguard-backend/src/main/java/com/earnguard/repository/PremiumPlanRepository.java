package com.earnguard.repository;

import com.earnguard.model.entity.PremiumPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PremiumPlanRepository extends JpaRepository<PremiumPlan, String> {
}
