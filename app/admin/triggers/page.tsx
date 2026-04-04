"use client";

import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { CloudRain, Wind, Thermometer, CloudFog, WifiOff, AlertTriangle, ShieldAlert, Settings, Zap, TrendingUp } from "lucide-react";
import { adminApi, type Trigger, type TriggerActivity } from "@/lib/api";

const triggerIconMap: Record<string, React.ElementType> = {
  "cloud-rain": CloudRain,
  wind: Wind,
  thermometer: Thermometer,
  "cloud-fog": CloudFog,
  "wifi-off": WifiOff,
  "alert-triangle": AlertTriangle,
  "shield-alert": ShieldAlert,
};

export default function AdminTriggersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [activity, setActivity] = useState<TriggerActivity[]>([]);
  const [triggerStates, setTriggerStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    adminApi.getTriggers().then((data: any) => {
      // Backend returns plain DisruptionTrigger[] array
      const triggerList: Trigger[] = Array.isArray(data) ? data : (data?.triggers ?? []);
      const activityList: TriggerActivity[] = Array.isArray(data) ? [] : (data?.activity ?? []);
      setTriggers(triggerList);
      setActivity(activityList);
      setTriggerStates(triggerList.reduce((acc, t) => ({ ...acc, [t.id]: true }), {}));
    }).catch(console.error);
  }, []);

  const totalTriggers = activity.reduce((sum, t) => sum + t.count, 0);

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="md:pl-64">
        <div className="container max-w-6xl px-4 py-6 md:px-6 lg:py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">Trigger Configuration</h1>
            <p className="mt-1 text-muted-foreground">Manage parametric trigger thresholds and settings</p>
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">{triggers.length}</p>
                  <p className="text-sm text-muted-foreground">Active Triggers</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">{totalTriggers}</p>
                  <p className="text-sm text-muted-foreground">Activations This Week</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <CloudRain className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">Heavy Rainfall</p>
                  <p className="text-sm text-muted-foreground">Top Trigger (45%)</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trigger Cards */}
          <div className="space-y-4">
            {triggers.map((trigger) => {
              const Icon = triggerIconMap[trigger.icon] || ShieldAlert;
              const triggerActivityItem = activity.find(t => t.trigger === trigger.name);
              const isEnabled = triggerStates[trigger.id] ?? true;

              return (
                <Card key={trigger.id} className={!isEnabled ? "opacity-60" : ""}>
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">{trigger.name}</p>
                            <Badge variant="outline">{trigger.id}</Badge>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{trigger.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        {/* Threshold */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Threshold:</span>
                          <Input
                            defaultValue={trigger.threshold}
                            className="w-32 text-center"
                            readOnly={!isEnabled}
                          />
                        </div>

                        {/* Activity */}
                        {triggerActivityItem && (
                          <div className="text-center">
                            <p className="text-lg font-semibold text-foreground">{triggerActivityItem.count}</p>
                            <p className="text-xs text-muted-foreground">This week</p>
                          </div>
                        )}

                        {/* Toggle */}
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={isEnabled}
                            onCheckedChange={(checked) => setTriggerStates(prev => ({ ...prev, [trigger.id]: checked }))}
                          />
                          <span className="text-sm text-muted-foreground">{isEnabled ? "Enabled" : "Disabled"}</span>
                        </div>

                        <Button variant="outline" size="icon">
                          <Settings className="h-4 w-4" />
                        </Button>
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
