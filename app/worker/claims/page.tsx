"use client";

import { useState, useEffect } from "react";
import { WorkerHeader } from "@/components/worker/worker-header";
import { WorkerSidebar } from "@/components/worker/worker-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CloudRain, WifiOff, CloudFog, CheckCircle, Clock, XCircle, Download, Filter, TrendingUp, ShieldCheck, IndianRupee } from "lucide-react";
import { workerApi, type Claim, type MonthlyStats } from "@/lib/api";
import { formatDateTime } from "@/lib/date-utils";

const triggerIcons: Record<string, React.ElementType> = {
  "T-01": CloudRain,
  "T-04": CloudFog,
  "T-05": WifiOff,
};

const statusConfig: Record<string, { label: string; icon: React.ElementType; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  auto_approved: { label: "Auto-Approved", icon: CheckCircle, variant: "default" },
  approved: { label: "Approved", icon: CheckCircle, variant: "default" },
  paid: { label: "Paid", icon: CheckCircle, variant: "default" },
  under_review: { label: "Under Review", icon: Clock, variant: "secondary" },
  rejected: { label: "Rejected", icon: XCircle, variant: "destructive" },
};

export default function WorkerClaimsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [claims, setClaims] = useState<Claim[]>([]);
  const [stats, setStats] = useState<MonthlyStats | null>(null);

  useEffect(() => {
    workerApi.getClaims().then(({ claims, stats }) => {
      setClaims(claims);
      setStats(stats);
    }).catch(console.error);
  }, []);

  const filteredClaims = claims.filter((claim) => filter === "all" || claim.status === filter);
  const totalPayout = claims.filter((c) => c.status === "paid").reduce((sum, c) => sum + c.payoutAmount, 0);

  return (
    <div className="min-h-screen bg-background">
      <WorkerHeader onMenuClick={() => setSidebarOpen(true)} />
      <WorkerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="md:pl-64">
        <div className="container max-w-5xl px-4 py-6 md:px-6 lg:py-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">Claims History</h1>
              <p className="mt-1 text-muted-foreground">Track your automatic payouts and claim status</p>
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>

          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">{claims.length}</p>
                  <p className="text-sm text-muted-foreground">Total Claims</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <IndianRupee className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">₹{totalPayout}</p>
                  <p className="text-sm text-muted-foreground">Total Payouts</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">{stats?.disruptionHours ?? 0}hrs</p>
                  <p className="text-sm text-muted-foreground">Hours Protected</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base text-foreground">All Claims</CardTitle>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Filter by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Claims</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredClaims.map((claim) => (
                  <ClaimCard key={claim.id} claim={claim} />
                ))}
                {filteredClaims.length === 0 && (
                  <div className="py-12 text-center">
                    <p className="text-muted-foreground">No claims found for this filter</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function ClaimCard({ claim }: { claim: Claim }) {
  const Icon = triggerIcons[claim.triggerId] || CloudRain;
  const status = statusConfig[claim.status] ?? statusConfig["under_review"];
  const StatusIcon = status.icon;
  const date = new Date(claim.createdAt ?? claim.timestamp);

  return (
    <div className="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-secondary/30">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-foreground">{claim.triggerName}</p>
              <Badge variant="outline" className="text-xs">{claim.id}</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{claim.zoneAffected} - {claim.disruptionHours} hours disruption</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {formatDateTime(date)}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
          <p className="text-xl font-semibold text-foreground">₹{claim.payoutAmount}</p>
          <Badge variant={status.variant} className="gap-1">
            <StatusIcon className="h-3 w-3" />
            {status.label}
          </Badge>
        </div>
      </div>
    </div>
  );
}
