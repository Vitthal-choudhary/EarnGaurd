"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { workerApi, type EarningsDay } from "@/lib/api";

export function EarningsChart() {
  const [data, setData] = useState<EarningsDay[]>([]);

  useEffect(() => {
    workerApi.getEarnings().then(setData).catch(console.error);
  }, []);

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-medium text-foreground">
          This Week's Earnings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
                        <p className="text-sm font-medium text-foreground">{label}</p>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Earnings:{" "}
                            <span className="font-medium text-foreground">
                              ₹{payload[0]?.value}
                            </span>
                          </p>
                          {payload[1]?.value && Number(payload[1].value) > 0 && (
                            <p className="text-sm text-muted-foreground">
                              Protected:{" "}
                              <span className="font-medium text-primary">
                                +₹{payload[1].value}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                content={() => (
                  <div className="mt-4 flex items-center justify-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-sm bg-primary/80" />
                      <span className="text-xs text-muted-foreground">
                        Regular Earnings
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-sm bg-chart-2" />
                      <span className="text-xs text-muted-foreground">
                        Protected Payout
                      </span>
                    </div>
                  </div>
                )}
              />
              <Bar
                dataKey="earnings"
                fill="var(--primary)"
                radius={[4, 4, 0, 0]}
                opacity={0.8}
              />
              <Bar
                dataKey="protected"
                fill="var(--chart-2)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
