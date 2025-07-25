import prisma from '@/lib/prisma';
import ProgramsList from './components/programsList';
import ProgramsSearchBar from './components/ProgramsSearchBar';

interface ProgramCardProps {
  id: string;
  title: string;
  isOpen: boolean;
  description: string;
  duration: string;
  criteria: string;
  category: string;
  applications: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  programImageUrl?: string;
  artisanAvatar?: string;
  artisanName?: string;
}


function getUniqueCategories(events: ProgramCardProps[]) {
  const cats = events.map(e => e.category).filter(Boolean);
  return Array.from(new Set(cats));
}

export interface ProgramsSearchParams {
  search?: string;
  category?: string;
}

export default async function EventPage({ searchParams }: { searchParams: { [key: string]: string } }) {
  let events: ProgramCardProps[] = [];
  let error: unknown = null;
  const search = searchParams?.search || '';
  const category = searchParams?.category || 'All Program';
  try {
    const dbEvents = await prisma.program.findMany({
      include: {
        artisan: true,
        category: true,
        applications: true,
      },
      orderBy: { createdAt: 'desc' },
      where: {
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
        ...(category && category !== 'All Program'
          ? { category: { name: category } }
          : {}),
      },
    });
    events = dbEvents.map(event => ({
      id: event.id,
      title: event.title,
      isOpen: event.isOpen,
      description: event.description,
      duration: event.duration,
      criteria: event.criteria,
      category: event.category?.name || '-',
      applications: event.applications.length,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
      programImageUrl: event.programImageUrl || "/default-program.jpg",
      artisanAvatar: event.artisan?.profileImageUrl || "/default-avatar.png",
      artisanName: event.artisan?.name || 'Unknown',
    }));
  } catch (e) {
    error = e;
    console.error('Error fetching events:', e);
  }

  const categories = ['All Program', ...getUniqueCategories(events)];

  if (error) {
    return <main className="container mx-auto px-4 py-8 text-red-600">Error loading events: {error instanceof Error ? error.message : String(error)}</main>;
  }
  return (
    <main className="container mx-auto px-4 py-8">
      <ProgramsSearchBar search={search} category={category} categories={categories} />
      <ProgramsList events={events} />
    </main>
  );
}
