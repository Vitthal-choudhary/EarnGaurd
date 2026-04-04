import { NextResponse } from "next/server";
import { workerPolicy, updateWorkerPolicy } from "@/lib/data-store";
import type { Policy } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json(workerPolicy);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { plan } = body as { plan: Policy["plan"] };
  if (!plan || !["basic", "standard", "pro"].includes(plan)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }
  const updated = updateWorkerPolicy(plan);
  return NextResponse.json(updated);
}
