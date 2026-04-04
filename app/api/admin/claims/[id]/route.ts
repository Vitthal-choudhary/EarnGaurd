import { NextResponse } from "next/server";
import { updateClaimStatus } from "@/lib/data-store";
import type { AdminClaim } from "@/lib/admin-mock-data";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { status } = body as { status: AdminClaim["status"] };

  if (!status || !["pending", "approved", "rejected", "paid"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updated = updateClaimStatus(id, status);
  if (!updated) {
    return NextResponse.json({ error: "Claim not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}
