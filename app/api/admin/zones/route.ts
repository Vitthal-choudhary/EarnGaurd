import { NextResponse } from "next/server";
import { allZoneMetrics } from "@/lib/data-store";

export async function GET() {
  return NextResponse.json(allZoneMetrics);
}
