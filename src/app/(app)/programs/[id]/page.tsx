import prisma from '@/lib/prisma';
import ProgramDetail from './components/ProgramDetail';

interface ProgramPageProps {
  params: Promise<{
    id: string;
  }>;
}


export default async function ProgramPage({ params }: ProgramPageProps) {

  const { id } = await params;

  const program = await prisma.program.findUnique({
    where: { id: id },
    include: {
      artisan: true,
      category: true,
    },
  });

  if (!program) {
    return <div className="max-w-2xl mx-auto py-12 text-red-600">Program not found.</div>;
  }

  const safeProgram = {
    ...program,
    location: program.location ?? undefined,
    programImageUrl: program.programImageUrl ?? undefined,
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