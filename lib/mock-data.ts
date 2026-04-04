// Mock data for EarnGuard demo

export interface Worker {
  id: string;
  name: string;
  phone: string;
  zone: string;
  pincode: string;
  platform: "Zepto" | "Blinkit" | "Swiggy Instamart";
  avgDailyEarnings: number;
  avgHourlyEarnings: number;
  workingHours: { start: number; end: number };
  tenure: number; // months
  trustScore: number; // 0-100
}

export interface Policy {
  id: string;
  workerId: string;
  plan: "basic" | "standard" | "pro";
  weeklyPremium: number;
  coverageCap: number;
  startDate: string;
  endDate: string;
  status: "active" | "expired" | "pending";
  riskTier: "low" | "medium" | "high";
}

export interface Claim {
  id: string;
  workerId: string;
  triggerId: string;
  triggerName: string;
  timestamp: string;
  zoneAffected: string;
  disruptionHours: number;
  payoutAmount: number;
  status: "auto_approved" | "under_review" | "paid" | "rejected";
  fraudScore: number;
}

export interface WeatherAlert {
  id: string;
  type: "rainfall" | "cyclone" | "heat" | "aqi" | "flood";
  severity: "yellow" | "orange" | "red";
  zone: string;
  pincode: string;
  message: string;
  startTime: string;
  endTime?: string;
  isActive: boolean;
}

export interface Trigger {
  id: string;
  name: string;
  description: string;
  threshold: string;
  icon: string;
}

// Current worker (logged in user)
export const currentWorker: Worker = {
  id: "WKR-001",
  name: "Ravi Kumar",
  phone: "+91 98765 43210",
  zone: "Andheri East",
  pincode: "400069",
  platform: "Zepto",
  avgDailyEarnings: 750,
  avgHourlyEarnings: 75,
  workingHours: { start: 10, end: 22 },
  tenure: 8,
  trustScore: 85,
};

// Current active policy
export const currentPolicy: Policy = {
  id: "POL-2026-0312",
  workerId: "WKR-001",
  plan: "pro",
  weeklyPremium: 179, // discounted from 199 due to clean history
  coverageCap: 1200,
  startDate: "2026-03-16",
  endDate: "2026-03-22",
  status: "active",
  riskTier: "medium",
};

// Recent claims history
export const recentClaims: Claim[] = [
  {
    id: "CLM-001",
    workerId: "WKR-001",
    triggerId: "T-01",
    triggerName: "Heavy Rainfall",
    timestamp: "2026-03-18T14:30:00",
    zoneAffected: "Andheri East",
    disruptionHours: 3,
    payoutAmount: 169,
    status: "paid",
    fraudScore: 0.12,
  },
  {
    id: "CLM-002",
    workerId: "WKR-001",
    triggerId: "T-05",
    triggerName: "Platform Outage",
    timestamp: "2026-03-12T18:45:00",
    zoneAffected: "Andheri East",
    disruptionHours: 2,
    payoutAmount: 113,
    status: "paid",
    fraudScore: 0.08,
  },
  {
    id: "CLM-003",
    workerId: "WKR-001",
    triggerId: "T-01",
    triggerName: "Heavy Rainfall",
    timestamp: "2026-03-05T16:00:00",
    zoneAffected: "Andheri East",
    disruptionHours: 4,
    payoutAmount: 225,
    status: "paid",
    fraudScore: 0.15,
  },
  {
    id: "CLM-004",
    workerId: "WKR-001",
    triggerId: "T-04",
    triggerName: "AQI Shutdown",
    timestamp: "2026-02-28T09:00:00",
    zoneAffected: "Andheri East",
    disruptionHours: 5,
    payoutAmount: 281,
    status: "paid",
    fraudScore: 0.05,
  },
];

// Current weather alerts
export const currentAlerts: WeatherAlert[] = [
  {
    id: "ALT-001",
    type: "rainfall",
    severity: "orange",
    zone: "Andheri East",
    pincode: "400069",
    message: "Heavy rainfall expected. 45mm/3hr predicted. Coverage active.",
    startTime: "2026-03-20T15:00:00",
    isActive: true,
  },
  {
    id: "ALT-002",
    type: "aqi",
    severity: "yellow",
    zone: "Mumbai",
    pincode: "400001",
    message: "AQI rising to 320. Monitoring for advisory threshold.",
    startTime: "2026-03-20T08:00:00",
    isActive: true,
  },
];

// Trigger definitions
export const triggers: Trigger[] = [
  {
    id: "T-01",
    name: "Heavy Rainfall",
    description: "Rainfall exceeds 40mm in 3 hours",
    threshold: ">40mm/3hr",
    icon: "cloud-rain",
  },
  {
    id: "T-02",
    name: "Cyclone Alert",
    description: "Orange/Red cyclone warning issued by IMD",
    threshold: "IMD Orange/Red",
    icon: "wind",
  },
  {
    id: "T-03",
    name: "Extreme Heat",
    description: "Temperature exceeds 42°C in zone",
    threshold: ">42°C",
    icon: "thermometer",
  },
  {
    id: "T-04",
    name: "AQI Shutdown",
    description: "Air quality index exceeds 400 with advisory",
    threshold: "AQI >400",
    icon: "cloud-fog",
  },
  {
    id: "T-05",
    name: "Platform Outage",
    description: "Order failure rate exceeds 60% in zone",
    threshold: ">60% failure",
    icon: "wifi-off",
  },
  {
    id: "T-06",
    name: "Civil Disruption",
    description: "Road blockage in major arteries",
    threshold: ">3 arteries blocked",
    icon: "alert-triangle",
  },
  {
    id: "T-07",
    name: "Natural Disaster",
    description: "NDMA/IMD disaster advisory issued",
    threshold: "Official Advisory",
    icon: "shield-alert",
  },
];

// Premium plans
export const premiumPlans = [
  {
    id: "basic",
    name: "Basic Shield",
    weeklyPremium: 99,
    coverageCap: 500,
    triggers: ["Weather only"],
    color: "secondary",
  },
  {
    id: "standard",
    name: "Standard Shield",
    weeklyPremium: 149,
    coverageCap: 800,
    triggers: ["Weather", "Platform Outage"],
    color: "primary",
  },
  {
    id: "pro",
    name: "Pro Shield",
    weeklyPremium: 199,
    coverageCap: 1200,
    triggers: ["All covered triggers"],
    color: "accent",
    recommended: true,
  },
];

// Weekly earnings data for chart
export const weeklyEarningsData = [
  { day: "Mon", earnings: 780, protected: 0 },
  { day: "Tue", earnings: 650, protected: 0 },
  { day: "Wed", earnings: 420, protected: 169 },
  { day: "Thu", earnings: 810, protected: 0 },
  { day: "Fri", earnings: 890, protected: 0 },
  { day: "Sat", earnings: 720, protected: 0 },
  { day: "Sun", earnings: 560, protected: 0 },
];

// Monthly stats
export const monthlyStats = {
  totalEarnings: 22450,
  protectedAmount: 788,
  premiumsPaid: 716,
  netProtection: 72,
  claimsCount: 4,
  disruptionHours: 14,
};

// Zone weather data
export const zoneWeatherData = {
  temperature: 32,
  humidity: 78,
  rainfall: 12,
  aqi: 156,
  windSpeed: 18,
  condition: "Partly Cloudy",
};

// Simulated real-time status
export const systemStatus = {
  apiHealth: "operational",
  lastSync: "2026-03-20T14:55:00",
  activeWorkers: 12453,
  pendingClaims: 23,
  todayPayouts: 847520,
};
