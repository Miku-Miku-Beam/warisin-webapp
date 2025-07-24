import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated"; // atau '@prisma/client' jika pakai default
import { getCurrentUser } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { programId, motivation, message, cvUrl } = body;

  // Ambil user dari session cookie via getCurrentUser
  const user = await getCurrentUser();
  const applicantId = user?.id;

  if (!applicantId) {
    return NextResponse.json({ success: false, error: "Applicant not authenticated" }, { status: 401 });
  }

  try {
    await prisma.application.create({
      data: {
        ProgramId: programId,
        applicantId,
        motivation,
        message,
        cvUrl,
        status: "PENDING",
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
} 