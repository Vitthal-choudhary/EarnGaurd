"use client";

import {
  Phone,
  FileText,
  HelpCircle,
  MessageSquare,
  Wallet,
  History,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const actions = [
  {
    icon: FileText,
    label: "View Policy",
    description: "Check coverage details",
  },
  {
    icon: History,
    label: "Claim History",
    description: "Past payouts",
  },
  {
    icon: Wallet,
    label: "Add UPI",
    description: "Update payment",
  },
  {
    icon: HelpCircle,
    label: "FAQ",
    description: "Common questions",
  },
  {
    icon: MessageSquare,
    label: "Chat Support",
    description: "Get help now",
  },
  {
    icon: Phone,
    label: "Call Us",
    description: "1800-XXX-XXXX",
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-medium text-foreground">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto flex-col gap-2 p-4"
            >
              <action.icon className="h-5 w-5 text-primary" />
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">{action.label}</p>
                <p className="text-xs text-muted-foreground">
                  {action.description}
                </p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
