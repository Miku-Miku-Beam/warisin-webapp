import EventList from './components/EventList';
import { PrismaClient } from '../../../../generated';

const prisma = new PrismaClient();

export default async function EventPage() {
  let events = [];
  let error = null;
  try {
    events = await prisma.program.findMany({
      include: {
        artisan: true,
        category: true,
        applications: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (e) {
    error = e;
    console.error('Error fetching events:', e);
  }

  // Mapping sesuai schema
  const mappedEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    isOpen: event.isOpen,
    description: event.description,
    duration: event.duration,
    criteria: event.criteria,
    category: event.category?.name || '-',
    categoryId: event.categoryId,
    artisan: event.artisan?.name || 'Unknown',
    artisanId: event.artisanId,
    applications: event.applications.length,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  }));

  if (error) {
    return <main className="container mx-auto px-4 py-8 text-red-600">Error loading events: {error.message}</main>;
  }
  console.log("Events from DB:", events);
  console.log("Mapped events:", mappedEvents);
  return (
    <main className="container mx-auto px-4 py-8">
      {mappedEvents.length === 0 ? (
        <div className="text-gray-500">No events found.</div>
      ) : (
        <EventList events={mappedEvents} />
      )}
    </main>
  );
}
