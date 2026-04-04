import { NextResponse } from "next/server";
import { allAdminClaims, platformStats } from "@/lib/data-store";

export async function GET() {
  const flagged = allAdminClaims.filter((c) => c.flagged);
  return NextResponse.json({
    flagged,
    stats: platformStats,
  });
}
