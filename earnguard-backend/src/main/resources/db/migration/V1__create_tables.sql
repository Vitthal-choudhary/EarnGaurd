-- EarnGuard Database Schema
-- V1: Initial table creation

-- Workers (gig delivery partners)
CREATE TABLE workers (
    id            VARCHAR(20)    PRIMARY KEY,
    name          VARCHAR(100)   NOT NULL,
    phone         VARCHAR(20)    UNIQUE NOT NULL,
    password      VARCHAR(255)   NOT NULL,
    zone          VARCHAR(100)   NOT NULL,
    pincode       VARCHAR(10)    NOT NULL,
    platform      VARCHAR(50)    NOT NULL,
    avg_daily_earnings   NUMERIC(10, 2) DEFAULT 0,
    avg_hourly_earnings  NUMERIC(10, 2) DEFAULT 0,
    working_hours_start  INT            DEFAULT 9,
    working_hours_end    INT            DEFAULT 21,
    tenure_months        INT            DEFAULT 0,
    trust_score          INT            DEFAULT 100
                         CHECK (trust_score >= 0 AND trust_score <= 100),
    status        VARCHAR(20)    DEFAULT 'active'
                  CHECK (status IN ('active', 'pending', 'suspended')),
    created_at    TIMESTAMP      DEFAULT NOW(),
    updated_at    TIMESTAMP      DEFAULT NOW()
);

-- Admin users
CREATE TABLE admin_users (
    id          BIGSERIAL      PRIMARY KEY,
    username    VARCHAR(50)    UNIQUE NOT NULL,
    password    VARCHAR(255)   NOT NULL,
    email       VARCHAR(100)   UNIQUE,
    full_name   VARCHAR(100),
    role        VARCHAR(20)    DEFAULT 'ADMIN',
    created_at  TIMESTAMP      DEFAULT NOW()
);

-- Premium plan tiers
CREATE TABLE premium_plans (
    id               VARCHAR(20)    PRIMARY KEY,
    name             VARCHAR(100)   NOT NULL,
    weekly_premium   NUMERIC(10, 2) NOT NULL,
    coverage_cap     NUMERIC(10, 2) NOT NULL,
    color            VARCHAR(30),
    is_recommended   BOOLEAN        DEFAULT FALSE
);

-- Trigger coverage per plan
CREATE TABLE plan_trigger_coverage (
    plan_id             VARCHAR(20)  REFERENCES premium_plans(id) ON DELETE CASCADE,
    trigger_description VARCHAR(100) NOT NULL,
    PRIMARY KEY (plan_id, trigger_description)
);

-- Disruption trigger definitions
CREATE TABLE disruption_triggers (
    id          VARCHAR(20)  PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    threshold   VARCHAR(100),
    icon        VARCHAR(50),
    is_active   BOOLEAN      DEFAULT TRUE,
    created_at  TIMESTAMP    DEFAULT NOW()
);

-- Policies (one active policy per worker at a time)
CREATE TABLE policies (
    id              VARCHAR(30)    PRIMARY KEY,
    worker_id       VARCHAR(20)    NOT NULL REFERENCES workers(id),
    plan_id         VARCHAR(20)    NOT NULL REFERENCES premium_plans(id),
    weekly_premium  NUMERIC(10, 2) NOT NULL,
    coverage_cap    NUMERIC(10, 2) NOT NULL,
    start_date      DATE           NOT NULL,
    end_date        DATE           NOT NULL,
    status          VARCHAR(20)    DEFAULT 'active'
                    CHECK (status IN ('active', 'expired', 'pending', 'cancelled')),
    risk_tier       VARCHAR(20)    DEFAULT 'medium'
                    CHECK (risk_tier IN ('low', 'medium', 'high')),
    created_at      TIMESTAMP      DEFAULT NOW(),
    updated_at      TIMESTAMP      DEFAULT NOW()
);

-- Claims (payout requests)
CREATE TABLE claims (
    id               VARCHAR(20)    PRIMARY KEY,
    worker_id        VARCHAR(20)    NOT NULL REFERENCES workers(id),
    trigger_id       VARCHAR(20)    REFERENCES disruption_triggers(id),
    trigger_name     VARCHAR(100),
    zone_affected    VARCHAR(100),
    disruption_hours INT            DEFAULT 1,
    payout_amount    NUMERIC(10, 2) DEFAULT 0,
    status           VARCHAR(30)    DEFAULT 'under_review'
                     CHECK (status IN ('auto_approved', 'under_review', 'paid', 'rejected', 'approved', 'pending')),
    fraud_score      NUMERIC(5, 4)  DEFAULT 0.0,
    flagged          BOOLEAN        DEFAULT FALSE,
    admin_notes      TEXT,
    created_at       TIMESTAMP      DEFAULT NOW(),
    resolved_at      TIMESTAMP
);

-- Weather / disruption alerts
CREATE TABLE weather_alerts (
    id          VARCHAR(20)  PRIMARY KEY,
    type        VARCHAR(30)  NOT NULL
                CHECK (type IN ('rainfall', 'cyclone', 'heat', 'aqi', 'flood', 'civil', 'disaster')),
    severity    VARCHAR(20)  NOT NULL
                CHECK (severity IN ('yellow', 'orange', 'red')),
    zone        VARCHAR(100),
    pincode     VARCHAR(10),
    message     TEXT,
    start_time  TIMESTAMP,
    end_time    TIMESTAMP,
    is_active   BOOLEAN      DEFAULT TRUE,
    created_at  TIMESTAMP    DEFAULT NOW()
);

-- Coverage zones
CREATE TABLE zones (
    id                     BIGSERIAL    PRIMARY KEY,
    name                   VARCHAR(100) UNIQUE NOT NULL,
    pincode                VARCHAR(10),
    risk_level             VARCHAR(20)  DEFAULT 'low'
                           CHECK (risk_level IN ('low', 'medium', 'high')),
    avg_payout_time_seconds INT          DEFAULT 60
);

-- Performance indexes
CREATE INDEX idx_policies_worker_id  ON policies(worker_id);
CREATE INDEX idx_policies_status     ON policies(status);
CREATE INDEX idx_claims_worker_id    ON claims(worker_id);
CREATE INDEX idx_claims_status       ON claims(status);
CREATE INDEX idx_claims_created_at   ON claims(created_at DESC);
CREATE INDEX idx_alerts_active       ON weather_alerts(is_active);
CREATE INDEX idx_alerts_pincode      ON weather_alerts(pincode);
CREATE INDEX idx_workers_phone       ON workers(phone);
CREATE INDEX idx_workers_zone        ON workers(zone);
