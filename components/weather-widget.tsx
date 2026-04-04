"use client";

import { useState, useEffect } from "react";
import {
  Cloud,
  Droplets,
  Wind,
  Thermometer,
  CloudRain,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { workerApi, type Worker, type WeatherAlert, type ZoneWeather } from "@/lib/api";

export function WeatherWidget() {
  const [worker, setWorker] = useState<Worker | null>(null);
  const [weather, setWeather] = useState<ZoneWeather | null>(null);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);

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
      <Card>
        <CardContent className="p-6">
          <div className="h-48 animate-pulse rounded bg-secondary" />
        </CardContent>
      </Card>
    );
  }

  const activeAlert = alerts.find(
    (a) => a.isActive && a.pincode === worker.pincode
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium text-foreground">
            Zone Weather
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {worker.zone}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Alert Banner */}
        {activeAlert && (
          <div className="mb-4 flex items-center gap-3 rounded-lg bg-warning/20 p-3">
            <AlertTriangle className="h-5 w-5 text-warning-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                {activeAlert.type === "rainfall"
                  ? "Heavy Rainfall Alert"
                  : "AQI Warning"}
              </p>
              <p className="text-xs text-muted-foreground">
                Coverage auto-activates if threshold crossed
              </p>
            </div>
            <Badge
              variant={activeAlert.severity === "red" ? "destructive" : "default"}
              className="uppercase"
            >
              {activeAlert.severity}
            </Badge>
          </div>
        )}

        {/* Current Conditions */}
        <div className="mb-4 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-secondary">
            {weather.rainfall > 10 ? (
              <CloudRain className="h-8 w-8 text-info" />
            ) : (
              <Cloud className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <div>
            <p className="text-3xl font-semibold text-foreground">
              {weather.temperature}°C
            </p>
            <p className="text-sm text-muted-foreground">
              {weather.condition}
            </p>
          </div>
        </div>

        {/* Weather Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            icon={Droplets}
            label="Humidity"
            value={`${weather.humidity}%`}
            status={weather.humidity > 80 ? "warning" : "normal"}
          />
          <MetricCard
            icon={CloudRain}
            label="Rainfall"
            value={`${weather.rainfall}mm`}
            status={weather.rainfall > 30 ? "alert" : "normal"}
          />
          <MetricCard
            icon={Wind}
            label="Wind"
            value={`${weather.windSpeed}km/h`}
            status="normal"
          />
          <MetricCard
            icon={Thermometer}
            label="AQI"
            value={weather.aqi.toString()}
            status={weather.aqi > 200 ? "warning" : "normal"}
          />
        </div>

        {/* Trigger Thresholds */}
        <div className="mt-4 rounded-lg border border-border p-3">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Active Trigger Thresholds
          </p>
          <div className="space-y-2">
            <ThresholdRow
              label="Rainfall"
              current={weather.rainfall}
              threshold={40}
              unit="mm/3hr"
            />
            <ThresholdRow
              label="AQI"
              current={weather.aqi}
              threshold={400}
              unit=""
            />
            <ThresholdRow
              label="Temperature"
              current={weather.temperature}
              threshold={42}
              unit="°C"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  status,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  status: "normal" | "warning" | "alert";
}) {
  return (
    <div
      className={`rounded-lg p-3 ${
        status === "alert"
          ? "bg-destructive/10"
          : status === "warning"
          ? "bg-warning/10"
          : "bg-secondary/50"
      }`}
    >
      <div className="flex items-center gap-2">
        <Icon
          className={`h-4 w-4 ${
            status === "alert"
              ? "text-destructive"
              : status === "warning"
              ? "text-warning-foreground"
              : "text-muted-foreground"
          }`}
        />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p
        className={`mt-1 text-lg font-semibold ${
          status === "alert"
            ? "text-destructive"
            : status === "warning"
            ? "text-warning-foreground"
            : "text-foreground"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function ThresholdRow({
  label,
  current,
  threshold,
  unit,
}: {
  label: string;
  current: number;
  threshold: number;
  unit: string;
}) {
  const percentage = Math.min((current / threshold) * 100, 100);
  const isNear = percentage > 70;
  const isExceeded = current >= threshold;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span
          className={`font-medium ${
            isExceeded
              ? "text-destructive"
              : isNear
              ? "text-warning-foreground"
              : "text-foreground"
          }`}
        >
          {current}
          {unit} / {threshold}
          {unit}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
        <div
          className={`h-full rounded-full transition-all ${
            isExceeded
              ? "bg-destructive"
              : isNear
              ? "bg-warning"
              : "bg-primary"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
