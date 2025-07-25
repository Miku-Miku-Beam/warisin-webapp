import prisma from "@/lib/prisma";
import { ICreateProgramData, repositories } from "@/lib/repository";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {

        // Check if user is authenticated
        const cookieStore = await cookies();

        const sessionValue = cookieStore.get('session')?.value;

        if (!sessionValue) {
            console.error('Session not found in cookies');
            return [];
        }

        const { userId: artisanId } = JSON.parse(sessionValue);

        const requestBody: ICreateProgramData = await request.json();
        const { title, description, duration, location, criteria, categoryId, startDate, endDate, isOpen, programImageUrl, videoThumbnailUrl, videoUrl } = requestBody;

        // Validate required fields
        if (!title || !description || !duration || !categoryId) {
            return Response.json({ error: "Missing required fields" }, { status: 400 });
        }

        const createProgramPayload: ICreateProgramData = {
            artisanId,
            title,
            description,
            duration,
            location,
            criteria,
            categoryId,
            startDate,
            endDate,
            isOpen,
            programImageUrl,
            videoThumbnailUrl,
            videoUrl
        };

        // Create new program
        const newprogram = await repositories.program.createProgram(createProgramPayload);

        return Response.json({ message: 'Program created successfully', program: newprogram }, { status: 201 });

    }
    catch (error) {
        console.error('Error creating program:', error);
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
