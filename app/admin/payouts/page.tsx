"use client";

import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, TrendingUp, ArrowUpRight, Wallet } from "lucide-react";
import { adminApi, type AdminStats, type PayoutDay } from "@/lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

export default function AdminPayoutsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [weeklyData, setWeeklyData] = useState<PayoutDay[]>([]);

  useEffect(() => {
    adminApi.getPayouts().then(({ stats, weekly }) => {
      setStats(stats);
      setWeeklyData(weekly);
    }).catch(console.error);
  }, []);

  const totalWeeklyPayouts = weeklyData.reduce((sum, d) => sum + d.payouts, 0);
  const totalWeeklyClaims = weeklyData.reduce((sum, d) => sum + d.claims, 0);
  const avgPayout = totalWeeklyClaims > 0 ? Math.round(totalWeeklyPayouts / totalWeeklyClaims) : 0;

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="md:pl-64">
        <div className="container max-w-7xl px-4 py-6 md:px-6 lg:py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">Payouts</h1>
            <p className="mt-1 text-muted-foreground">Financial overview and payout tracking</p>
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <IndianRupee className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">₹{stats ? (stats.todayPayouts / 1000).toFixed(0) : "—"}K</p>
                  <p className="text-sm text-muted-foreground">Today's Payouts</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">₹{(totalWeeklyPayouts / 1000).toFixed(0)}K</p>
                  <p className="text-sm text-muted-foreground">This Week</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">₹{avgPayout}</p>
                  <p className="text-sm text-muted-foreground">Avg Payout</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <ArrowUpRight className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">₹{stats ? ((stats.weeklyPremiumCollected ?? 0) / 1000).toFixed(0) : "—"}K</p>
                  <p className="text-sm text-muted-foreground">Premiums Collected</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base text-foreground">Daily Payouts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
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

            <Card>
              <CardHeader>
                <CardTitle className="text-base text-foreground">Claims Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="day" className="text-xs fill-muted-foreground" />
                      <YAxis className="text-xs fill-muted-foreground" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Line type="monotone" dataKey="claims" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Net Position */}
          {stats && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-base text-foreground">Weekly Net Position</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-3">
                  <div className="rounded-lg bg-primary/5 p-6 text-center">
                    <p className="text-sm text-muted-foreground">Premium Income</p>
                    <p className="mt-2 text-3xl font-bold text-primary">₹{((stats.weeklyPremiumCollected ?? 0) / 1000).toFixed(0)}K</p>
                  </div>
                  <div className="rounded-lg bg-destructive/5 p-6 text-center">
                    <p className="text-sm text-muted-foreground">Total Payouts</p>
                    <p className="mt-2 text-3xl font-bold text-destructive">₹{(totalWeeklyPayouts / 1000).toFixed(0)}K</p>
                  </div>
                  <div className="rounded-lg bg-primary/10 p-6 text-center">
                    <p className="text-sm text-muted-foreground">Net Position</p>
                    <p className="mt-2 text-3xl font-bold text-primary">
                      ₹{(((stats.weeklyPremiumCollected ?? 0) - totalWeeklyPayouts) / 1000).toFixed(0)}K
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
