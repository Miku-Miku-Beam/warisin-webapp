import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { title, story } = await req.json();
  // (Opsional: ambil user dari session/cookie)
  await prisma.story.create({
    data: {
      title,
      story,
      userName: "Anonymous", // Ganti dengan user login jika ada
    },
  });
  return NextResponse.json({ success: true });
}