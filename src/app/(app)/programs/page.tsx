import prisma from '@/lib/prisma';
import { Suspense } from 'react';
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

export default async function EventPage({ searchParams }: { searchParams: Promise<ProgramsSearchParams> }) {
  let events: ProgramCardProps[] = [];
  let error: unknown = null;

  const { search: searchParam, category: categoryParam } = await searchParams;
  
  const search = searchParam || '';
  const category = categoryParam || 'All Program';
  try {
    const dbEvents = await prisma.program.findMany({
      include: {
        artisan: true,
        category: true,
        applications: true,
      },
      orderBy: { createdAt: 'desc' },
      where: {
        isOpen: true,
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
      <Suspense fallback={
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 bg-white/60 backdrop-blur-md border border-white/30 shadow-lg rounded-2xl p-4">
          <div className="relative flex-1 w-full">
            <div className="pl-10 pr-10 border border-gray-200 rounded-lg px-4 py-2 w-full h-10 animate-pulse bg-gray-200"></div>
          </div>
          <div className="border border-gray-200 rounded-lg px-3 py-2 w-32 h-10 animate-pulse bg-gray-200"></div>
        </div>
      }>
        <ProgramsSearchBar search={search} category={category} categories={categories} />
      </Suspense>
      <ProgramsList events={events} />
    </main>
  );
}
