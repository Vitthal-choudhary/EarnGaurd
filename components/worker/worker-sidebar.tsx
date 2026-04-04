"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FileText,
  Clock,
  Shield,
  AlertTriangle,
  HelpCircle,
  Settings,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { title: "Dashboard", href: "/worker", icon: Home },
  { title: "My Policy", href: "/worker/policy", icon: FileText },
  { title: "Claims History", href: "/worker/claims", icon: Clock },
  { title: "Coverage Triggers", href: "/worker/triggers", icon: Shield },
  { title: "Live Alerts", href: "/worker/alerts", icon: AlertTriangle },
];

const bottomNavItems = [
  { title: "Help & FAQ", href: "/worker/help", icon: HelpCircle },
  { title: "Settings", href: "/worker/settings", icon: Settings },
];

interface WorkerSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function WorkerSidebar({ isOpen, onClose }: WorkerSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-16 z-50 flex h-[calc(100vh-4rem)] w-64 flex-col border-r border-border bg-card transition-transform duration-200 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 md:hidden">
          <span className="text-sm font-medium text-foreground">Menu</span>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="border-t border-border p-4">
          {bottomNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </div>
      </aside>
    </>
  );
}
