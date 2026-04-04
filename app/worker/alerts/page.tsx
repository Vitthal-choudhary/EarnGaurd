"use client";

import { useState, useEffect } from "react";
import { WorkerHeader } from "@/components/worker/worker-header";
import { WorkerSidebar } from "@/components/worker/worker-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { CloudRain, CloudFog, AlertCircle, Bell, MapPin, Clock, Thermometer, Wind, Droplets } from "lucide-react";
import { workerApi, type WeatherAlert, type Worker, type ZoneWeather } from "@/lib/api";
import { formatTimeShort } from "@/lib/date-utils";

const alertTypeConfig: Record<string, { icon: React.ElementType; color: string }> = {
  rainfall: { icon: CloudRain, color: "text-info" },
  aqi: { icon: CloudFog, color: "text-warning" },
  heat: { icon: Thermometer, color: "text-destructive" },
  flood: { icon: Droplets, color: "text-info" },
  cyclone: { icon: Wind, color: "text-destructive" },
};

const severityConfig = {
  yellow: { label: "Yellow", className: "bg-warning/10 text-warning border-warning/30" },
  orange: { label: "Orange", className: "bg-warning text-warning-foreground" },
  red: { label: "Red", className: "bg-destructive text-destructive-foreground" },
};

export default function WorkerAlertsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState({ sms: true, push: true, whatsapp: false });
  const [worker, setWorker] = useState<Worker | null>(null);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [weather, setWeather] = useState<ZoneWeather | null>(null);

  useEffect(() => {
    Promise.all([workerApi.getProfile(), workerApi.getAlerts()])
      .then(([profile, { alerts, weather }]) => {
        setWorker(profile);
        setAlerts(alerts);
        setWeather(weather);
      })
      .catch(console.error);
  }, []);

  if (!worker || !weather) {
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

  return (
    <div className="min-h-screen bg-background">
      <WorkerHeader onMenuClick={() => setSidebarOpen(true)} />
      <WorkerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="md:pl-64">
        <div className="container max-w-5xl px-4 py-6 md:px-6 lg:py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">Live Alerts</h1>
            <p className="mt-1 text-muted-foreground">Real-time weather and disruption monitoring for your zone</p>
          </div>

          {/* Your Zone Card */}
          <Card className="mb-8 bg-primary/5 border-primary/20">
            <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                  <MapPin className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{worker.zone}</p>
                  <p className="text-sm text-muted-foreground">PIN: {worker.pincode}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{weather.temperature}°C</span>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{weather.humidity}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <CloudFog className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">AQI {weather.aqi}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Alerts */}
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Active Alerts</h2>
            {alerts.filter(a => a.isActive).length > 0 ? (
              <div className="grid gap-4">
                {alerts.filter(a => a.isActive).map((alert) => {
                  const config = alertTypeConfig[alert.type] || { icon: AlertCircle, color: "text-foreground" };
                  const Icon = config.icon;
                  const severity = severityConfig[alert.severity as keyof typeof severityConfig] ?? { label: alert.severity ?? "Alert", className: "bg-secondary text-foreground" };

                  return (
                    <Card key={alert.id} className="border-l-4 border-l-warning">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary ${config.color}`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-foreground capitalize">{alert.type} Alert</p>
                                <Badge className={severity.className}>{severity.label}</Badge>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {formatTimeShort(new Date(alert.startTime))}
                              </div>
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground">{alert.message}</p>
                            <div className="mt-3 flex items-center gap-2">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{alert.zone} ({alert.pincode})</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <AlertCircle className="h-8 w-8 text-primary" />
                  </div>
                  <p className="mt-4 font-medium text-foreground">No Active Alerts</p>
                  <p className="mt-1 text-sm text-muted-foreground">Your zone is clear. You're good to go!</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-foreground">
                <Bell className="h-4 w-4" />
                Alert Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { key: "sms", label: "SMS Alerts", description: "Get alerts via SMS to your registered number" },
                  { key: "push", label: "Push Notifications", description: "Receive instant alerts on your device" },
                  { key: "whatsapp", label: "WhatsApp Alerts", description: "Get alerts on WhatsApp" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="font-medium text-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <Switch
                      checked={notifications[item.key as keyof typeof notifications]}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, [item.key]: checked }))}
                    />
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
