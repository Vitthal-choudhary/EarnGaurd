import { NextResponse } from "next/server";
import { allAdminClaims } from "@/lib/data-store";

export async function GET() {
  return NextResponse.json(allAdminClaims);
}
