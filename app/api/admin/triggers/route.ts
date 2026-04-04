import { NextResponse } from "next/server";
import { availableTriggers, triggerActivityData } from "@/lib/data-store";

export async function GET() {
  return NextResponse.json({
    triggers: availableTriggers,
    activity: triggerActivityData,
  });
}
