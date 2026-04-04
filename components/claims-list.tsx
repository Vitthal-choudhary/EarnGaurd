"use client";

import { useState, useEffect } from "react";
import {
  CloudRain,
  WifiOff,
  CloudFog,
  CheckCircle,
  Clock,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { workerApi, type Claim } from "@/lib/api";
import { formatDateShort, formatTime } from "@/lib/date-utils";

const triggerIcons: Record<string, React.ElementType> = {
  "T-01": CloudRain,
  "T-04": CloudFog,
  "T-05": WifiOff,
};

const statusConfig = {
  auto_approved: {
    label: "Auto-Approved",
    icon: CheckCircle,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  paid: {
    label: "Paid",
    icon: CheckCircle,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  under_review: {
    label: "Under Review",
    icon: Clock,
    color: "text-warning-foreground",
    bg: "bg-warning/10",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
};

interface ClaimsListProps {
  limit?: number;
  showHeader?: boolean;
}

export function ClaimsList({ limit, showHeader = true }: ClaimsListProps) {
  const [claims, setClaims] = useState<Claim[]>([]);

  useEffect(() => {
    workerApi.getClaims().then(({ claims }) => {
      setClaims(limit ? claims.slice(0, limit) : claims);
    }).catch(console.error);
  }, [limit]);

  return (
    <Card>
      {showHeader && (
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-base font-medium text-foreground">
            Recent Claims
          </CardTitle>
          <Button variant="ghost" size="sm" className="gap-1 text-sm">
            View All
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardHeader>
      )}
      <CardContent className={showHeader ? "" : "pt-6"}>
        <div className="space-y-4">
          {claims.map((claim) => (
            <ClaimRow key={claim.id} claim={claim} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ClaimRow({ claim }: { claim: Claim }) {
  const Icon = triggerIcons[claim.triggerId] || CloudRain;
  const status = statusConfig[claim.status];
  const StatusIcon = status.icon;

  const date = new Date(claim.createdAt ?? claim.timestamp);
  const formattedDate = formatDateShort(date);
  const formattedTime = formatTime(date);

  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-secondary/30">
      {/* Trigger Icon */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary">
        <Icon className="h-6 w-6 text-primary" />
      </div>

      {/* Claim Details */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="font-medium text-foreground">{claim.triggerName}</p>
          <Badge variant="outline" className="text-xs">
            {claim.disruptionHours}hr
          </Badge>
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {claim.zoneAffected} • {formattedDate} at {formattedTime}
        </p>
      </div>

      {/* Amount and Status */}
      <div className="text-right">
        <p className="text-lg font-semibold text-foreground">
          ₹{claim.payoutAmount}
        </p>
        <div className={`mt-1 flex items-center justify-end gap-1 ${status.color}`}>
          <StatusIcon className="h-3 w-3" />
          <span className="text-xs font-medium">{status.label}</span>
        </div>
      </div>
    </div>
  );
}
