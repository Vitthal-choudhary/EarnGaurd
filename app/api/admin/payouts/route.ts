import { NextResponse } from "next/server";
import { platformStats, weeklyPayouts } from "@/lib/data-store";

export async function GET() {
  return NextResponse.json({
    stats: platformStats,
    weekly: weeklyPayouts,
  });
}
