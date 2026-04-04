"use client";

import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, CheckCircle, XCircle, Clock, AlertTriangle, IndianRupee, TrendingUp, FileCheck } from "lucide-react";
import { adminApi, type AdminClaim, type AdminStats } from "@/lib/api";

const statusConfig: Record<string, { label: string; icon: React.ElementType; className: string }> = {
  pending: { label: "Pending", icon: Clock, className: "bg-warning/10 text-warning border-warning/30" },
  under_review: { label: "Under Review", icon: Clock, className: "bg-warning/10 text-warning border-warning/30" },
  auto_approved: { label: "Auto-Approved", icon: CheckCircle, className: "bg-primary/10 text-primary border-primary/30" },
  approved: { label: "Approved", icon: CheckCircle, className: "bg-primary/10 text-primary border-primary/30" },
  paid: { label: "Paid", icon: CheckCircle, className: "bg-primary/10 text-primary border-primary/30" },
  rejected: { label: "Rejected", icon: XCircle, className: "bg-destructive/10 text-destructive border-destructive/30" },
};

export default function AdminClaimsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [claims, setClaims] = useState<AdminClaim[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    Promise.all([adminApi.getClaims(), adminApi.getStats()])
      .then(([c, s]) => {
        setClaims(c);
        setStats(s);
      })
      .catch(console.error);
  }, []);

  const handleClaimAction = async (id: string, newStatus: AdminClaim["status"]) => {
    try {
      const updated = await adminApi.updateClaim(id, newStatus);
      setClaims((prev) => prev.map((c) => (c.id === id ? updated : c)));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredClaims = claims.filter((claim) =>
    statusFilter === "all" || claim.status === statusFilter
  );

  const pendingClaims = claims.filter(c => c.status === "pending" || c.status === "under_review");
  const todayPaidAmount = claims.filter(c => c.status === "paid").reduce((sum, c) => sum + Number(c.payoutAmount ?? 0), 0);

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="md:pl-64">
        <div className="container max-w-7xl px-4 py-6 md:px-6 lg:py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">Claims Management</h1>
            <p className="mt-1 text-muted-foreground">Review and manage worker claims</p>
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-4">
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">{pendingClaims.length}</p>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">{stats?.claimApprovalRate ?? "—"}%</p>
                  <p className="text-sm text-muted-foreground">Approval Rate</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <FileCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">{stats?.avgClaimTime ?? "—"}</p>
                  <p className="text-sm text-muted-foreground">Avg Processing</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <IndianRupee className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">₹{todayPaidAmount}</p>
                  <p className="text-sm text-muted-foreground">Paid Today</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter */}
          <div className="mb-6 flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Claims</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Claims List */}
          <div className="space-y-4">
            {filteredClaims.map((claim) => {
              const status = statusConfig[claim.status] ?? statusConfig["under_review"];
              const StatusIcon = status.icon;

              return (
                <Card key={claim.id} className={claim.flagged ? "border-destructive/50" : ""}>
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${claim.flagged ? "bg-destructive/10" : "bg-secondary"}`}>
                          {claim.flagged ? (
                            <AlertTriangle className="h-6 w-6 text-destructive" />
                          ) : (
                            <StatusIcon className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">{claim.workerName}</p>
                            <Badge variant="outline" className="text-xs">{claim.id}</Badge>
                            {claim.flagged && <Badge variant="destructive">Flagged</Badge>}
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {claim.triggerName ?? claim.triggerType} - {claim.zoneAffected ?? claim.zone}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(claim.createdAt ?? claim.timestamp).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        {/* Fraud Score */}
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Fraud Score</p>
                          <div className="mt-1 flex items-center gap-2">
                            <div className="h-2 w-20 overflow-hidden rounded-full bg-secondary">
                              <div
                                className={`h-full ${claim.fraudScore < 0.3 ? "bg-primary" : claim.fraudScore < 0.6 ? "bg-warning" : "bg-destructive"}`}
                                style={{ width: `${claim.fraudScore * 100}%` }}
                              />
                            </div>
                            <span className={`text-sm font-medium ${claim.fraudScore >= 0.6 ? "text-destructive" : "text-foreground"}`}>
                              {Math.round(claim.fraudScore * 100)}%
                            </span>
                          </div>
                        </div>

                        {/* Amount */}
                        <div className="text-right">
                          <p className="text-xl font-semibold text-foreground">₹{claim.payoutAmount ?? claim.amount}</p>
                          <Badge className={status.className}>{status.label}</Badge>
                        </div>

                        {/* Actions */}
                        {(claim.status === "pending" || claim.status === "under_review") && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive border-destructive/50 hover:bg-destructive/10"
                              onClick={() => handleClaimAction(claim.id, "rejected")}
                            >
                              <XCircle className="mr-1 h-4 w-4" />
                              Reject
                            </Button>
                            <Button size="sm" onClick={() => handleClaimAction(claim.id, "approved")}>
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Approve
                            </Button>
                          </div>
                        )}
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
