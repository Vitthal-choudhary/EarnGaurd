"use client";

import { Shield, Menu, Bell, User, LogOut, ChevronDown, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { adminStats } from "@/lib/admin-mock-data";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
              <Shield className="h-5 w-5 text-accent-foreground" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-semibold tracking-tight text-foreground">
                EarnGuard
              </span>
              <span className="ml-2 rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                Admin
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Pending Claims Alert */}
          {adminStats.pendingClaims > 0 && (
            <Link href="/admin/claims">
              <Badge variant="secondary" className="gap-1.5 bg-warning/10 text-warning hover:bg-warning/20">
                {adminStats.pendingClaims} pending
              </Badge>
            </Link>
          )}

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {adminStats.fraudAlertsToday > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                    {adminStats.fraudAlertsToday}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-3">
                <h4 className="font-medium text-foreground">System Alerts</h4>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="p-3">
                <div>
                  <p className="text-sm font-medium text-destructive">Fraud Alert</p>
                  <p className="text-xs text-muted-foreground">High fraud score detected on CLM-101</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-3">
                <div>
                  <p className="text-sm font-medium text-warning">Trigger Spike</p>
                  <p className="text-xs text-muted-foreground">Rainfall triggers up 45% in Kurla zone</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Admin Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-accent/10 text-accent">
                    AD
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-medium text-foreground md:inline">
                  Admin
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <Link href="/">
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Exit Admin
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
