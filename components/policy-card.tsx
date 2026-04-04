"use client";

import { useState, useEffect } from "react";
import { Shield, Calendar, CheckCircle, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { workerApi, type Policy, type PremiumPlan } from "@/lib/api";
import { formatDateShort } from "@/lib/date-utils";

export function PolicyCard() {
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [plans, setPlans] = useState<PremiumPlan[]>([]);

  useEffect(() => {
    Promise.all([workerApi.getPolicy(), workerApi.getPlans()])
      .then(([p, pl]) => {
        setPolicy(p);
        setPlans(pl);
      })
      .catch(console.error);
  }, []);

  if (!policy) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="h-48 animate-pulse rounded bg-secondary" />
        </CardContent>
      </Card>
    );
  }

  const plan = plans.find((p) => p.id === policy.plan);
  const endDate = new Date(policy.endDate);
  const today = new Date();
  const daysRemaining = Math.ceil(
    (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  const progressPercent = ((7 - daysRemaining) / 7) * 100;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary/5 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg text-foreground">{plan?.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Policy #{policy.id}
              </p>
            </div>
          </div>
          <Badge
            variant={policy.status === "active" ? "default" : "secondary"}
            className="bg-primary/90 text-primary-foreground"
          >
            <CheckCircle className="mr-1 h-3 w-3" />
            Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid gap-6">
          {/* Premium and Coverage */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-secondary/50 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Weekly Premium
              </p>
              <p className="mt-1 text-2xl font-semibold text-foreground">
                ₹{policy.weeklyPremium}
              </p>
              {plan && policy.weeklyPremium < plan.weeklyPremium && (
                <p className="mt-1 text-xs text-primary">
                  10% loyalty discount applied
                </p>
              )}
            </div>
            <div className="rounded-lg bg-secondary/50 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Coverage Cap
              </p>
              <p className="mt-1 text-2xl font-semibold text-foreground">
                ₹{policy.coverageCap}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">per event</p>
            </div>
          </div>

          {/* Coverage Period */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Coverage Period</span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {daysRemaining} days remaining
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>{formatDateShort(new Date(policy.startDate))}</span>
              <span>{formatDateShort(new Date(policy.endDate))}</span>
            </div>
          </div>

          {/* What's Covered */}
          <div className="rounded-lg border border-border bg-secondary/30 p-4">
            <p className="mb-3 text-sm font-medium text-foreground">What's Covered</p>
            <div className="grid gap-2">
              {[
                "Weather disruptions (rain, cyclone, heat)",
                "Platform outages",
                "Civil disruptions & bandh",
                "Natural disaster alerts",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1">
              Manage Policy
            </Button>
            <Button className="flex-1 gap-2">
              Upgrade Plan
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
