"use client";

import { Shield, Users, BarChart3, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-foreground">
              EarnGuard
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/worker/login">
              <Button variant="ghost" size="sm">
                Worker Login
              </Button>
            </Link>
            <Link href="/admin/login">
              <Button variant="outline" size="sm">
                Admin Portal
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Shield className="h-4 w-4" />
            AI-Powered Parametric Insurance
          </div>
          <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Income Protection for India's Gig Workers
          </h1>
          <p className="mb-8 text-pretty text-lg text-muted-foreground md:text-xl">
            Automatic payouts when disruptions hit. No claims to file. No waiting periods.
            Your income is protected — rain or shine.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/worker/login">
              <Button size="lg" className="gap-2">
                <Users className="h-5 w-5" />
                Worker Portal
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/admin/login">
              <Button size="lg" variant="outline" className="gap-2">
                <BarChart3 className="h-5 w-5" />
                Admin Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Portal Cards */}
      <section className="container mx-auto px-4 pb-16 md:px-6">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          {/* Worker Portal Card */}
          <Link href="/worker/login" className="group">
            <Card className="h-full transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Worker Portal</CardTitle>
                <CardDescription>
                  For gig delivery partners on Zepto, Blinkit, Swiggy Instamart
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    View your active policy & coverage
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Track earnings & automatic payouts
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Monitor live weather alerts in your zone
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    View claims history & payout details
                  </li>
                </ul>
                <div className="mt-6">
                  <Button variant="secondary" className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                    Enter Worker Portal
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Admin Portal Card */}
          <Link href="/admin/login" className="group">
            <Card className="h-full transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                  <BarChart3 className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-xl">Admin Dashboard</CardTitle>
                <CardDescription>
                  For EarnGuard operations team & insurance partners
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Monitor platform-wide metrics & KPIs
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Review claims & fraud detection alerts
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Manage trigger configurations & thresholds
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Track payouts & financial reconciliation
                  </li>
                </ul>
                <div className="mt-6">
                  <Button variant="outline" className="w-full group-hover:bg-accent group-hover:text-accent-foreground">
                    Enter Admin Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-card py-16">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="mb-12 text-center text-2xl font-semibold text-foreground md:text-3xl">
            How EarnGuard Works
          </h2>
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <span className="text-xl font-bold text-primary">1</span>
              </div>
              <h3 className="mb-2 font-semibold text-foreground">Subscribe Weekly</h3>
              <p className="text-sm text-muted-foreground">
                Pay just Rs 99-199/week. Auto-deduct from your platform earnings.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <span className="text-xl font-bold text-primary">2</span>
              </div>
              <h3 className="mb-2 font-semibold text-foreground">AI Monitors 24/7</h3>
              <p className="text-sm text-muted-foreground">
                Weather, outages, disruptions — our AI tracks everything in your zone.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <span className="text-xl font-bold text-primary">3</span>
              </div>
              <h3 className="mb-2 font-semibold text-foreground">Auto Payout</h3>
              <p className="text-sm text-muted-foreground">
                When triggers activate, money hits your account within 4 hours. No forms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">EarnGuard</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Because every delivery matters, even the ones that never happen.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
