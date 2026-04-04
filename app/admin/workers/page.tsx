"use client";

import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Users, Shield, AlertTriangle, Download, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { adminApi, type WorkerOverview, type AdminStats } from "@/lib/api";

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-primary/10 text-primary border-primary/30" },
  pending: { label: "Pending", className: "bg-warning/10 text-warning border-warning/30" },
  suspended: { label: "Suspended", className: "bg-destructive/10 text-destructive border-destructive/30" },
};

export default function AdminWorkersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [workers, setWorkers] = useState<WorkerOverview[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    Promise.all([adminApi.getWorkers(), adminApi.getStats()])
      .then(([w, s]) => {
        setWorkers(w);
        setStats(s);
      })
      .catch(console.error);
  }, []);

  const filteredWorkers = workers.filter((worker) => {
    const matchesSearch = worker.name.toLowerCase().includes(search.toLowerCase()) ||
                         worker.zone.toLowerCase().includes(search.toLowerCase()) ||
                         worker.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || worker.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="md:pl-64">
        <div className="container max-w-7xl px-4 py-6 md:px-6 lg:py-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">Workers</h1>
              <p className="mt-1 text-muted-foreground">Manage registered delivery partners</p>
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">{stats?.totalWorkers.toLocaleString() ?? "—"}</p>
                  <p className="text-sm text-muted-foreground">Total Workers</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">{stats?.activePolicies?.toLocaleString() ?? "—"}</p>
                  <p className="text-sm text-muted-foreground">Active Policies</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">12</p>
                  <p className="text-sm text-muted-foreground">Suspended</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, ID, or zone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Workers Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-foreground">All Workers ({filteredWorkers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left text-sm text-muted-foreground">
                      <th className="pb-3 font-medium">Worker</th>
                      <th className="pb-3 font-medium">Zone</th>
                      <th className="pb-3 font-medium">Platform</th>
                      <th className="pb-3 font-medium">Plan</th>
                      <th className="pb-3 font-medium">Trust Score</th>
                      <th className="pb-3 font-medium">Claims</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWorkers.map((worker) => {
                      const status = statusConfig[worker.status] ?? statusConfig["active"];
                      return (
                        <tr key={worker.id} className="border-b border-border last:border-0">
                          <td className="py-4">
                            <div>
                              <p className="font-medium text-foreground">{worker.name}</p>
                              <p className="text-sm text-muted-foreground">{worker.id}</p>
                            </div>
                          </td>
                          <td className="py-4 text-sm text-foreground">{worker.zone}</td>
                          <td className="py-4 text-sm text-foreground">{worker.platform}</td>
                          <td className="py-4">
                            <Badge variant="outline">{worker.plan}</Badge>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-16 overflow-hidden rounded-full bg-secondary">
                                <div
                                  className={`h-full ${worker.trustScore >= 70 ? "bg-primary" : worker.trustScore >= 50 ? "bg-warning" : "bg-destructive"}`}
                                  style={{ width: `${worker.trustScore}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-foreground">{worker.trustScore}</span>
                            </div>
                          </td>
                          <td className="py-4 text-sm text-foreground">{worker.claimsThisMonth}</td>
                          <td className="py-4">
                            <Badge className={status.className}>{status.label}</Badge>
                          </td>
                          <td className="py-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>View Claims</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">Suspend Worker</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
