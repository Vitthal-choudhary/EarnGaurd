package com.earnguard.repository;

import com.earnguard.model.entity.Worker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WorkerRepository extends JpaRepository<Worker, String> {
    Optional<Worker> findByPhone(String phone);
    boolean existsByPhone(String phone);
}
