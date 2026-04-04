// In-memory data store for EarnGuard backend
// Initialized from mock data; mutations persist for the lifetime of the Node process

import {
  currentWorker,
  currentPolicy,
  recentClaims,
  currentAlerts,
  triggers,
  premiumPlans,
  weeklyEarningsData,
  monthlyStats,
  zoneWeatherData,
  systemStatus,
  type Worker,
  type Policy,
  type Claim,
  type WeatherAlert,
  type Trigger,
} from "./mock-data";

import {
  adminStats,
  workersList,
  adminClaims,
  zoneMetrics,
  triggerActivity,
  weeklyPayoutData,
  type AdminStats,
  type WorkerOverview,
  type AdminClaim,
  type ZoneMetrics,
} from "./admin-mock-data";

// ─── Worker portal state ────────────────────────────────────────────────────

export let workerProfile: Worker = { ...currentWorker };
export let workerPolicy: Policy = { ...currentPolicy };
export let workerClaims: Claim[] = recentClaims.map((c) => ({ ...c }));
export let activeAlerts: WeatherAlert[] = currentAlerts.map((a) => ({ ...a }));
export const availableTriggers: Trigger[] = triggers.map((t) => ({ ...t }));
export const premiumPlansData = premiumPlans.map((p) => ({ ...p }));
export const weeklyEarnings = weeklyEarningsData.map((e) => ({ ...e }));
export let workerMonthlyStats = { ...monthlyStats };
export const zoneWeather = { ...zoneWeatherData };
export const sysStatus = { ...systemStatus };

// ─── Admin portal state ─────────────────────────────────────────────────────

export let platformStats: AdminStats = { ...adminStats };
export const allWorkers: WorkerOverview[] = workersList.map((w) => ({ ...w }));
export let allAdminClaims: AdminClaim[] = adminClaims.map((c) => ({ ...c }));
export const allZoneMetrics: ZoneMetrics[] = zoneMetrics.map((z) => ({ ...z }));
export const triggerActivityData = triggerActivity.map((t) => ({ ...t }));
export const weeklyPayouts = weeklyPayoutData.map((p) => ({ ...p }));

// ─── Mutations ───────────────────────────────────────────────────────────────

export function updateClaimStatus(
  id: string,
  status: AdminClaim["status"]
): AdminClaim | null {
  const idx = allAdminClaims.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  allAdminClaims[idx] = { ...allAdminClaims[idx], status };
  platformStats = {
    ...platformStats,
    pendingClaims: allAdminClaims.filter((c) => c.status === "pending").length,
  };
  return allAdminClaims[idx];
}

export function updateWorkerPolicy(plan: Policy["plan"]): Policy {
  const planData = premiumPlansData.find((p) => p.id === plan);
  if (planData) {
    workerPolicy = {
      ...workerPolicy,
      plan,
      weeklyPremium: planData.weeklyPremium,
      coverageCap: planData.coverageCap,
    };
  }
  return workerPolicy;
}
