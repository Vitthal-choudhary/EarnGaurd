"use client";

import { useEffect, useState } from "react";
import { Activity, Users, Clock, IndianRupee, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { workerApi, type SystemStatus } from "@/lib/api";

export function LiveStatus() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [lastUpdateText, setLastUpdateText] = useState("just now");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);

  const fetchStatus = () => {
    workerApi.getStatus().then(setStatus).catch(console.error);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchStatus();
    setTimeout(() => {
      setLastUpdateText("just now");
      setIsRefreshing(false);
    }, 1000);
  };

  useEffect(() => {
    setMounted(true);
    fetchStatus();
    const interval = setInterval(() => {
      setLastUpdateText("just now");
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!status) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-40 animate-pulse rounded bg-secondary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-base font-medium text-foreground">
            Platform Status
          </CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Last updated: {mounted ? lastUpdateText : "..."}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* System Status */}
          <div className="flex items-center justify-between rounded-lg bg-primary/5 p-3">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">System Health</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              <span className="text-sm font-medium text-primary">
                {status.apiHealth === "operational"
                  ? "Operational"
                  : "Degraded"}
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <StatusMetric
              icon={Users}
              label="Active Workers"
              value={status.activeWorkers.toLocaleString("en-IN")}
            />
            <StatusMetric
              icon={Clock}
              label="Pending Claims"
              value={status.pendingClaims.toString()}
            />
            <StatusMetric
              icon={IndianRupee}
              label="Today's Payouts"
              value={`₹${(status.todayPayouts / 100000).toFixed(1)}L`}
            />
          </div>

          {/* Payout Speed */}
          <div className="rounded-lg border border-border p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Avg Payout Time
              </span>
              <span className="text-lg font-semibold text-primary">
                {"< 60 sec"}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              From trigger detection to UPI credit
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="mt-2 text-lg font-semibold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
