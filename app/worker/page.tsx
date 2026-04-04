"use client";

import { useState, useEffect } from "react";
import { WorkerHeader } from "@/components/worker/worker-header";
import { WorkerSidebar } from "@/components/worker/worker-sidebar";
import { StatsCards } from "@/components/stats-cards";
import { PolicyCard } from "@/components/policy-card";
import { WeatherWidget } from "@/components/weather-widget";
import { ClaimsList } from "@/components/claims-list";
import { EarningsChart } from "@/components/earnings-chart";
import { LiveStatus } from "@/components/live-status";
import { QuickActions } from "@/components/quick-actions";
import { workerApi } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function WorkerDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [workerName, setWorkerName] = useState("there");
  const greeting = getGreeting();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/worker/login");
      return;
    }
    workerApi.getProfile().then((p) => setWorkerName(p.name?.split(" ")[0] ?? "there")).catch(console.error);
  }, [router]);

  return (
    <div className="min-h-screen bg-background">
      <WorkerHeader onMenuClick={() => setSidebarOpen(true)} />
      <WorkerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="md:pl-64">
        <div className="container max-w-7xl px-4 py-6 md:px-6 lg:py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              {greeting}, {workerName}
            </h1>
            <p className="mt-1 text-muted-foreground">
              Your income is protected. Here's your coverage overview.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="mb-8">
            <StatsCards />
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - 2 cols */}
            <div className="space-y-6 lg:col-span-2">
              {/* Policy and Weather Row */}
              <div className="grid gap-6 md:grid-cols-2">
                <PolicyCard />
                <WeatherWidget />
              </div>

              {/* Earnings Chart */}
              <EarningsChart />

              {/* Recent Claims */}
              <ClaimsList limit={3} />
            </div>

            {/* Right Column - 1 col */}
            <div className="space-y-6">
              <LiveStatus />
              <QuickActions />
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 border-t border-border pt-6">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-sm text-muted-foreground">
                EarnGuard — Because every delivery matters, even the ones that never happen.
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <a href="#" className="hover:text-foreground">Terms</a>
                <a href="#" className="hover:text-foreground">Privacy</a>
                <a href="#" className="hover:text-foreground">Support</a>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
