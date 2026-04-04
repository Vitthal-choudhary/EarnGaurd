// Admin-specific mock data for EarnGuard

export interface AdminStats {
  totalWorkers: number;
  activePolices?: number;
  activePolicies?: number;
  todayPayouts: number;
  pendingClaims: number;
  claimApprovalRate: number;
  avgClaimTime: string;
  weeklyPremiumCollected?: number;
  fraudAlertsToday: number;
}

export interface WorkerOverview {
  id: string;
  name: string;
  zone: string;
  platform: string;
  plan: string;
  trustScore: number;
  claimsThisMonth: number;
  status: "active" | "pending" | "suspended";
}

export interface AdminClaim {
  id: string;
  workerId: string;
  workerName: string;
  zone?: string;
  zoneAffected?: string;
  triggerType?: string;
  triggerName?: string;
  amount?: number;
  payoutAmount?: number;
  status: "pending" | "under_review" | "auto_approved" | "approved" | "rejected" | "paid";
  fraudScore: number;
  timestamp?: string;
  createdAt?: string;
  flagged: boolean;
}

export interface ZoneMetrics {
  zone: string;
  activeWorkers: number;
  totalClaims: number;
  avgPayoutTime: string;
  riskLevel: "low" | "medium" | "high";
  alertsToday: number;
}

export const adminStats: AdminStats = {
  totalWorkers: 12453,
  activePolices: 11892,
  todayPayouts: 847520,
  pendingClaims: 23,
  claimApprovalRate: 94.2,
  avgClaimTime: "47 seconds",
  weeklyPremiumCollected: 1847320,
  fraudAlertsToday: 3,
};

export const workersList: WorkerOverview[] = [
  { id: "WKR-001", name: "Ravi Kumar", zone: "Andheri East", platform: "Zepto", plan: "Pro Shield", trustScore: 85, claimsThisMonth: 4, status: "active" },
  { id: "WKR-002", name: "Priya Sharma", zone: "Bandra West", platform: "Blinkit", plan: "Standard Shield", trustScore: 92, claimsThisMonth: 2, status: "active" },
  { id: "WKR-003", name: "Amit Singh", zone: "Powai", platform: "Swiggy Instamart", plan: "Pro Shield", trustScore: 78, claimsThisMonth: 5, status: "active" },
  { id: "WKR-004", name: "Meera Patel", zone: "Malad West", platform: "Zepto", plan: "Basic Shield", trustScore: 88, claimsThisMonth: 1, status: "active" },
  { id: "WKR-005", name: "Suresh Nair", zone: "Kurla", platform: "Blinkit", plan: "Pro Shield", trustScore: 45, claimsThisMonth: 8, status: "suspended" },
  { id: "WKR-006", name: "Arun Verma", zone: "Goregaon", platform: "Zepto", plan: "Standard Shield", trustScore: 72, claimsThisMonth: 3, status: "active" },
  { id: "WKR-007", name: "Kavita Joshi", zone: "Thane", platform: "Swiggy Instamart", plan: "Basic Shield", trustScore: 90, claimsThisMonth: 0, status: "active" },
  { id: "WKR-008", name: "Rajesh Gupta", zone: "Andheri West", platform: "Blinkit", plan: "Pro Shield", trustScore: 65, claimsThisMonth: 6, status: "pending" },
];

export const adminClaims: AdminClaim[] = [
  { id: "CLM-101", workerId: "WKR-005", workerName: "Suresh Nair", zone: "Kurla", triggerType: "Heavy Rainfall", amount: 225, status: "pending", fraudScore: 0.72, timestamp: "2026-03-20T14:30:00", flagged: true },
  { id: "CLM-102", workerId: "WKR-003", workerName: "Amit Singh", zone: "Powai", triggerType: "Platform Outage", amount: 150, status: "pending", fraudScore: 0.15, timestamp: "2026-03-20T13:45:00", flagged: false },
  { id: "CLM-103", workerId: "WKR-008", workerName: "Rajesh Gupta", zone: "Andheri West", triggerType: "Heavy Rainfall", amount: 180, status: "pending", fraudScore: 0.38, timestamp: "2026-03-20T12:20:00", flagged: false },
  { id: "CLM-104", workerId: "WKR-001", workerName: "Ravi Kumar", zone: "Andheri East", triggerType: "Heavy Rainfall", amount: 169, status: "approved", fraudScore: 0.12, timestamp: "2026-03-20T11:00:00", flagged: false },
  { id: "CLM-105", workerId: "WKR-002", workerName: "Priya Sharma", zone: "Bandra West", triggerType: "AQI Shutdown", amount: 200, status: "paid", fraudScore: 0.08, timestamp: "2026-03-19T16:30:00", flagged: false },
  { id: "CLM-106", workerId: "WKR-005", workerName: "Suresh Nair", zone: "Kurla", triggerType: "Heavy Rainfall", amount: 300, status: "rejected", fraudScore: 0.85, timestamp: "2026-03-19T14:00:00", flagged: true },
];

export const zoneMetrics: ZoneMetrics[] = [
  { zone: "Andheri East", activeWorkers: 1245, totalClaims: 342, avgPayoutTime: "42s", riskLevel: "medium", alertsToday: 2 },
  { zone: "Bandra West", activeWorkers: 892, totalClaims: 156, avgPayoutTime: "38s", riskLevel: "low", alertsToday: 0 },
  { zone: "Powai", activeWorkers: 678, totalClaims: 289, avgPayoutTime: "55s", riskLevel: "high", alertsToday: 3 },
  { zone: "Malad West", activeWorkers: 534, totalClaims: 178, avgPayoutTime: "41s", riskLevel: "medium", alertsToday: 1 },
  { zone: "Kurla", activeWorkers: 423, totalClaims: 412, avgPayoutTime: "1m 12s", riskLevel: "high", alertsToday: 4 },
  { zone: "Goregaon", activeWorkers: 756, totalClaims: 201, avgPayoutTime: "45s", riskLevel: "low", alertsToday: 0 },
];

export const triggerActivity = [
  { trigger: "Heavy Rainfall", count: 156, percentage: 45 },
  { trigger: "Platform Outage", count: 89, percentage: 26 },
  { trigger: "AQI Shutdown", count: 52, percentage: 15 },
  { trigger: "Extreme Heat", count: 28, percentage: 8 },
  { trigger: "Other", count: 21, percentage: 6 },
];

export const weeklyPayoutData = [
  { day: "Mon", payouts: 125000, claims: 45 },
  { day: "Tue", payouts: 98000, claims: 38 },
  { day: "Wed", payouts: 245000, claims: 89 },
  { day: "Thu", payouts: 156000, claims: 52 },
  { day: "Fri", payouts: 112000, claims: 41 },
  { day: "Sat", payouts: 78000, claims: 28 },
  { day: "Sun", payouts: 33520, claims: 15 },
];
