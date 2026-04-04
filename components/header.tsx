"use client";

import { Bell, Menu, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { currentWorker, currentAlerts } from "@/lib/mock-data";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const activeAlerts = currentAlerts.filter((a) => a.isActive);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-foreground">
              EarnGuard
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {activeAlerts.length > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                    {activeAlerts.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="px-3 py-2">
                <p className="text-sm font-medium text-foreground">Alerts</p>
              </div>
              <DropdownMenuSeparator />
              {activeAlerts.length > 0 ? (
                activeAlerts.map((alert) => (
                  <DropdownMenuItem
                    key={alert.id}
                    className="flex flex-col items-start gap-1 p-3"
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        {alert.type === "rainfall"
                          ? "Heavy Rainfall"
                          : alert.type === "aqi"
                          ? "AQI Warning"
                          : alert.type}
                      </span>
                      <Badge
                        variant={
                          alert.severity === "red"
                            ? "destructive"
                            : alert.severity === "orange"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {alert.message}
                    </p>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No active alerts
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <span className="hidden text-sm font-medium text-foreground md:inline-block">
                  {currentWorker.name}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-2">
                <p className="text-sm font-medium text-foreground">{currentWorker.name}</p>
                <p className="text-xs text-muted-foreground">
                  {currentWorker.platform} Partner
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Payment Methods</DropdownMenuItem>
              <DropdownMenuItem>Help & Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
