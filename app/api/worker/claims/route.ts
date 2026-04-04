import { NextResponse } from "next/server";
import { workerClaims, workerMonthlyStats } from "@/lib/data-store";

export async function GET() {
  return NextResponse.json({
    claims: workerClaims,
    stats: workerMonthlyStats,
  });
}
