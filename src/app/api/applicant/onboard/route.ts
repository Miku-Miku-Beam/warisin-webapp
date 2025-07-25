import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { id, name, location, dob } = await req.json();
    if (!id || !name || !location || !dob) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Update User basic info
    await prisma.user.update({
      where: { id },
      data: {
        name,
        location,
      },
    });

    // Upsert ApplicantProfile (background = dob, interests = '-')
    await prisma.applicantProfile.upsert({
      where: { userId: id },
      update: {
        background: dob,
        interests: '-',
      },
      create: {
        userId: id,
        background: dob,
        interests: '-',
      },
    });

    // No explicit onboarded flag in schema, so onboarding is considered complete if ApplicantProfile exists
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 