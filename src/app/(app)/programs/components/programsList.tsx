import ProgramCard from './programsCard';

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

interface ProgramsListProps {
  events: ProgramCardProps[];
  search?: string;
  category?: string;
}

const ProgramsList = ({ events }: ProgramsListProps) => (
  <div className="flex flex-col gap-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {events && events.length > 0 ? (
        events.map((event: ProgramCardProps) => (
          <ProgramCard key={event.id} {...event} />
        ))
      ) : (
        <div className="col-span-full text-center text-gray-400 py-12 flex flex-col items-center">
          <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto mb-4 text-yellow-400"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6 1a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="text-lg font-semibold">Tidak ada program yang ditemukan.</span>
          <span className="text-sm text-gray-500 mt-1">Coba kata kunci atau filter lain.</span>
        </div>
      )}
    </div>
  </div>
);

export default ProgramsList; 