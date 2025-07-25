import { applicationRepository } from "@/lib/repository/application.repository";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Application ID is required" }, { status: 400 });
    }
    const result = await applicationRepository.rejectApplication(id);
    return NextResponse.json({ success: true, application: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to reject application" }, { status: 500 });
  }
}
