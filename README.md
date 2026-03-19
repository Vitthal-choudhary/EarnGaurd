# GigShield — AI-Powered Parametric Income Protection for India's Gig Delivery Workers

> **Hackathon**: Guidewire DEVTrails 2026 — "Unicorn Chase"
> **Phase 1 Submission**: Ideation & Foundation (Deadline: March 20, 2026)
> **Theme**: AI-Enabled Insurance for India's Gig Economy

---

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Chosen Persona: Q-Commerce Delivery Partner](#2-chosen-persona-q-commerce-delivery-partner)
3. [Solution Overview](#3-solution-overview)
4. [Weekly Premium Model](#4-weekly-premium-model)
5. [Parametric Trigger Definitions](#5-parametric-trigger-definitions)
6. [AI/ML Integration Plan](#6-aiml-integration-plan)
7. [Platform Justification: Mobile-First PWA](#7-platform-justification-mobile-first-pwa)
8. [Architecture Overview](#8-architecture-overview)
9. [Tech Stack](#9-tech-stack)
10. [Adversarial Defense & Anti-Spoofing Strategy](#10-adversarial-defense--anti-spoofing-strategy)
11. [Development Roadmap](#11-development-roadmap)

---

## 1. Problem Statement

India's gig delivery ecosystem employs over **11 million platform workers** on apps like Zepto, Blinkit, Swiggy Instamart, Zomato, Amazon, and Dunzo. These workers operate on a **zero-safety-net model** — earning only when they deliver.

When external disruptions occur — heavy rainfall, cyclones, AQI-based shutdowns, civil curfews, floods, app platform outages, or extreme heat advisories — delivery workers lose **20–30% of their monthly income** in a matter of hours. They have no collective bargaining power, no employer-backed insurance, and no recourse.

**Existing gaps:**
- Health/accident insurance products exist but don't cover *lost wages*
- Vehicle insurance covers the bike, not the rider's earnings
- No product in the market addresses **parametric income protection** tuned to gig workers
- Manual claims processes are too slow and inaccessible for daily-wage earners

**GigShield's answer:** An AI-powered, parametric insurance platform that *automatically* detects disruptions, verifies eligibility, and initiates payouts — without the worker filing a single form.

---

## 2. Chosen Persona: Q-Commerce Delivery Partner

**Persona**: A Zepto/Blinkit/Swiggy Instamart delivery partner in a Tier-1 Indian city (Mumbai, Delhi, Bengaluru, Hyderabad, Pune).

### Why Q-Commerce?

| Factor | Q-Commerce (Zepto/Blinkit) | Food (Zomato/Swiggy) | E-Commerce (Amazon/Flipkart) |
|--------|---------------------------|----------------------|------------------------------|
| Delivery frequency | 15–25 orders/day | 8–15 orders/day | 3–8 orders/day |
| Hyperlocal sensitivity | Extreme (dark store zones) | High | Moderate |
| Weather vulnerability | Critical (monsoon paralysis) | High | Low-Medium |
| Worker density per zone | Very high (cluster-based) | Medium | Spread out |
| Fraud surface area | High (zone-based clustering) | Medium | Low |

Q-commerce workers operate within **tight geographic zones** anchored to dark stores, making:
- Parametric triggers more precise (zone-level, not city-level)
- Fraud detection more nuanced (cluster behavior becomes a signal)
- Income modeling more predictable (orders/hour baselines are tight)

### Persona Profile: "Ravi, 28, Zepto Partner, Andheri East"

- Works 10 AM – 10 PM, ~20 deliveries/day
- Earns ₹600–₹900/day, ~₹4,500–₹6,000/week
- Rides a scooter, operates within a 4 km dark store radius
- Pays rent weekly, sends remittances monthly
- Has no savings buffer beyond 2–3 days
- Owns a smartphone (Android), uses UPI for all payments

**Key Disruptions Ravi faces:**
1. Mumbai monsoon — zone completely unserviceable for 4–6 hours
2. AQI shutdown advisory — city-wide app slowdown
3. Cyclone/storm warning — platform voluntarily suspends operations
4. Local political bandh — roads blocked, platform auto-pauses
5. Platform outage (Zepto app down) — zero orders possible regardless of effort

---

## 3. Solution Overview

GigShield is a **parametric income insurance platform** built for Q-commerce delivery partners. It requires no claims filing — the system monitors external signals, detects covered disruptions, verifies worker eligibility, and triggers a payout automatically.

### How It Works — End-to-End Flow

```
Worker Onboards → Selects Weekly Plan → Premium Auto-Deducted
        ↓
Real-Time Monitoring: Weather + Platform + Traffic APIs
        ↓
Disruption Detected in Worker's Zone
        ↓
AI Eligibility Check: Was worker active? Was zone affected?
        ↓
Anti-Spoofing Verification (Multi-signal)
        ↓
Claim Auto-Approved OR Flagged for Human+AI Review
        ↓
Payout to UPI within 60 seconds
```

### What GigShield Covers (and doesn't)

| Covered | Not Covered |
|---------|-------------|
| Lost income during weather shutdowns (rain, cyclone, AQI) | Vehicle repairs or damage |
| Lost income during platform-declared outages | Medical/accident expenses |
| Lost income during civil disruptions (curfew, bandh) | Personal illness or fatigue |
| Lost income during natural disasters (flood, earthquake alerts) | Low-order days due to competition |

---

## 4. Weekly Premium Model

### Why Weekly?

Q-commerce workers are paid **weekly or bi-weekly** by platforms. Daily income is variable; monthly commitments are too abstract. Weekly premiums align with:
- Worker cash flow cycles
- Platform payout schedules
- Mental models around "this week's earnings"

A ₹150–₹200/week premium is equivalent to ~2.5–3% of weekly earnings — a meaningful but affordable risk transfer.

### Premium Tiers

| Plan | Weekly Premium | Coverage Cap | Disruption Types Covered |
|------|---------------|--------------|--------------------------|
| Basic Shield | ₹99/week | ₹500/disruption event | Weather only |
| Standard Shield | ₹149/week | ₹800/disruption event | Weather + Platform Outage |
| Pro Shield | ₹199/week | ₹1,200/disruption event | All covered triggers |

### Dynamic Premium Calculation (AI-Driven)

The base premium is adjusted weekly using a **Risk Score** computed from:

```
Risk Score = f(
  historical_disruption_frequency(worker_zone, last_12_weeks),
  season_factor(current_month),           // Monsoon = high risk
  AQI_trend(city, rolling_7d),
  platform_stability_index(last_30d),
  worker_tenure_factor(months_active),    // Longer tenure = lower risk
  claim_history_factor(last_6_months)     // Clean history = discount
)
```

**Examples:**
- Worker in Andheri East, Mumbai, activating in July (peak monsoon): +22% above base premium
- Worker with 8 months clean history: −10% loyalty discount
- Worker in Bengaluru in January (dry season): −15% seasonal discount

Premiums are capped: never more than 2x or less than 0.7x the base tier rate, regardless of risk score.

### Activation & Deduction

- Premium deducted from linked UPI wallet at policy activation (Sunday midnight)
- Worker receives WhatsApp/SMS confirmation
- Coverage window: Monday 00:00 — Sunday 23:59
- Policy auto-renews unless worker opts out 12 hours before cycle end

---

## 5. Parametric Trigger Definitions

A **parametric trigger** is an objectively measurable external event that activates a claim — no proof of loss required from the worker, no adjuster involved.

### Trigger Matrix

| Trigger ID | Trigger Name | Data Source | Threshold | Coverage Duration |
|------------|-------------|-------------|-----------|-------------------|
| T-01 | Heavy Rainfall | OpenWeather API + IMD | Rainfall > 40mm/3hr in worker's pin-code | Per hour of documented disruption |
| T-02 | Cyclone/Severe Storm Alert | IMD Official API | Orange/Red Alert issued for city | Full alert duration |
| T-03 | Air Quality Shutdown | CPCB AQI API + Government advisory | AQI > 400 + Government advisory issued | Advisory duration |
| T-04 | Platform Outage | Platform status API + Crowdsourced signal | >60% order drop in zone + API status page down | Outage window |
| T-05 | Civil Disruption/Bandh | News API + Traffic API + Government feed | Road blockage detected in >3 major arteries in zone | Duration of disruption |
| T-06 | Natural Disaster Alert | NDMA/IMD API | Official disaster advisory issued | Advisory duration |

### Payout Formula Per Trigger

```
Payout = min(
  (avg_hourly_earnings × disruption_hours × coverage_factor),
  plan_event_cap
)

Where:
  avg_hourly_earnings = worker's 30-day rolling average ÷ 30-day active hours
  disruption_hours = verified hours of disruption in worker's zone
  coverage_factor = 0.75 (75% income replacement — retains worker skin in game)
```

**Example:**
Ravi earns ₹750/day avg, works 10 hrs → ₹75/hr.
Monsoon shuts his zone for 3 hours on Wednesday.
Payout = ₹75 × 3 × 0.75 = **₹168.75**, auto-disbursed to UPI.

---

## 6. AI/ML Integration Plan

### 6.1 Dynamic Premium Pricing Engine

- **Model Type**: Gradient Boosted Regression (XGBoost/LightGBM)
- **Input Features**: Zone-level disruption history, seasonal indices, worker tenure, claim frequency, AQI rolling averages, platform stability scores
- **Output**: Weekly risk multiplier (0.7x–2.0x)
- **Retraining**: Weekly, on ingested disruption + claim data

### 6.2 Fraud Detection Engine

- **Model Type**: Ensemble (Isolation Forest + LSTM anomaly detection)
- **Signals used**:
  - Claim rate deviation from zone baseline
  - GPS trajectory vs expected zone behavior
  - Behavioral fingerprint (app usage patterns)
  - Social graph of claim clusters (are all claimants in a Telegram group?)
- **Output**: Fraud probability score (0–1), auto-approve below 0.3, flag above 0.7, human+AI review between 0.3–0.7

### 6.3 Zone-Level Disruption Classifier

- **Model Type**: Multi-source signal aggregation + threshold classifier
- **Inputs**: Weather API, traffic API, platform order volume drop, news sentiment
- **Output**: Binary disruption flag per zone per 15-minute window
- **Latency target**: < 90 seconds from event to flag

### 6.4 Worker Income Baseline Model

- **Purpose**: Estimate expected earnings for a disruption window (what the worker *would have* earned)
- **Approach**: Time-series forecasting (Prophet/SARIMA) per worker, accounting for day-of-week, time-of-day, and seasonal effects
- **Cold start**: New workers use zone-level averages until 4 weeks of personal data accumulates

---

## 7. Platform Justification: Mobile-First PWA

### Decision: Progressive Web App (PWA) + WhatsApp-based nudges

**Why not a native app?**
- Q-commerce workers already have Zepto/Blinkit apps eating storage
- Play Store install friction is a real barrier for gig workers
- PWAs install to home screen in one tap, work offline, and are update-free for the user

**Why not purely web?**
- Workers need push notifications for payout confirmations and policy reminders
- PWAs support push notifications on Android (dominant OS in target demographic)

**Communication Layer**: WhatsApp Business API
- Policy activation confirmations
- Disruption alerts ("Your zone is under heavy rain — coverage active")
- Payout notifications
- Workers are already on WhatsApp; zero onboarding friction

**Admin/Insurer Dashboard**: React web app (desktop)
- Loss ratio monitoring
- Zone-level risk heat maps
- Claim queue and fraud flag management
- Predictive analytics

---

## 8. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                               │
│  ┌──────────────┐    ┌─────────────────┐                           │
│  │  Mobile PWA  │    │  Admin Dashboard │                           │
│  │  (Worker UI) │    │  (Insurer View)  │                           │
│  └──────┬───────┘    └────────┬─────────┘                           │
│         └──────────┬──────────┘                                     │
└────────────────────┼────────────────────────────────────────────────┘
                     ▼
         ┌───────────────────────┐
         │     API Gateway       │
         │  (Auth + Rate Limit)  │
         └─────────┬─────────────┘
                   ▼
┌──────────────────────────────────────────────────────────────────────┐
│                        CORE MICROSERVICES                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐   │
│  │ User Service │  │Policy Service│  │     Claim Service        │   │
│  │              │  │              │  │ (auto-trigger + manual)  │   │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
                   │                        │
         ┌─────────▼───────────┐   ┌───────▼────────────────────────┐
         │    ML LAYER         │   │     ANTI-SPOOFING ENGINE        │
         │                     │   │                                 │
         │  ┌───────────────┐  │   │  ┌───────────────────────────┐ │
         │  │  Risk Engine  │  │   │  │   Rider Zone Profiler     │ │
         │  │ (Pricing)     │  │   │  │   Zone Integrity Check    │ │
         │  ├───────────────┤  │   │  │   Strava API Verifier     │ │
         │  │ Fraud Detect  │  │   │  │   Claim Decision Engine   │ │
         │  └───────────────┘  │   │  └───────────────────────────┘ │
         └─────────────────────┘   │        ↕ Human+AI Review       │
                                   └────────────────────────────────┘
                   │
┌──────────────────▼───────────────────────────────────────────────────┐
│                     EXTERNAL DATA SOURCES                            │
│  OpenWeatherMap │ IMD API │ CPCB AQI │ Cell Tower API              │
│  IP Geolocation │ Maps API │ Brave Search │ Platform Status APIs    │
└──────────────────────────────────────────────────────────────────────┘
                   │
         ┌─────────▼─────────────────────┐
         │     EVENT STREAMING (Kafka)    │
         │  Trigger Engine (zone events)  │
         └─────────┬─────────────────────┘
                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         OUTPUT / PAYOUT                             │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────────────┐   │
│  │   Razorpay   │  │    Stripe    │  │   Firebase (Notifs)     │   │
│  │  (UPI/IMPS)  │  │  (Fallback)  │  │   WhatsApp Business API │   │
│  └──────────────┘  └──────────────┘  └─────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘

DATA LAYER:
  ├── MongoDB (worker profiles, claims, events — document model)
  └── PostgreSQL (policies, premiums, payouts — transactional integrity)
```

---

## 9. Tech Stack

### Backend
| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Core Services | Node.js (Express) | Fast I/O, large ecosystem, team familiarity |
| ML Services | Python (FastAPI) | Native ML library support (scikit-learn, XGBoost, Prophet) |
| Event Streaming | Apache Kafka | Real-time disruption event pipeline, decoupled trigger processing |
| Primary Database | MongoDB | Flexible schema for worker profiles, claims, zone events |
| Transactional DB | PostgreSQL | ACID compliance for policy and payout records |
| Cache | Redis | Session management, zone disruption state, rate limiting |

### Frontend
| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Worker App | React PWA | One codebase, installable, offline-capable |
| Admin Dashboard | React + Recharts | Rich data visualization for insurer view |
| Notifications | Firebase Cloud Messaging | Push to Android without native app |
| Communication | WhatsApp Business API | Zero-friction for target demographic |

### ML/AI
| Model | Framework | Purpose |
|-------|-----------|---------|
| Premium Pricing | XGBoost (Python) | Weekly risk multiplier per worker |
| Fraud Detection | Isolation Forest + LSTM | Anomaly scoring on claims |
| Disruption Classifier | Multi-signal threshold + rule engine | Zone-level event detection |
| Income Forecasting | Facebook Prophet | Counterfactual earnings baseline |

### Infrastructure
| Service | Provider | Notes |
|---------|----------|-------|
| Cloud | AWS (or GCP) | EC2/Cloud Run for services |
| Container Orchestration | Docker Compose (Phase 1–2), K8s (Phase 3) | Progressive scaling |
| API Gateway | Kong / AWS API Gateway | Auth, rate limiting, routing |
| Monitoring | Grafana + Prometheus | System health + claim flow metrics |

### External APIs
| API | Purpose | Tier |
|-----|---------|------|
| OpenWeatherMap | Real-time + forecast weather per zone | Free tier / mock |
| IMD (India Met) | Official alerts, cyclone/flood advisories | Public feed |
| CPCB AQI | Air quality index per city | Public API |
| Cell Tower (OpenCelliD) | Cross-verify device location with tower | Free tier |
| IP Geolocation | Detect VPN/proxy usage | Free tier |
| Strava API | Cross-verify claimed physical location via activity data | OAuth / mock |
| Razorpay (Sandbox) | UPI payouts simulation | Sandbox |
| Brave Search API | News signals for civil disruptions | Free tier |

---

## 10. Adversarial Defense & Anti-Spoofing Strategy

> **Context**: A coordinated fraud syndicate of 500 workers in a Tier-1 city is using GPS-spoofing applications to fake locations, claiming to be stranded in weather zones while resting at home, triggering mass false payouts and draining the liquidity pool.
>
> **Ruling**: Simple GPS verification is officially obsolete. This section defines GigShield's multi-layered defense.

---

### 10.1 The Threat Model

GPS spoofing via apps like Fake GPS, iToolab AnyGo, or rooted-device mock providers is trivially accessible. A coordinated syndicate doesn't need technical sophistication — they need a Telegram channel and a free APK.

The key insight is that **a spoofed GPS signal is a single data point**. The attacker cannot simultaneously spoof:
- Cell tower triangulation data
- IP geolocation
- Device motion sensor readings
- Historical behavioral patterns
- Platform-side order activity data
- Network signal characteristics during the claimed "disruption zone"

Our defense exploits this asymmetry.

---

### 10.2 The Multi-Signal Verification Stack

GigShield collects and cross-correlates the following signals for every claim event. No single signal determines outcome — the system builds a **confidence composite**:

#### Signal Layer 1: Location Authenticity (Beyond GPS)

| Signal | What It Detects | How |
|--------|----------------|-----|
| Cell Tower Triangulation | Physical device location independent of GPS | OpenCelliD API — towers worker's device is pinging |
| IP Geolocation | VPN/proxy usage, rough location match | Device IP vs claimed GPS zone |
| Wi-Fi SSID fingerprint | Is device connected to home Wi-Fi during "field" claim? | Passive detection in app (only metadata, no SSID value stored) |
| GPS Jitter Analysis | Spoofed GPS has unnaturally stable coordinates; real GPS has micro-drift | Statistical variance on GPS readings over 5-min window |

A worker genuinely stranded in a flooded zone will show:
- Cell towers in that geographic cluster
- IP consistent with mobile data (not home broadband)
- GPS variance consistent with a stationary-but-real location
- No home Wi-Fi SSID detected

A spoofing actor will show discrepancies across 2–3 of these signals.

#### Signal Layer 2: Behavioral Fingerprinting

| Signal | What It Detects | How |
|--------|----------------|-----|
| Pre-disruption activity | Was worker actually on shift when disruption hit? | Platform API order history + app last-active timestamp |
| Motion sensor data | Accelerometer patterns: is device on a stationary person vs a moving scooter? | On-device motion API (no raw data stored, only pattern flag) |
| App interaction patterns | Worker opened GigShield app suspiciously close to the trigger window | Timestamp delta between app open and claim initiation |
| Strava / fitness app activity | Did worker log a run during their "trapped" window? | Strava API OAuth cross-check (opt-in, incentivized with premium discount) |

#### Signal Layer 3: Zone-Level Claim Density Analysis

This is the most powerful signal against **coordinated rings**.

```
Fraud Ring Signature:
  - Sudden spike in claims from one zone within a short window
  - Claims initiated within seconds of each other (bot-like timing)
  - Claimant network graph: multiple workers onboarded from same device or referral chain
  - Claim pattern mirrors disruption window exactly — no variance in claim timing
    (genuine workers file at different times as they realize the disruption)

Genuine Disruption Signature:
  - Claims spread across the disruption window (not clustered at start)
  - Claimant count matches expected active-worker count for that zone/time
  - Claims come from workers with varied tenure, not mass-onboarded recently
```

The ML fraud model assigns a **Zone Anomaly Score** when:
- Claims from a zone exceed 2 standard deviations above the historical average for that zone/trigger combination
- Claim timing shows abnormal clustering (Poisson distribution test)
- Network graph analysis reveals clique structure (workers with same referral source, device fingerprint)

When Zone Anomaly Score is elevated, the entire zone's claims enter **enhanced review** — not just flagged individuals.

#### Signal Layer 4: Temporal and Historical Consistency

| Check | Logic |
|-------|-------|
| Claim frequency per worker | Worker filing claims in consecutive weeks without historical pattern is a soft flag |
| Disruption-claim latency | Claims filed immediately when trigger fires (< 30 sec) are flagged — genuine workers don't have push-to-claim reflexes |
| Cross-platform order data | If worker received orders during the "disrupted" window (via platform API), the claim is auto-rejected |
| Onboarding recency | Workers who onboarded < 2 weeks ago and file a max-value claim in Week 1 face elevated scrutiny |

---

### 10.3 The Decision Engine

Claims are scored across all four signal layers and assigned a **Fraud Probability Score (FPS)** from 0.0 to 1.0:

```
FPS = weighted_ensemble(
  location_authenticity_score × 0.30,
  behavioral_fingerprint_score × 0.25,
  zone_anomaly_score × 0.30,
  temporal_consistency_score × 0.15
)
```

| FPS Range | Action | Worker Experience |
|-----------|--------|-------------------|
| 0.0 – 0.30 | Auto-approve | Payout within 60 seconds |
| 0.31 – 0.60 | Soft hold | "We're confirming your coverage — payout within 2 hours" |
| 0.61 – 0.80 | Human + AI Review | Worker receives WhatsApp: "We need a quick check — reply CONFIRM to verify" |
| 0.81 – 1.00 | Flagged / Rejected | Worker notified; appeal process available |

---

### 10.4 The UX Balance Problem: Protecting Honest Workers

The hardest problem is not detecting fraudsters — it's **not punishing genuine workers** who happen to:
- Have weak cell signal in a flooded area (making cell tower data unreliable)
- Be using a VPN (common among privacy-conscious users)
- Have just onboarded (no behavioral history)
- Be in a zone with unusual claim density (legitimate disaster)

GigShield handles this through:

**Principle 1: Soft holds, not hard rejections**
A flagged claim is never immediately rejected. Workers in the 0.31–0.80 FPS range receive a "processing" message, not a denial. Most genuine workers clear enhanced checks within 2 hours.

**Principle 2: Zone context override**
If IMD, NDMA, or government sources confirm a genuine disaster in the zone, the zone-level fraud threshold is automatically elevated. The system assumes good faith during officially declared disasters and shifts burden of proof.

**Principle 3: Worker reputation credit**
Workers with 8+ weeks of claim-free history receive a **Trust Score** that lowers effective FPS by up to 0.15 points. Long-tenure honest workers are protected from false positives.

**Principle 4: Transparent appeals**
Every rejected claim generates an auto-explanation (which signals triggered the flag) and a one-tap appeal pathway. Appeals resolved within 4 hours by human reviewer backed by AI summary. This builds trust and catches genuine edge cases.

**Principle 5: No permanent blacklisting without review**
First-time fraud flags result in enhanced monitoring, not bans. Confirmed fraud (pattern + admission + multiple signals) results in suspension with a defined dispute process.

---

### 10.5 What the Syndicate Cannot Fake

Even a sophisticated 500-member syndicate using coordinated GPS spoofing cannot simultaneously fake:
1. Cell tower pings consistent with the claimed physical zone
2. Natural GPS micro-drift (spoofed coordinates are too perfect)
3. Platform order activity data showing worker was offline before and during disruption
4. Strava activity showing movement incompatible with being stranded
5. Claim timing variance — coordinated rings fire claims too uniformly
6. The network graph: 500 members don't have 500 independent onboarding paths

The attack surface narrows to a very expensive, high-effort attack that is economically irrational compared to the claim value (₹168–₹900 per event).

---

## 11. Development Roadmap

### Phase 1 (Current — March 20): Foundation & Ideation
- [x] Problem research and persona definition
- [x] Solution architecture design
- [x] Weekly premium model design
- [x] Parametric trigger definitions
- [x] Anti-spoofing strategy documentation
- [ ] GitHub repository scaffolding
- [ ] 2-minute pitch video

### Phase 2 (Weeks 3–4): Build & Protect
- [ ] Worker registration and onboarding flow
- [ ] Policy management (create, activate, renew, cancel)
- [ ] Dynamic premium calculation engine
- [ ] Parametric trigger monitoring (weather + platform APIs)
- [ ] Automated claim initiation pipeline
- [ ] Fraud detection MVP (zone anomaly + location stack)
- [ ] Mock payout via Razorpay sandbox

### Phase 3 (Weeks 5–6): Scale & Optimize
- [ ] Full anti-spoofing engine integration (all 4 signal layers)
- [ ] Human + AI review queue for flagged claims
- [ ] Worker dashboard (coverage status, payout history)
- [ ] Admin/insurer dashboard (loss ratios, predictive analytics)
- [ ] End-to-end simulated disruption demo
- [ ] Final pitch deck

---

*GigShield — Because every delivery matters, even the ones that never happen.*
