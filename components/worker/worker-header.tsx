"use client";

import { Shield, Menu, Bell, User, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { currentWorker, currentAlerts } from "@/lib/mock-data";
import Link from "next/link";

interface WorkerHeaderProps {
  onMenuClick: () => void;
}

export function WorkerHeader({ onMenuClick }: WorkerHeaderProps) {
  const activeAlerts = currentAlerts.filter((a) => a.isActive).length;

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
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-semibold tracking-tight text-foreground">
                EarnGuard
              </span>
              <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                Worker
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {activeAlerts > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-warning text-[10px] font-medium text-warning-foreground">
                    {activeAlerts}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-3">
                <h4 className="font-medium text-foreground">Notifications</h4>
              </div>
              <DropdownMenuSeparator />
              {currentAlerts.map((alert) => (
                <DropdownMenuItem key={alert.id} className="p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} Alert
                    </p>
                    <p className="text-xs text-muted-foreground">{alert.message}</p>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {currentWorker.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-medium text-foreground md:inline">
                  {currentWorker.name}
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <Link href="/">
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Exit Portal
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
