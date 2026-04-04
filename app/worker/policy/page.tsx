"use client";

import { useState, useEffect } from "react";
import { WorkerHeader } from "@/components/worker/worker-header";
import { WorkerSidebar } from "@/components/worker/worker-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, CheckCircle, ArrowRight, Calendar, Clock, Star } from "lucide-react";
import { workerApi, type Policy, type PremiumPlan, type Worker } from "@/lib/api";
import { formatDateLong } from "@/lib/date-utils";

export default function WorkerPolicyPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [plans, setPlans] = useState<PremiumPlan[]>([]);
  const [worker, setWorker] = useState<Worker | null>(null);

  useEffect(() => {
    Promise.all([workerApi.getPolicy(), workerApi.getPlans(), workerApi.getProfile()])
      .then(([p, pl, w]) => {
        setPolicy(p);
        setPlans(pl);
        setWorker(w);
      })
      .catch(console.error);
  }, []);

  if (!policy) {
    return (
      <div className="min-h-screen bg-background">
        <WorkerHeader onMenuClick={() => setSidebarOpen(true)} />
        <WorkerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="md:pl-64">
          <div className="container max-w-5xl px-4 py-6">
            <div className="h-64 animate-pulse rounded-lg bg-secondary" />
          </div>
        </main>
      </div>
    );
  }

  const currentPlan = plans.find((p) => Number(p.weeklyPremium) === Number(policy.weeklyPremium));

  return (
    <div className="min-h-screen bg-background">
      <WorkerHeader onMenuClick={() => setSidebarOpen(true)} />
      <WorkerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="md:pl-64">
        <div className="container max-w-5xl px-4 py-6 md:px-6 lg:py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">My Policy</h1>
            <p className="mt-1 text-muted-foreground">Manage your income protection coverage</p>
          </div>

          <Card className="mb-8 overflow-hidden">
            <CardHeader className="bg-primary/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                    <Shield className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-foreground">{currentPlan?.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">Policy #{policy.id}</p>
                  </div>
                </div>
                <Badge className="bg-primary text-primary-foreground">
                  <CheckCircle className="mr-1.5 h-3 w-3" />
                  Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-6 md:grid-cols-4">
                <div className="rounded-lg bg-secondary/50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Weekly Premium</p>
                  <p className="mt-1 text-2xl font-semibold text-foreground">₹{policy.weeklyPremium}</p>
                  <p className="mt-1 text-xs text-primary">10% discount</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Coverage Cap</p>
                  <p className="mt-1 text-2xl font-semibold text-foreground">₹{policy.coverageCap}</p>
                  <p className="mt-1 text-xs text-muted-foreground">per event</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Risk Tier</p>
                  <p className="mt-1 text-2xl font-semibold capitalize text-foreground">{policy.riskTier}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Based on zone</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Trust Score</p>
                  <p className="mt-1 text-2xl font-semibold text-foreground">{worker?.trustScore ?? "—"}/100</p>
                  <p className="mt-1 text-xs text-primary">Excellent</p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-4 rounded-lg border border-border p-4">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Coverage Period</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDateLong(new Date(policy.startDate))} – {formatDateLong(new Date(policy.endDate))}
                  </p>
                </div>
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">Auto-renews Sunday</span>
              </div>
            </CardContent>
          </Card>

          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Available Plans</h2>
            <Tabs defaultValue={currentPlan?.id ?? plans[0]?.id} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                {plans.map((plan) => (
                  <TabsTrigger key={plan.id} value={plan.id}>{plan.name}</TabsTrigger>
                ))}
              </TabsList>

              {plans.map((plan) => (
                <TabsContent key={plan.id} value={plan.id}>
                  <Card className={plan.id === currentPlan?.id ? "border-2 border-primary" : ""}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
                            {(plan.isRecommended ?? plan.recommended) && (
                              <Badge className="bg-primary text-primary-foreground">
                                <Star className="mr-1 h-3 w-3" />
                                Recommended
                              </Badge>
                            )}
                            {plan.id === currentPlan?.id && <Badge variant="outline">Current Plan</Badge>}
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">Coverage up to ₹{plan.coverageCap} per disruption event</p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-foreground">₹{plan.weeklyPremium}</p>
                          <p className="text-sm text-muted-foreground">per week</p>
                        </div>
                      </div>

                      <div className="mt-6 grid gap-3">
                        <p className="text-sm font-medium text-foreground">What's covered:</p>
                        {(plan.triggerCoverages ?? plan.triggers ?? []).map((trigger, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-primary" />
                            <span className="text-muted-foreground">{trigger}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 flex gap-3">
                        {plan.id === currentPlan?.id ? (
                          <Button variant="outline" className="flex-1" disabled>Current Plan</Button>
                        ) : (
                          <Button className="flex-1 gap-2">
                            {Number(plan.weeklyPremium) > Number(currentPlan?.weeklyPremium || 0) ? "Upgrade" : "Switch"} to {plan.name}
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
