import { repositories } from "@/lib/repository";

export async function GET() {
    const programList = await repositories.category.getAllCategories();
    return Response.json(programList);
}