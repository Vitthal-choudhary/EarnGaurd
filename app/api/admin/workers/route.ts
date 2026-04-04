import { NextResponse } from "next/server";
import { allWorkers } from "@/lib/data-store";

export async function GET() {
  return NextResponse.json(allWorkers);
}
