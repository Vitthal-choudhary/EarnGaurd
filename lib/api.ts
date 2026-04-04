// Client-side API utility for EarnGuard frontend
// Calls Spring Boot backend at NEXT_PUBLIC_API_URL

import { getToken } from "./auth";

export type { Worker, Policy, Claim, WeatherAlert, Trigger } from "./mock-data";
export type {
  AdminStats,
  WorkerOverview,
  AdminClaim,
  ZoneMetrics,
} from "./admin-mock-data";

// ─── Compound response types ─────────────────────────────────────────────────

export interface MonthlyStats {
  totalEarnings: number;
  protectedAmount: number;
  premiumsPaid: number;
  netProtection: number;
  claimsCount: number;
  disruptionHours: number;
}

export interface EarningsDay {
  day: string;
  earnings: number;
  protected: number;
}

export interface PremiumPlan {
  id: string;
  name: string;
  weeklyPremium: number;
  coverageCap: number;
  triggers: string[];
  triggerCoverages?: string[];
  color: string;
  recommended?: boolean;
  isRecommended?: boolean;
}

export interface ZoneWeather {
  temperature: number;
  humidity: number;
  rainfall: number;
  aqi: number;
  windSpeed: number;
  condition: string;
}

export interface SystemStatus {
  apiHealth: string;
  lastSync: string;
  activeWorkers: number;
  pendingClaims: number;
  todayPayouts: number;
}

export interface TriggerActivity {
  trigger: string;
  count: number;
  percentage: number;
}

export interface PayoutDay {
  day: string;
  payouts: number;
  claims: number;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  role: string;
  id: string;
  name: string;
}

// ─── Generic fetcher ─────────────────────────────────────────────────────────

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    let message = `API error ${res.status} at ${path}`;
    try {
      const err = await res.json();
      if (err.message) message = err.message;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }

  const json = await res.json();
  // Spring Boot wraps responses as { success, message, data }
  return (json?.data !== undefined ? json.data : json) as T;
}

// ─── Auth API ─────────────────────────────────────────────────────────────────

export const authApi = {
  workerLogin: (identifier: string, password: string) =>
    apiFetch<AuthResponse>("/api/auth/worker/login", {
      method: "POST",
      body: JSON.stringify({ identifier, password }),
    }),

  adminLogin: (identifier: string, password: string) =>
    apiFetch<AuthResponse>("/api/auth/admin/login", {
      method: "POST",
      body: JSON.stringify({ identifier, password }),
    }),
};

// ─── Worker API ───────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const workerApi = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getProfile: () => apiFetch<any>("/api/worker/profile"),

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getPolicy: () => apiFetch<any>("/api/worker/policy"),

  updatePolicy: (planId: string) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    apiFetch<any>("/api/worker/policy", {
      method: "POST",
      body: JSON.stringify({ planId }),
    }),

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getClaims: () => apiFetch<any>("/api/worker/claims"),

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAlerts: () => apiFetch<any>("/api/worker/alerts"),

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTriggers: () => apiFetch<any>("/api/worker/triggers"),

  getPlans: () => apiFetch<PremiumPlan[]>("/api/worker/plans"),

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getStatus: () => apiFetch<any>("/api/worker/status"),

  // not available in Spring Boot — kept for compat, returns mock-like data
  getEarnings: () => Promise.resolve([]),
};

// ─── Admin API ────────────────────────────────────────────────────────────────

export const adminApi = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getStats: () => apiFetch<any>("/api/admin/stats"),

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getWorkers: () => apiFetch<any[]>("/api/admin/workers"),

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getClaims: () => apiFetch<any[]>("/api/admin/claims"),

  updateClaim: (id: string, status: string) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    apiFetch<any>(`/api/admin/claims/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getZones: () => apiFetch<any[]>("/api/admin/zones").catch(() => []),

  getTriggers: () =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    apiFetch<any>("/api/admin/disruptions/triggers").catch(() => ({ triggers: [], activity: [] })),

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getPayouts: () => apiFetch<any>("/api/admin/payouts").catch(() => ({ stats: {}, weekly: [] })),

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getFraud: () => apiFetch<any>("/api/admin/fraud"),
};
