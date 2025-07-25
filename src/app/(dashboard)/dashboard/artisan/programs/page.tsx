import { repositories } from "@/lib/repository";
import { cookies } from "next/headers";
import Image from 'next/image';
import Link from "next/link";

const getProgramsData = async () => {
    const cookieStore = await cookies();

    const sessionValue = cookieStore.get('session')?.value;

    if (!sessionValue) {
        console.error('Session not found in cookies');
        return [];
    }

    const { userId: artisanId } = JSON.parse(sessionValue);

    if (!artisanId) {
        console.error('Artisan ID not found in session');
        return [];
    }

    const programs = await repositories.program.getProgramsByArtisan(artisanId);

    return programs
}

export default async function ArtisanProgramPage() {
    const programs = await getProgramsData();

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Program Saya</h1>
                    <p className="text-gray-600">
                        Kelola dan pantau program warisan budaya yang Anda buat
                    </p>
                </div>
                
                {/* Add Program Button */}
                <Link
                    href="/dashboard/artisan/programs/add"
                    className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition duration-200 shadow-md hover:shadow-lg"
                >
                    <svg 
                        className="w-5 h-5 mr-2" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                        />
                    </svg>
                    Buat Program Baru
                </Link>
            </div>

            {/* Programs Grid */}
            {programs.length === 0 ? (
                /* Empty State */
                <div className="text-center py-16">
                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <svg 
                            className="w-12 h-12 text-gray-400" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={1.5} 
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
                            />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Belum ada program
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        Mulai berbagi keahlian Anda dengan membuat program pelatihan warisan budaya pertama
                    </p>
                    <Link
                        href="/dashboard/artisan/programs/add"
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
                    >
                        <svg 
                            className="w-5 h-5 mr-2" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                            />
                        </svg>
                        Buat Program Pertama
                    </Link>
                </div>
            ) : (
                /* Programs Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {programs.map((program) => (
                        <div 
                            key={program.id} 
                            className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-200 overflow-hidden border border-blue-100 min-h-[540px] flex flex-col relative group"
                        >
                            {/* Program Image */}
                            <div className="relative h-48 w-full">
                                <img
                                    src={
                                        typeof program.programImageUrl === 'string' && program.programImageUrl.trim() !== ''
                                            ? program.programImageUrl
                                            : '/default-program.png'
                                    }
                                    alt={program.title}
                                    className="w-full h-full object-cover object-center rounded-t-3xl border-b border-blue-100 group-hover:scale-105 transition-transform duration-200"
                                    loading="lazy"
                                />
                                {/* Status Badge */}
                                <div className="absolute top-4 right-4 z-10">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm border border-white/60 backdrop-blur-md ${
                                        program.isOpen 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {program.isOpen ? 'Open' : 'Closed'}
                                    </span>
                                </div>
                            </div>

                            {/* Program Content */}
                            <div className="flex-1 flex flex-col p-6">
                                <div className="mb-2">
                                    <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-2">{program.title}</h3>
                                    <p className="text-sm text-orange-600 font-medium">{program.category.name}</p>
                                </div>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{program.description}</p>
                                {/* Program Details */}
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-gray-600 mb-4">
                                    <div className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> <span>Duration:</span> <span className="font-semibold ml-1">{program.duration}</span></div>
                                    <div className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> <span>Location:</span> <span className="font-semibold ml-1 truncate">{program.location}</span></div>
                                    <div className="flex items-center gap-1 col-span-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> <span>Start:</span> <span className="font-semibold ml-1">{new Date(program.startDate).toLocaleDateString('id-ID')}</span></div>
                                </div>
                                {/* Statistics */}
                                <div className="flex items-center justify-between mb-4 p-3 bg-white/60 rounded-xl shadow-inner border border-blue-50">
                                    <div className="text-center flex-1">
                                        <div className="text-lg font-bold text-blue-700">{program.applications.length}</div>
                                        <div className="text-xs text-gray-500">Applicants</div>
                                    </div>
                                    <div className="text-center flex-1">
                                        <div className="text-lg font-bold text-green-600">{program.applications.filter(app => app.status === 'APPROVED').length}</div>
                                        <div className="text-xs text-gray-500">Approved</div>
                                    </div>
                                    <div className="text-center flex-1">
                                        <div className="text-lg font-bold text-yellow-600">{program.applications.filter(app => app.status === 'PENDING').length}</div>
                                        <div className="text-xs text-gray-500">Pending</div>
                                    </div>
                                </div>
                                <div className="flex-1" />
                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                                    <Link
                                        href={`/programs/${program.id}`}
                                        className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg text-center text-sm font-semibold shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                        aria-label={`View details of ${program.title}`}
                                    >
                                        View Details
                                    </Link>
                                    <Link
                                        href={`/dashboard/artisan/programs/${program.id}/edit`}
                                        className="flex-1 bg-gray-100 text-gray-800 px-4 py-2 rounded-lg text-center text-sm font-semibold shadow hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                                        aria-label={`Edit program ${program.title}`}
                                    >
                                        Edit Program
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Quick Stats Summary */}
            {programs.length > 0 && (
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-orange-100 p-7 flex flex-col items-center group transition-all duration-200 hover:shadow-2xl">
                        <span className="text-3xl font-extrabold text-orange-600 mb-1">{programs.length}</span>
                        <span className="text-base text-gray-700 font-medium">Total Programs</span>
                        <span className="mt-2 text-xs text-gray-400">All programs you have created</span>
                    </div>
                    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-green-100 p-7 flex flex-col items-center group transition-all duration-200 hover:shadow-2xl">
                        <span className="text-3xl font-extrabold text-green-600 mb-1">{programs.filter(p => p.isOpen).length}</span>
                        <span className="text-base text-gray-700 font-medium">Active Programs</span>
                        <span className="mt-2 text-xs text-gray-400">Programs currently running</span>
                    </div>
                    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-blue-100 p-7 flex flex-col items-center group transition-all duration-200 hover:shadow-2xl">
                        <span className="text-3xl font-extrabold text-blue-600 mb-1">{programs.filter(p => !p.isOpen).length}</span>
                        <span className="text-base text-gray-700 font-medium">Completed Programs</span>
                        <span className="mt-2 text-xs text-gray-400">Programs that have been completed</span>
                    </div>
                    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-orange-100 p-7 flex flex-col items-center group transition-all duration-200 hover:shadow-2xl">
                        <span className="text-3xl font-extrabold text-orange-600 mb-1">{programs.reduce((total, program) => total + program.applications.length, 0)}</span>
                        <span className="text-base text-gray-700 font-medium">Total Applicants</span>
                        <span className="mt-2 text-xs text-gray-400">All applicants across your programs</span>
                    </div>
                </div>
            )}
        </div>
    );
}