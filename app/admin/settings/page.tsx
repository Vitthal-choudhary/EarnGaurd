"use client";

import { useState } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Settings, Bell, Shield, Database, Users, AlertTriangle } from "lucide-react";

export default function AdminSettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="md:pl-64">
        <div className="container max-w-4xl px-4 py-6 md:px-6 lg:py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">Admin Settings</h1>
            <p className="mt-1 text-muted-foreground">Configure platform settings and preferences</p>
          </div>

          <div className="space-y-6">
            {/* System Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-foreground">
                  <Settings className="h-4 w-4" />
                  System Settings
                </CardTitle>
                <CardDescription>Core platform configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <p className="font-medium text-foreground">Auto-Approve Claims</p>
                    <p className="text-sm text-muted-foreground">Automatically approve claims with fraud score below threshold</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <p className="font-medium text-foreground">Fraud Score Threshold</p>
                    <p className="text-sm text-muted-foreground">Claims above this score are flagged for review</p>
                  </div>
                  <Input defaultValue="0.5" className="w-20 text-center" />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <p className="font-medium text-foreground">Maintenance Mode</p>
                    <p className="text-sm text-muted-foreground">Disable claims processing for system maintenance</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-foreground">
                  <Bell className="h-4 w-4" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Fraud Alerts", desc: "Get notified when high fraud score claims are detected", defaultOn: true },
                  { label: "System Health", desc: "Alerts for API health and data sync issues", defaultOn: true },
                  { label: "Daily Summary", desc: "Daily digest of platform metrics", defaultOn: false },
                  { label: "Trigger Spikes", desc: "Alert when trigger activations exceed threshold", defaultOn: true },
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

            {/* Data Integration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-foreground">
                  <Database className="h-4 w-4" />
                  Data Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "IMD Weather API", status: "connected", lastSync: "2 min ago" },
                  { name: "Zepto Order API", status: "connected", lastSync: "5 min ago" },
                  { name: "Blinkit Order API", status: "connected", lastSync: "3 min ago" },
                  { name: "Swiggy Order API", status: "connected", lastSync: "4 min ago" },
                ].map((api, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="font-medium text-foreground">{api.name}</p>
                      <p className="text-sm text-muted-foreground">Last sync: {api.lastSync}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      <span className="text-sm text-primary capitalize">{api.status}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-destructive/30 p-4">
                  <div>
                    <p className="font-medium text-foreground">Reset All Triggers</p>
                    <p className="text-sm text-muted-foreground">Reset all trigger configurations to default</p>
                  </div>
                  <Button variant="outline" className="text-destructive border-destructive/50">Reset</Button>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-destructive/30 p-4">
                  <div>
                    <p className="font-medium text-foreground">Clear Fraud Flags</p>
                    <p className="text-sm text-muted-foreground">Clear all fraud flags (requires confirmation)</p>
                  </div>
                  <Button variant="outline" className="text-destructive border-destructive/50">Clear All</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
