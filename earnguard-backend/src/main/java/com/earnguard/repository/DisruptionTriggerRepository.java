package com.earnguard.repository;

import com.earnguard.model.entity.DisruptionTrigger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DisruptionTriggerRepository extends JpaRepository<DisruptionTrigger, String> {
    List<DisruptionTrigger> findByIsActiveTrue();
}
