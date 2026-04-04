"use client";

import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ShieldAlert, TrendingDown, Eye, Ban, CheckCircle } from "lucide-react";
import { adminApi, type AdminClaim, type AdminStats } from "@/lib/api";

export default function AdminFraudPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [flaggedClaims, setFlaggedClaims] = useState<AdminClaim[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [allClaims, setAllClaims] = useState<AdminClaim[]>([]);

  useEffect(() => {
    adminApi.getFraud().then(({ flaggedClaims, stats }) => {
      setFlaggedClaims(flaggedClaims ?? []);
      setStats(stats);
    }).catch(console.error);
    adminApi.getClaims().then(setAllClaims).catch(console.error);
  }, []);

  const highRiskClaims = allClaims.filter(c => c.fraudScore >= 0.5);

  const handleAction = async (id: string, status: AdminClaim["status"]) => {
    try {
      const updated = await adminApi.updateClaim(id, status);
      setFlaggedClaims(prev => prev.filter(c => c.id !== updated.id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="md:pl-64">
        <div className="container max-w-6xl px-4 py-6 md:px-6 lg:py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">Fraud Detection</h1>
            <p className="mt-1 text-muted-foreground">AI-powered fraud monitoring and alerts</p>
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <Card className="border-destructive/30 bg-destructive/5">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">{stats?.fraudAlertsToday ?? "—"}</p>
                  <p className="text-sm text-muted-foreground">Alerts Today</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                  <ShieldAlert className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">{highRiskClaims.length}</p>
                  <p className="text-sm text-muted-foreground">High Risk Claims</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingDown className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">0.8%</p>
                  <p className="text-sm text-muted-foreground">Fraud Rate</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Flagged Claims */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-foreground">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                Flagged Claims
              </CardTitle>
            </CardHeader>
            <CardContent>
              {flaggedClaims.length > 0 ? (
                <div className="space-y-4">
                  {flaggedClaims.map((claim) => (
                    <div key={claim.id} className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">{claim.workerName}</p>
                            <Badge variant="destructive">High Risk</Badge>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {claim.id} - {claim.triggerName ?? claim.triggerType} - {claim.zoneAffected ?? claim.zone}
                          </p>
                          <div className="mt-2 flex items-center gap-4 text-sm">
                            <span className="text-foreground">Amount: ₹{claim.payoutAmount ?? claim.amount}</span>
                            <span className="text-destructive font-medium">
                              Fraud Score: {Math.round(claim.fraudScore * 100)}%
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="gap-1">
                            <Eye className="h-4 w-4" />
                            Review
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 text-destructive border-destructive/50"
                            onClick={() => handleAction(claim.id, "rejected")}
                          >
                            <Ban className="h-4 w-4" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            className="gap-1"
                            onClick={() => handleAction(claim.id, "approved")}
                          >
                            <CheckCircle className="h-4 w-4" />
                            Clear
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                  <p className="mt-4 font-medium text-foreground">No Flagged Claims</p>
                  <p className="mt-1 text-sm text-muted-foreground">All claims are within normal parameters</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Fraud Detection Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-foreground">Detection Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { rule: "Location Mismatch", desc: "Worker not in claimed zone during disruption", status: "active" },
                  { rule: "Frequency Anomaly", desc: "Claims exceed 3x zone average", status: "active" },
                  { rule: "Timing Pattern", desc: "Claims always at shift boundaries", status: "active" },
                  { rule: "Cross-Platform Check", desc: "Activity detected on competing platform", status: "active" },
                  { rule: "Device Fingerprint", desc: "Multiple accounts from same device", status: "active" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="font-medium text-foreground">{item.rule}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-primary/30">Active</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
