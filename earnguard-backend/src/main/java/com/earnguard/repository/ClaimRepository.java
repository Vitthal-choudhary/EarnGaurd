package com.earnguard.repository;

import com.earnguard.model.entity.Claim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, String> {

    List<Claim> findByWorker_IdOrderByCreatedAtDesc(String workerId);

    List<Claim> findAllByOrderByCreatedAtDesc();

    List<Claim> findByFlaggedTrueOrderByCreatedAtDesc();

    long countByStatus(String status);

    long countByFlaggedTrue();

    @Query("SELECT COALESCE(SUM(c.payoutAmount), 0) FROM Claim c WHERE c.status IN ('paid', 'approved', 'auto_approved')")
    BigDecimal sumPaidPayouts();

    @Query("SELECT COALESCE(SUM(c.payoutAmount), 0) FROM Claim c WHERE c.worker.id = :workerId AND c.status IN ('paid', 'approved', 'auto_approved')")
    BigDecimal sumPaidPayoutsByWorkerId(@Param("workerId") String workerId);
}
