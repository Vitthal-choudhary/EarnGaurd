"use client";

import { useState, useEffect } from "react";
import { WorkerHeader } from "@/components/worker/worker-header";
import { WorkerSidebar } from "@/components/worker/worker-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CloudRain, Wind, Thermometer, CloudFog, WifiOff, AlertTriangle, ShieldAlert, CheckCircle, Info, ArrowRight } from "lucide-react";
import { workerApi, type Trigger, type Policy, type PremiumPlan } from "@/lib/api";

const triggerIconMap: Record<string, React.ElementType> = {
  "cloud-rain": CloudRain,
  wind: Wind,
  thermometer: Thermometer,
  "cloud-fog": CloudFog,
  "wifi-off": WifiOff,
  "alert-triangle": AlertTriangle,
  "shield-alert": ShieldAlert,
};

export default function WorkerTriggersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [plans, setPlans] = useState<PremiumPlan[]>([]);

  useEffect(() => {
    Promise.all([workerApi.getTriggers(), workerApi.getPlans(), workerApi.getPolicy()])
      .then(([rawTriggers, pl, pol]) => {
        setTriggers(Array.isArray(rawTriggers) ? rawTriggers : []);
        setPlans(pl);
        setPolicy(pol);
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
  const coveredTriggers = currentPlan?.triggerCoverages ?? [];

  return (
    <div className="min-h-screen bg-background">
      <WorkerHeader onMenuClick={() => setSidebarOpen(true)} />
      <WorkerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="md:pl-64">
        <div className="container max-w-5xl px-4 py-6 md:px-6 lg:py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">Coverage Triggers</h1>
            <p className="mt-1 text-muted-foreground">Understand what events automatically activate your income protection</p>
          </div>

          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                  <ShieldAlert className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{currentPlan?.name}</p>
                  <p className="text-sm text-muted-foreground">{coveredTriggers.length} of {triggers.length} triggers covered</p>
                </div>
              </div>
              <Badge className="bg-primary/90 text-primary-foreground">
                <CheckCircle className="mr-1 h-3 w-3" />
                All triggers active
              </Badge>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-foreground">
                <Info className="h-4 w-4 text-primary" />
                How Parametric Triggers Work
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { step: "1", title: "Real-Time Monitoring", description: "We continuously monitor weather, platform status, and official alerts for your zone." },
                  { step: "2", title: "Threshold Crossed", description: "When conditions exceed the defined threshold during your shift window, coverage activates." },
                  { step: "3", title: "Auto-Payout", description: "No forms needed. Payout is calculated and sent to your UPI within 60 seconds." },
                ].map((item) => (
                  <div key={item.step} className="relative">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">{item.step}</div>
                      <div>
                        <p className="font-medium text-foreground">{item.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    {item.step !== "3" && <ArrowRight className="absolute -right-2 top-3 hidden h-4 w-4 text-muted-foreground md:block" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="mb-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">All Triggers</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {triggers.map((trigger) => {
                const Icon = triggerIconMap[trigger.icon] || ShieldAlert;
                const isCovered = coveredTriggers.includes(trigger.id);

                return (
                  <Card key={trigger.id} className={isCovered ? "border-primary/20" : "border-dashed opacity-60"}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${isCovered ? "bg-primary/10" : "bg-secondary"}`}>
                          <Icon className={`h-6 w-6 ${isCovered ? "text-primary" : "text-muted-foreground"}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-foreground">{trigger.name}</p>
                            {isCovered ? (
                              <Badge variant="outline" className="border-primary/50 text-primary">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Covered
                              </Badge>
                            ) : (
                              <Badge variant="secondary">Upgrade</Badge>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{trigger.description}</p>
                          <div className="mt-3 flex items-center gap-2 rounded-md bg-secondary/50 px-3 py-2">
                            <span className="text-xs font-medium text-muted-foreground">Threshold:</span>
                            <span className="text-xs font-semibold text-foreground">{trigger.threshold}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
