import { NextResponse } from "next/server";
import { availableTriggers, workerPolicy } from "@/lib/data-store";

export async function GET() {
  return NextResponse.json({
    triggers: availableTriggers,
    policy: workerPolicy,
  });
}
