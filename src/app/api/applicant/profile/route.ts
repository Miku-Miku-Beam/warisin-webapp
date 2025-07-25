import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { userId, name, bio, location } = body;

  try {
    // Update User
    await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        bio,
        location,
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}