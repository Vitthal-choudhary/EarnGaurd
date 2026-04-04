import { NextResponse } from "next/server";
import { premiumPlansData } from "@/lib/data-store";

export async function GET() {
  return NextResponse.json(premiumPlansData);
}
