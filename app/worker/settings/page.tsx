"use client";

import { useState } from "react";
import { WorkerHeader } from "@/components/worker/worker-header";
import { WorkerSidebar } from "@/components/worker/worker-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { User, Phone, MapPin, CreditCard, Bell, Shield, Clock, CheckCircle } from "lucide-react";
import { currentWorker } from "@/lib/mock-data";

export default function WorkerSettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [autoRenew, setAutoRenew] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <WorkerHeader onMenuClick={() => setSidebarOpen(true)} />
      <WorkerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="md:pl-64">
        <div className="container max-w-4xl px-4 py-6 md:px-6 lg:py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">Settings</h1>
            <p className="mt-1 text-muted-foreground">Manage your account and preferences</p>
          </div>

          <div className="space-y-6">
            {/* Profile Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-foreground">
                  <User className="h-4 w-4" />
                  Profile Information
                </CardTitle>
                <CardDescription>Your registered details from the platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-foreground">Full Name</label>
                    <Input defaultValue={currentWorker.name} readOnly className="mt-1.5" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Phone</label>
                    <div className="relative mt-1.5">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input defaultValue={currentWorker.phone} readOnly className="pl-10" />
                    </div>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-foreground">Zone</label>
                    <div className="relative mt-1.5">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input defaultValue={`${currentWorker.zone} (${currentWorker.pincode})`} readOnly className="pl-10" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Platform</label>
                    <Input defaultValue={currentWorker.platform} readOnly className="mt-1.5" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Profile details are synced from your platform account. Contact support to update.
                </p>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-foreground">
                  <CreditCard className="h-4 w-4" />
                  Payment Method
                </CardTitle>
                <CardDescription>How you receive payouts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <span className="text-sm font-bold text-primary">UPI</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">UPI - Platform Linked</p>
                      <p className="text-sm text-muted-foreground">Payouts go to your platform UPI</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-primary border-primary/50">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Verified
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Policy Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-foreground">
                  <Shield className="h-4 w-4" />
                  Policy Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <p className="font-medium text-foreground">Auto-Renew Policy</p>
                    <p className="text-sm text-muted-foreground">Automatically renew your coverage every week</p>
                  </div>
                  <Switch checked={autoRenew} onCheckedChange={setAutoRenew} />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="flex items-center gap-4">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">Working Hours</p>
                      <p className="text-sm text-muted-foreground">
                        {currentWorker.workingHours.start}:00 - {currentWorker.workingHours.end}:00
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-foreground">
                  <Bell className="h-4 w-4" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Policy reminders", desc: "Renewal and premium deduction alerts", defaultOn: true },
                  { label: "Payout notifications", desc: "When money is credited to your account", defaultOn: true },
                  { label: "Promotional updates", desc: "New features and offers", defaultOn: false },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="font-medium text-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch defaultChecked={item.defaultOn} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
