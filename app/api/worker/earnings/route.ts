import { NextResponse } from "next/server";
import { weeklyEarnings } from "@/lib/data-store";

export async function GET() {
  return NextResponse.json(weeklyEarnings);
}
