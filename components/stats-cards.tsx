"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  ShieldCheck,
  Clock,
  IndianRupee,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { workerApi, type MonthlyStats } from "@/lib/api";

export function StatsCards() {
  const [stats, setStats] = useState<MonthlyStats | null>(null);

  useEffect(() => {
    workerApi.getClaims().then(({ stats }) => setStats(stats)).catch(console.error);
  }, []);

  if (!stats) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-20 animate-pulse rounded bg-secondary" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      title: "This Month Earnings",
      value: `₹${(stats.totalEarnings ?? 0).toLocaleString("en-IN")}`,
      description: "+12% from last month",
      icon: IndianRupee,
      trend: "up",
    },
    {
      title: "Protected Amount",
      value: `₹${stats.protectedAmount ?? 0}`,
      description: `${stats.claimsCount ?? 0} claims auto-approved`,
      icon: ShieldCheck,
      trend: "up",
    },
    {
      title: "Disruption Hours",
      value: `${stats.disruptionHours ?? 0}hrs`,
      description: "Covered this month",
      icon: Clock,
      trend: "neutral",
    },
    {
      title: "Net Protection",
      value: `₹${stats.netProtection ?? 0}`,
      description: "After premiums paid",
      icon: TrendingUp,
      trend: "up",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statItems.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              {stat.trend === "up" && (
                <TrendingUp className="h-4 w-4 text-primary" />
              )}
            </div>
            <div className="mt-4">
              <p className="text-2xl font-semibold tracking-tight text-foreground">
                {stat.value}
              </p>
              <p className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </p>
              <p className="mt-1 text-xs text-primary">{stat.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
