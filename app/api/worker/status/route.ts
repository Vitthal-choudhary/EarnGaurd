import { NextResponse } from "next/server";
import { sysStatus } from "@/lib/data-store";

export async function GET() {
  return NextResponse.json(sysStatus);
}
