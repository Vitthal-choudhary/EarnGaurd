import { NextResponse } from "next/server";
import { workerProfile } from "@/lib/data-store";

export async function GET() {
  return NextResponse.json(workerProfile);
}
