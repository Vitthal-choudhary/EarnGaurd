package com.earnguard.config.data;

import com.earnguard.model.entity.*;
import com.earnguard.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final WorkerRepository workerRepository;
    private final AdminUserRepository adminUserRepository;
    private final PremiumPlanRepository premiumPlanRepository;
    private final DisruptionTriggerRepository triggerRepository;
    private final PolicyRepository policyRepository;
    private final ClaimRepository claimRepository;
    private final WeatherAlertRepository alertRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (workerRepository.count() > 0) {
            log.info("Database already seeded, skipping initialization.");
            return;
        }

        log.info("Seeding database with demo data...");
        seedPlans();
        seedTriggers();
        seedWorkers();
        seedAdmins();
        seedWeatherAlerts();
        log.info("Database seeding complete.");
    }

    private void seedPlans() {
        PremiumPlan basic = PremiumPlan.builder()
                .id("plan-basic")
                .name("Basic Shield")
                .weeklyPremium(new BigDecimal("49.00"))
                .coverageCap(new BigDecimal("500.00"))
                .color("blue")
                .isRecommended(false)
                .triggerCoverages(List.of("Heavy Rainfall", "Cyclone Warning"))
                .build();

        PremiumPlan standard = PremiumPlan.builder()
                .id("plan-standard")
                .name("Standard Guard")
                .weeklyPremium(new BigDecimal("89.00"))
                .coverageCap(new BigDecimal("1000.00"))
                .color("green")
                .isRecommended(true)
                .triggerCoverages(List.of("Heavy Rainfall", "Cyclone Warning", "Extreme Heat", "Poor AQI"))
                .build();

        PremiumPlan premium = PremiumPlan.builder()
                .id("plan-premium")
                .name("Premium Protect")
                .weeklyPremium(new BigDecimal("149.00"))
                .coverageCap(new BigDecimal("2000.00"))
                .color("purple")
                .isRecommended(false)
                .triggerCoverages(List.of("Heavy Rainfall", "Cyclone Warning", "Extreme Heat", "Poor AQI", "Flash Floods", "Civil Disruption"))
                .build();

        premiumPlanRepository.saveAll(List.of(basic, standard, premium));
        log.info("Seeded {} premium plans", 3);
    }

    private void seedTriggers() {
        List<DisruptionTrigger> triggers = List.of(
                DisruptionTrigger.builder().id("trig-rain").name("Heavy Rainfall")
                        .description("Rainfall exceeding 65mm/hour causing delivery disruption")
                        .threshold("65mm/hour").icon("cloud-rain").isActive(true).build(),
                DisruptionTrigger.builder().id("trig-cyclone").name("Cyclone Warning")
                        .description("Active cyclone warning issued by meteorological department")
                        .threshold("Category 1+").icon("wind").isActive(true).build(),
                DisruptionTrigger.builder().id("trig-heat").name("Extreme Heat")
                        .description("Temperature exceeding 45°C making outdoor work dangerous")
                        .threshold("45°C").icon("thermometer").isActive(true).build(),
                DisruptionTrigger.builder().id("trig-aqi").name("Poor AQI")
                        .description("Air quality index above 300 (Hazardous category)")
                        .threshold("AQI > 300").icon("wind").isActive(true).build(),
                DisruptionTrigger.builder().id("trig-flood").name("Flash Floods")
                        .description("Flash flood warnings affecting delivery zones")
                        .threshold("Active warning").icon("droplets").isActive(true).build(),
                DisruptionTrigger.builder().id("trig-civil").name("Civil Disruption")
                        .description("Curfew, riots, or civil unrest affecting movement")
                        .threshold("Section 144").icon("alert-triangle").isActive(true).build()
        );
        triggerRepository.saveAll(triggers);
        log.info("Seeded {} disruption triggers", triggers.size());
    }

    private void seedWorkers() {
        String hashedPassword = passwordEncoder.encode("password123");

        Worker demoWorker = Worker.builder()
                .id("WRK-001")
                .name("Arjun Kumar")
                .phone("+91 98765 43210")
                .password(hashedPassword)
                .zone("Mumbai Central")
                .pincode("400008")
                .platform("Swiggy")
                .avgDailyEarnings(new BigDecimal("850.00"))
                .avgHourlyEarnings(new BigDecimal("106.25"))
                .workingHoursStart(9)
                .workingHoursEnd(21)
                .tenureMonths(18)
                .trustScore(92)
                .status("active")
                .build();

        Worker worker2 = Worker.builder()
                .id("WRK-002")
                .name("Priya Sharma")
                .phone("+91 87654 32109")
                .password(hashedPassword)
                .zone("Bengaluru North")
                .pincode("560064")
                .platform("Zomato")
                .avgDailyEarnings(new BigDecimal("780.00"))
                .avgHourlyEarnings(new BigDecimal("97.50"))
                .workingHoursStart(8)
                .workingHoursEnd(20)
                .tenureMonths(12)
                .trustScore(88)
                .status("active")
                .build();

        Worker worker3 = Worker.builder()
                .id("WRK-003")
                .name("Rahul Singh")
                .phone("+91 76543 21098")
                .password(hashedPassword)
                .zone("Delhi NCR")
                .pincode("110001")
                .platform("Blinkit")
                .avgDailyEarnings(new BigDecimal("920.00"))
                .avgHourlyEarnings(new BigDecimal("115.00"))
                .workingHoursStart(10)
                .workingHoursEnd(22)
                .tenureMonths(24)
                .trustScore(95)
                .status("active")
                .build();

        workerRepository.saveAll(List.of(demoWorker, worker2, worker3));
        log.info("Seeded {} workers", 3);

        // Seed active policy for demo worker
        PremiumPlan standardPlan = premiumPlanRepository.findById("plan-standard").orElseThrow();
        LocalDate today = LocalDate.now();
        Policy policy = Policy.builder()
                .id("POL-WRK001-001")
                .worker(demoWorker)
                .plan(standardPlan)
                .weeklyPremium(standardPlan.getWeeklyPremium())
                .coverageCap(standardPlan.getCoverageCap())
                .startDate(today.minusDays(7))
                .endDate(today.plusDays(23))
                .status("active")
                .riskTier("low")
                .build();
        policyRepository.save(policy);

        // Seed a few sample claims
        DisruptionTrigger rainTrigger = triggerRepository.findById("trig-rain").orElseThrow();
        DisruptionTrigger heatTrigger = triggerRepository.findById("trig-heat").orElseThrow();

        List<Claim> sampleClaims = List.of(
                Claim.builder().id("CLM-001-11111").worker(demoWorker).trigger(rainTrigger)
                        .triggerName(rainTrigger.getName()).zoneAffected("Mumbai Central")
                        .disruptionHours(3).payoutAmount(new BigDecimal("318.75"))
                        .status("auto_approved").fraudScore(new BigDecimal("0.0200"))
                        .flagged(false).createdAt(Instant.now().minusSeconds(86400)).build(),
                Claim.builder().id("CLM-001-22222").worker(demoWorker).trigger(heatTrigger)
                        .triggerName(heatTrigger.getName()).zoneAffected("Mumbai Central")
                        .disruptionHours(5).payoutAmount(new BigDecimal("531.25"))
                        .status("under_review").fraudScore(new BigDecimal("0.0500"))
                        .flagged(false).createdAt(Instant.now().minusSeconds(3600)).build(),
                Claim.builder().id("CLM-001-33333").worker(worker2).trigger(rainTrigger)
                        .triggerName(rainTrigger.getName()).zoneAffected("Bengaluru North")
                        .disruptionHours(2).payoutAmount(new BigDecimal("195.00"))
                        .status("paid").fraudScore(new BigDecimal("0.0100"))
                        .flagged(false).createdAt(Instant.now().minusSeconds(172800))
                        .resolvedAt(Instant.now().minusSeconds(86400)).build(),
                Claim.builder().id("CLM-001-44444").worker(worker3).trigger(heatTrigger)
                        .triggerName(heatTrigger.getName()).zoneAffected("Delhi NCR")
                        .disruptionHours(6).payoutAmount(new BigDecimal("690.00"))
                        .status("under_review").fraudScore(new BigDecimal("0.8500"))
                        .flagged(true).createdAt(Instant.now().minusSeconds(43200)).build()
        );
        claimRepository.saveAll(sampleClaims);
        log.info("Seeded {} sample claims", sampleClaims.size());
    }

    private void seedAdmins() {
        AdminUser admin = AdminUser.builder()
                .username("admin")
                .password(passwordEncoder.encode("admin123"))
                .email("admin@earnguard.in")
                .fullName("Admin User")
                .role("ADMIN")
                .build();
        adminUserRepository.save(admin);
        log.info("Seeded admin user (username: admin)");
    }

    private void seedWeatherAlerts() {
        List<WeatherAlert> alerts = List.of(
                WeatherAlert.builder().id("ALT-001").type("rainfall").severity("orange")
                        .zone("Mumbai Central").pincode("400008")
                        .message("Heavy rainfall expected. Average 72mm/hour. High disruption risk.")
                        .startTime(Instant.now()).endTime(Instant.now().plusSeconds(21600))
                        .isActive(true).build(),
                WeatherAlert.builder().id("ALT-002").type("heat").severity("yellow")
                        .zone("Delhi NCR").pincode("110001")
                        .message("Heat wave warning. Temperature expected to reach 44°C.")
                        .startTime(Instant.now()).endTime(Instant.now().plusSeconds(43200))
                        .isActive(true).build()
        );
        alertRepository.saveAll(alerts);
        log.info("Seeded {} weather alerts", alerts.size());
    }
}
