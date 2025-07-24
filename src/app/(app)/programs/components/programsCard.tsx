import Image from "next/image";
import Link from "next/link";

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

const fallbackAvatar = "/default-avatar.png";
const fallbackProgram = "/default-program.png";

const ProgramCard = ({
  id,
  title,
  isOpen,
  description,
  duration,
  criteria,
  category,
  applications,
  createdAt,
  updatedAt,
  programImageUrl,
  artisanAvatar,
  artisanName,
}: ProgramCardProps) => (
  <div className="bg-white/80 backdrop-blur-lg border border-white/40 shadow-xl hover:shadow-2xl transition-shadow duration-200 rounded-3xl w-full max-w-xs flex flex-col overflow-hidden group">
    {/* Thumbnail & Status badge */}
    <div className="relative w-full">
      <Image
        src={programImageUrl || fallbackProgram}
        alt={title}
        className="object-cover w-full h-44 rounded-t-3xl"
        width={400}
        height={176}
        priority
      />
      <span className={`absolute top-4 left-4 px-4 py-1 rounded-full text-sm font-bold shadow-lg z-10 ${isOpen ? 'bg-green-500/90 text-white' : 'bg-gray-400/80 text-white'}`}>{isOpen ? 'Open' : 'Closed'}</span>
    </div>
    {/* Artisan avatar dan nama */}
    <div className="flex items-center gap-4 px-6 pt-4 pb-2">
      <Image
        src={artisanAvatar || fallbackAvatar}
        alt={artisanName || 'Artisan'}
        width={48}
        height={48}
        className="w-12 h-12 rounded-full border-2 border-yellow-400 shadow"
      />
      <div className="flex flex-col">
        <span className="font-semibold text-base text-gray-800 leading-tight">{artisanName || '-'}</span>
        <span className="text-xs text-gray-500">Artisan</span>
      </div>
    </div>
    <div className="px-6 pb-6 flex-1 flex flex-col gap-2">
      <span className="inline-block bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full font-semibold shadow mb-2 w-fit">{category}</span>
      <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2">{title}</h3>
      <p className="text-gray-700 text-sm mb-2 line-clamp-3">{description}</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600 mb-2">
        <div><b>Duration:</b> {duration}</div>
        <div><b>Applicants:</b> {applications}</div>
        <div className="col-span-2"><b>Criteria:</b> {criteria}</div>
        <div className="col-span-2"><b>Created:</b> {new Date(createdAt).toLocaleDateString()}</div>
      </div>
      <div className="flex-1" />
      <Link
        href={isOpen ? `/programs/${id}` : "#"}
        className={`w-full mt-2 py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-base transition-colors duration-200 shadow-md ${
          isOpen
            ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        tabIndex={isOpen ? 0 : -1}
        aria-disabled={!isOpen}
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
      >
        {isOpen ? (
          <>
            <span>Join Program</span>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="inline-block"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </>
        ) : (
          'Program Closed'
        )}
      </Link>
    </div>
  </div>
);

export default ProgramCard;