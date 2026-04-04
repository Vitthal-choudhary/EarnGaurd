"use client";

import { useState } from "react";
import { WorkerHeader } from "@/components/worker/worker-header";
import { WorkerSidebar } from "@/components/worker/worker-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, HelpCircle, Shield, IndianRupee, AlertTriangle, Phone } from "lucide-react";

const faqCategories = [
  {
    title: "Getting Started",
    icon: HelpCircle,
    questions: [
      { q: "How do I activate my EarnGuard coverage?", a: "Your coverage activates automatically when your weekly premium is deducted from your platform earnings. No manual activation needed." },
      { q: "Which platforms are supported?", a: "EarnGuard works with Zepto, Blinkit, and Swiggy Instamart. We're adding more platforms soon." },
      { q: "How is my zone determined?", a: "Your zone is based on your registered PIN code with the platform. Coverage applies when you're working in this zone." },
    ],
  },
  {
    title: "Coverage & Triggers",
    icon: Shield,
    questions: [
      { q: "What events trigger automatic payouts?", a: "Payouts trigger for: Heavy rainfall (>40mm/3hr), Cyclone alerts, Extreme heat (>42°C), AQI >400, Platform outages, Civil disruptions, and NDMA advisories." },
      { q: "How are disruption hours calculated?", a: "We track the duration of the disruption event within your registered working hours. If heavy rain lasts 3 hours during your shift, you get coverage for those 3 hours." },
      { q: "What's the maximum I can receive per event?", a: "This depends on your plan: Basic (₹500), Standard (₹800), Pro (₹1200). Your payout is capped at these amounts per event." },
    ],
  },
  {
    title: "Payouts",
    icon: IndianRupee,
    questions: [
      { q: "How fast do I receive payouts?", a: "Most payouts hit your UPI within 60 seconds of claim approval. Complex cases may take up to 4 hours." },
      { q: "How is my payout calculated?", a: "Payout = (Your Avg Hourly Earnings × Disruption Hours × 0.75), capped at your plan's maximum per event." },
      { q: "Do I need to file a claim?", a: "No! EarnGuard uses parametric triggers. When conditions exceed thresholds in your zone, payouts happen automatically." },
    ],
  },
  {
    title: "Alerts & Monitoring",
    icon: AlertTriangle,
    questions: [
      { q: "How do I receive weather alerts?", a: "Enable SMS, Push, or WhatsApp notifications in your Alert settings. You'll get warnings before triggers activate." },
      { q: "Can I see forecasts for my zone?", a: "Yes! The Live Alerts page shows current conditions and predictions. Yellow warnings indicate potential trigger conditions." },
    ],
  },
];

export default function WorkerHelpPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = faqCategories.map((category) => ({
    ...category,
    questions: category.questions.filter(
      (q) =>
        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <WorkerHeader onMenuClick={() => setSidebarOpen(true)} />
      <WorkerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="md:pl-64">
        <div className="container max-w-4xl px-4 py-6 md:px-6 lg:py-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">Help & FAQ</h1>
            <p className="mt-1 text-muted-foreground">Find answers to common questions</p>
          </div>

          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-6">
            {filteredCategories.map((category, idx) => {
              const Icon = category.icon;
              return (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base text-foreground">
                      <Icon className="h-5 w-5 text-primary" />
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {category.questions.map((item, qIdx) => (
                        <AccordionItem key={qIdx} value={`item-${idx}-${qIdx}`}>
                          <AccordionTrigger className="text-left text-foreground">{item.q}</AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="mt-8">
            <CardContent className="flex flex-col items-center gap-4 p-8 text-center sm:flex-row sm:text-left">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Phone className="h-7 w-7 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Need more help?</p>
                <p className="text-sm text-muted-foreground">Contact our support team available 8 AM - 10 PM daily</p>
              </div>
              <p className="text-lg font-semibold text-primary">1800-XXX-XXXX</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
