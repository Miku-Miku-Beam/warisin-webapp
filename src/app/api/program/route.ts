import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {

}

export async function GET() {
    const programList = await prisma.program.findMany({
        include: {
            ArtisanProfile: true,
            HerittageCategory: true,
        },
    });
    return Response.json(programList);
}