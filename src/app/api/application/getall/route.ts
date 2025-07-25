import { NextRequest, NextResponse } from 'next/server';
import { applicationRepository } from '@/lib/repository/application.repository';

// GET /api/application/getbyuser?applicantId=xxx
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const applicantId = searchParams.get('applicantId');

  if (!applicantId) {
    return NextResponse.json({ error: 'Missing applicantId' }, { status: 400 });
  }

  try {
    // Ambil semua aplikasi yang sudah di-apply oleh applicant tertentu
    const applications = await applicationRepository.getApplicationsByApplicant(applicantId);

    // Jika ingin hanya program yang di-apply:
    // const programs = applications.map(app => app.Program);
    // return NextResponse.json({ programs });

    // Jika ingin seluruh aplikasi (beserta status, dsb):
    return NextResponse.json({ applications });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}