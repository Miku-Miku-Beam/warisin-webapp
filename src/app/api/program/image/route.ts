import { fileToBuffer, uploadProgramFile, validateFile } from "@/lib/firebase/storage";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const programId = formData.get('programId') as string;

        // Validate inputs
        if (!file || !programId) {
            return Response.json({ 
                error: 'Missing required fields: file and programId' 
            }, { status: 400 });
        }

        // Validate file type and size
        const validation = validateFile(file.name, file.type, file.size, 'image');
        if (!validation.isValid) {
            return Response.json({ 
                error: 'File validation failed', 
                details: validation.errors 
            }, { status: 400 });
        }

        // Convert file to buffer
        const fileBuffer = await fileToBuffer(file);

        // Upload using your utility function
        const result = await uploadProgramFile(
            fileBuffer,
            file.name,
            file.type,
            programId,
            'program-image'
        );

        return Response.json({ 
            success: true,
            url: result.url,
            fileName: result.fileName,
            size: result.size,
            path: result.path
        });

    } catch (error) {
        console.error('Error uploading program image:', error);
        
        // Handle specific Firebase errors
        if (error instanceof Error) {
            if (error.message.includes('DECODER') || error.message.includes('unsupported')) {
                return Response.json({ 
                    error: 'Firebase configuration error. Please check your private key format.' 
                }, { status: 500 });
            }
            
            if (error.message.includes('not allowed')) {
                return Response.json({ 
                    error: error.message 
                }, { status: 400 });
            }
        }

        return Response.json({ 
            error: 'Internal server error during file upload' 
        }, { status: 500 });
    }
}