package com.earnguard.repository;

import com.earnguard.model.entity.Policy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PolicyRepository extends JpaRepository<Policy, String> {
    Optional<Policy> findTopByWorker_IdAndStatusOrderByCreatedAtDesc(String workerId, String status);
    long countByStatus(String status);
}
