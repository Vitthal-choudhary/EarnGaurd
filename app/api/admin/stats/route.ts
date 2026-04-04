import { NextResponse } from "next/server";
import { platformStats } from "@/lib/data-store";

export async function GET() {
  return NextResponse.json(platformStats);
}
