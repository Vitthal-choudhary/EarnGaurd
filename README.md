## Inspiration

India has 11 million gig delivery workers. When a Mumbai monsoon hits or a platform goes down, they lose 20–30% of their monthly income in hours — with zero recourse. Health insurance exists. Vehicle insurance exists. But **nobody insures the income itself.**

We kept asking: what if the payout just *happened* — no form, no adjuster, no waiting? That question became Earnguard.

---

## What It Does

Earnguard is a **parametric income protection platform** for Q-commerce delivery partners (Zepto, Blinkit, Swiggy Instamart). Workers pay ₹99–₹199/week and receive automatic payouts when an external disruption — heavy rainfall, cyclone, AQI shutdown, platform outage, or civil bandh — hits their zone during their shift window.

**No claim filing. No proof of loss. Just a UPI transfer within 60 seconds.**

The payout formula:

$$\text{Payout} = \min\left(\bar{e}_h \times t_d \times 0.75,\ C_{\text{plan}}\right)$$

Where \\( \bar{e}_h \\) is the worker's 30-day rolling average hourly earnings, \\( t_d \\) is verified disruption hours within their shift window, and \\( 0.75 \\) is the parametric coverage factor that prices in basis risk.

**Three AI/ML models power the platform:**
- **XGBoost** — personalised weekly premium per zone and season
- **Isolation Forest** — fraud probability scoring (0.0–1.0) on every claim
- **Facebook Prophet** — 4-week disruption frequency forecasts for insurers

---

## How We Built It

**Trigger Engine:** A CRON-based pipeline (every 5 min) polls OpenWeatherMap, CPCB AQI, IMD, Google Maps, and Q-commerce webhooks. A **deterministic rule engine** — not an LLM — makes every YES/NO payout decision. LLMs are used strictly upstream to parse unstructured IMD bulletins into structured JSON signals. Every decision is fully auditable.

**Anti-Spoofing Stack:** GPS alone is trivially fakeable. Our defense layers:
1. Cell tower triangulation (OpenCelliD) — independent of GPS
2. IP geolocation — home broadband vs. field mobile data
3. Wi-Fi SSID fingerprint — device connected to home router?
4. GPS jitter analysis — spoofed coordinates are statistically *too perfect*
5. 90-day delivery heatmap — genuine workers get stranded where they actually work
6. Live news corroboration (Brave Search + NewsAPI) — independently verifies the crisis happened

**Fraud score:**
$$\text{FPS} = 0.25 \cdot s_{\text{loc}} + 0.20 \cdot s_{\text{zone}} + 0.25 \cdot s_{\text{news}} + 0.15 \cdot s_{\text{behavior}} + 0.15 \cdot s_{\text{anomaly}}$$

GREEN (< 0.30) → auto-pay. YELLOW → 2-hour soft hold. RED → provisional ₹200–500 credit released immediately + human review.

**Stack:** React Native (worker app) · Java Spring Boot microservices · Python FastAPI (ML) · Apache Kafka · PostgreSQL + PostGIS · MongoDB · Redis · Razorpay/UPI · Firebase/Twilio

---

## Challenges We Ran Into

**Basis risk vs. zero-touch tension.** Parametric insurance by design doesn't perfectly match individual loss. Verifying *intent to work* would require proof — which breaks the zero-form model. We resolved this by pricing the 0.75 coverage factor to absorb expected leakage and using behavioral history to flag chronic opportunistic claims over time.

**GPS spoofing is trivial; defeating it isn't.** A free APK and a Telegram channel can fake GPS. Building a multi-signal stack that catches this *without punishing genuine workers in bad connectivity zones* required careful threshold design — soft holds, trust score credits, and declared-disaster overrides.

**No India-specific gig fraud dataset exists.** We bootstrapped the Isolation Forest using a Kaggle auto-insurance fraud dataset with feature mapping, and designed the system so it improves as Earnguard-specific claim data accumulates.

---

## Accomplishments That We're Proud Of

- A **fully zero-touch claims architecture** — from event detection to UPI in < 90 seconds
- An anti-spoofing engine that exploits the asymmetry between what a real crisis leaves behind vs. what a spoofer can fake across 7 independent signals
- A **RED-tier provisional credit** design: flagged workers are never left stranded while review completes — the hardest UX problem in parametric fraud defense
- Premium caps of 0.7x–2x base rate regardless of risk score, ensuring affordability is structurally guaranteed

---

## What We Learned

- Parametric insurance is a design problem as much as an actuarial one — the trigger definitions, basis risk factor, and shift-window logic took more iteration than any model
- The news corroboration layer (independently verifying the crisis via public APIs) is architecturally the single most powerful fraud signal — a syndicate cannot fabricate an official IMD advisory
- Protecting honest workers from false positives is harder than catching fraudsters — the trust score, zone context override, and transparent appeals pathway were all designed in response to this

---

## What's Next for Earnguard

- **Phase 2:** Live pilot with 200 Zepto/Blinkit partners in Mumbai and Bengaluru; integrate Blinkit Q-commerce webhooks for real-time order failure signals
- **Phase 3:** Facebook Prophet loss ratio forecasting dashboard for insurer partners; expand triggers to food delivery and e-commerce personas
- **Regulatory pathway:** Engage IRDAI's regulatory sandbox for parametric micro-insurance products targeting gig workers
- **Long-term:** Port the parametric engine to auto-rickshaw drivers, construction daily-wage workers, and street vendors — any income stream with a measurable external disruption signal
