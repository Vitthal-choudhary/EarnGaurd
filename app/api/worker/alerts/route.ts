import { NextResponse } from "next/server";
import { activeAlerts, zoneWeather } from "@/lib/data-store";

export async function GET() {
  return NextResponse.json({
    alerts: activeAlerts,
    weather: zoneWeather,
  });
}
