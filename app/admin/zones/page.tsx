"use client";

import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, FileCheck, Clock, AlertTriangle } from "lucide-react";
import { adminApi, type ZoneMetrics } from "@/lib/api";

const riskConfig = {
  low: { label: "Low Risk", className: "bg-primary/10 text-primary border-primary/30" },
  medium: { label: "Medium Risk", className: "bg-warning/10 text-warning border-warning/30" },
  high: { label: "High Risk", className: "bg-destructive/10 text-destructive border-destructive/30" },
};

export default function AdminZonesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [zones, setZones] = useState<ZoneMetrics[]>([]);

  useEffect(() => {
    adminApi.getZones().then((alerts: any[]) => {
      // Group WeatherAlert[] by zone name into ZoneMetrics[]
      const zoneMap = new Map<string, ZoneMetrics>();
      (alerts ?? []).forEach((alert) => {
        const existing = zoneMap.get(alert.zone) ?? {
          zone: alert.zone,
          riskLevel: "low" as const,
          alertsToday: 0,
          activeWorkers: 0,
          totalClaims: 0,
          avgPayoutTime: "< 60s",
        };
        const sev = alert.severity;
        if (sev === "red") existing.riskLevel = "high";
        else if (sev === "orange" && existing.riskLevel !== "high") existing.riskLevel = "medium";
        if (alert.isActive) existing.alertsToday++;
        zoneMap.set(alert.zone, existing);
      });
      setZones(Array.from(zoneMap.values()));
    }).catch(console.error);
  }, []);

  const totalWorkers = zones.reduce((sum, z) => sum + z.activeWorkers, 0);
  const totalClaims = zones.reduce((sum, z) => sum + z.totalClaims, 0);
  const totalAlerts = zones.reduce((sum, z) => sum + z.alertsToday, 0);

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="md:pl-64">
        <div className="container max-w-7xl px-4 py-6 md:px-6 lg:py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">Zone Management</h1>
            <p className="mt-1 text-muted-foreground">Monitor coverage zones and risk levels</p>
          </div>

          {/* Summary Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-4">
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">{zones.length}</p>
                  <p className="text-sm text-muted-foreground">Active Zones</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">{totalWorkers.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Workers</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <FileCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">{totalClaims.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Claims</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                  <AlertTriangle className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">{totalAlerts}</p>
                  <p className="text-sm text-muted-foreground">Alerts Today</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Zone Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {zones.map((zone) => {
              const risk = riskConfig[zone.riskLevel] ?? riskConfig["low"];
              return (
                <Card key={zone.zone} className={zone.riskLevel === "high" ? "border-destructive/30" : ""}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-base text-foreground">{zone.zone}</CardTitle>
                    <Badge className={risk.className}>{risk.label}</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-secondary/50 p-3">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Workers</span>
                        </div>
                        <p className="mt-1 text-lg font-semibold text-foreground">{zone.activeWorkers.toLocaleString()}</p>
                      </div>
                      <div className="rounded-lg bg-secondary/50 p-3">
                        <div className="flex items-center gap-2">
                          <FileCheck className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Claims</span>
                        </div>
                        <p className="mt-1 text-lg font-semibold text-foreground">{zone.totalClaims}</p>
                      </div>
                      <div className="rounded-lg bg-secondary/50 p-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Avg Payout</span>
                        </div>
                        <p className="mt-1 text-lg font-semibold text-foreground">{zone.avgPayoutTime}</p>
                      </div>
                      <div className="rounded-lg bg-secondary/50 p-3">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Alerts</span>
                        </div>
                        <p className={`mt-1 text-lg font-semibold ${zone.alertsToday > 2 ? "text-destructive" : "text-foreground"}`}>
                          {zone.alertsToday}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
