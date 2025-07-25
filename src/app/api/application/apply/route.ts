import { getCurrentCookie } from '@/lib/auth';
import { uploadFile } from '@/lib/firebase/storage';
import { ICreateApplicationData, repositories } from '@/lib/repository';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        const ProgramId = formData.get('ProgramId') as string;
        const message = formData.get('message') as string;
        const motivation = formData.get('motivation') as string | undefined;
        const cvFile = formData.get('cvFile') as File | null; // Ini objek File

        const cookie = await getCurrentCookie();
        const applicantId = cookie?.userId;

        if (!ProgramId || !applicantId || !message) {
            return NextResponse.json({ error: 'ProgramId, applicantId, and message are required.' }, { status: 400 });
        }

        const newApplication: ICreateApplicationData = {
            ProgramId,
            applicantId,
            message,
            motivation,
        };

        await repositories.application.createApplication(newApplication);

        let uploadedFileUrl: string | undefined;
        if (cvFile) {
            const fileBuffer = Buffer.from(await cvFile.arrayBuffer());

            const uploadResult = await uploadFile({
                fileName: cvFile.name,
                storagePath: `applications/${applicantId}`,
                fileBuffer: fileBuffer,
                mimeType: cvFile.type || 'application/pdf',
                options: {
                    customFileName: 'cv.pdf',
                }
            });
            uploadedFileUrl = uploadResult.path;
        }

        await repositories.application.updateApplication(applicantId, {
            cvUrl: uploadedFileUrl,
        });

        return NextResponse.json({ message: 'Application submitted successfully!', data: newApplication }, { status: 201 });
    } catch (error: any) {
        console.error('Error submitting application:', error);
        return NextResponse.json({ error: 'Failed to submit application.', details: error.message }, { status: 500 });
    }
}