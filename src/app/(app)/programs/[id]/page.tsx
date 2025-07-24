import { PrismaClient } from "../../../../../generated";
import ProgramDetail from './components/ProgramDetail';

const prisma = new PrismaClient();

export default async function ProgramPage({ params }: { params: { id: string } }) {
  const program = await prisma.program.findUnique({
    where: { id: params.id },
    include: {
      artisan: true,
      category: true,
    },
  });

  if (!program) {
    return <div className="max-w-2xl mx-auto py-12 text-red-600">Program not found.</div>;
  }

  // Convert nullable fields to undefined for type safety
  const safeProgram = {
    ...program,
    artisan: program.artisan
      ? {
          name: program.artisan.name ?? undefined,
          bio: program.artisan.bio ?? undefined,
          profileImageUrl: program.artisan.profileImageUrl ?? undefined,
        }
      : undefined,
    category: program.category
      ? {
          name: program.category.name ?? undefined,
        }
      : undefined,
  };

  return (
    <main className="min-h-screen">
      <ProgramDetail program={safeProgram} />
    </main>
  );
}