"use client";

import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Shield,
  IndianRupee,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";
import { adminApi, type AdminStats, type AdminClaim, type ZoneMetrics, type TriggerActivity, type PayoutDay } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["hsl(var(--primary))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--muted))"];

export default function AdminDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [claims, setClaims] = useState<AdminClaim[]>([]);
  const [zones, setZones] = useState<ZoneMetrics[]>([]);
  const [triggerActivity, setTriggerActivity] = useState<TriggerActivity[]>([]);
  const [weeklyPayouts, setWeeklyPayouts] = useState<PayoutDay[]>([]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin/login");
      return;
    }
    setMounted(true);
    Promise.all([
      adminApi.getStats(),
      adminApi.getClaims(),
      adminApi.getZones(),
      adminApi.getTriggers(),
      adminApi.getPayouts(),
    ])
      .then(([s, c, z, t, p]) => {
        setStats(s);
        setClaims(c);
        setZones(z);
        setTriggerActivity(t?.activity ?? []);
        setWeeklyPayouts(p?.weekly ?? []);
      })
      .catch(console.error);
  }, [router]);

  if (!stats) {
    return (
      <div className="min-h-screen bg-background">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="md:pl-64">
          <div className="container max-w-7xl px-4 py-6">
            <div className="h-64 animate-pulse rounded-lg bg-secondary" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="md:pl-64">
        <div className="container max-w-7xl px-4 py-6 md:px-6 lg:py-8">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                Admin Dashboard
              </h1>
              <p className="mt-1 text-muted-foreground">
                Platform overview and real-time metrics
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                Live
              </Badge>
              <span className="text-sm text-muted-foreground">
                Last updated: {mounted ? "just now" : "..."}
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">
                    {stats.totalWorkers.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Workers</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">
                    {stats.activePolicies?.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Active Policies</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <IndianRupee className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">
                    ₹{((stats.todayPayouts ?? stats.totalPayoutsIssued ?? 0) / 1000).toFixed(0)}K
                  </p>
                  <p className="text-sm text-muted-foreground">Today's Payouts</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">
                    {stats.pendingClaims}
                  </p>
                  <p className="text-sm text-muted-foreground">Pending Claims</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Secondary Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-3xl font-bold text-primary">{stats.claimApprovalRate ?? Math.round((stats.approvedClaims / Math.max(stats.totalClaims, 1)) * 100)}%</p>
                  <p className="text-sm text-muted-foreground">Approval Rate</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary/50" />
              </CardContent>
            </Card>
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-3xl font-bold text-primary">{stats.avgClaimTime ?? "< 60s"}</p>
                  <p className="text-sm text-muted-foreground">Avg Claim Time</p>
                </div>
                <CheckCircle className="h-8 w-8 text-primary/50" />
              </CardContent>
            </Card>
            <Card className="bg-destructive/5 border-destructive/20">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-3xl font-bold text-destructive">{stats.fraudAlertsToday ?? stats.flaggedClaims ?? 0}</p>
                  <p className="text-sm text-muted-foreground">Fraud Alerts Today</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-destructive/50" />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Charts Section */}
            <div className="space-y-6 lg:col-span-2">
              {/* Weekly Payouts Chart */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base text-foreground">Weekly Payouts</CardTitle>
                  <Link href="/admin/payouts">
                    <Button variant="ghost" size="sm" className="gap-1">
                      View All <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyPayouts}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="day" className="text-xs fill-muted-foreground" />
                        <YAxis className="text-xs fill-muted-foreground" tickFormatter={(v) => `₹${v/1000}K`} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                          formatter={(value: number) => [`₹${value.toLocaleString()}`, "Payouts"]}
                        />
                        <Bar dataKey="payouts" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Pending Claims */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base text-foreground">Pending Claims</CardTitle>
                  <Link href="/admin/claims">
                    <Button variant="ghost" size="sm" className="gap-1">
                      View All <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {claims.filter(c => c.status === "under_review" || c.status === "pending").slice(0, 3).map((claim) => (
                      <div key={claim.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                        <div className="flex items-center gap-4">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${claim.flagged ? "bg-destructive/10" : "bg-secondary"}`}>
                            {claim.flagged ? (
                              <AlertTriangle className="h-5 w-5 text-destructive" />
                            ) : (
                              <Clock className="h-5 w-5 text-warning" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{claim.workerName}</p>
                            <p className="text-sm text-muted-foreground">{claim.triggerName} - {claim.zoneAffected}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">₹{claim.payoutAmount}</p>
                          {claim.flagged && (
                            <Badge variant="destructive" className="text-xs">Flagged</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Trigger Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-foreground">Trigger Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={triggerActivity}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          dataKey="count"
                          nameKey="trigger"
                        >
                          {triggerActivity.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 space-y-2">
                    {triggerActivity.slice(0, 4).map((item, idx) => (
                      <div key={item.trigger} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                          <span className="text-muted-foreground">{item.trigger}</span>
                        </div>
                        <span className="font-medium text-foreground">{item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Zone Alerts */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base text-foreground">Zone Status</CardTitle>
                  <Link href="/admin/zones">
                    <Button variant="ghost" size="sm" className="gap-1">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {zones.slice(0, 4).map((zone) => (
                      <div key={zone.zone} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-foreground">{zone.zone}</p>
                          <p className="text-xs text-muted-foreground">{zone.activeWorkers} workers</p>
                        </div>
                        <Badge
                          variant={zone.riskLevel === "high" ? "destructive" : zone.riskLevel === "medium" ? "secondary" : "outline"}
                          className="capitalize"
                        >
                          {zone.riskLevel}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
