package com.earnguard.repository;

import com.earnguard.model.entity.WeatherAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WeatherAlertRepository extends JpaRepository<WeatherAlert, String> {
    List<WeatherAlert> findByIsActiveTrueOrderByCreatedAtDesc();
    List<WeatherAlert> findByZoneAndIsActiveTrueOrderByCreatedAtDesc(String zone);
}
