import { repositories } from "@/lib/repository";
import { cookies } from "next/headers";
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

    console.log(artisanId);

    const programs = await repositories.program.getProgramsByArtisan(artisanId);

    return programs
}

export default async function ArtisanProgramPage() {
    const programs = await getProgramsData();

    console.log(programs);

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
                    className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 shadow-md hover:shadow-lg"
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {programs.map((program) => (
                        <div 
                            key={program.id} 
                            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200"
                        >
                            {/* Program Image */}
                            <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
                                {program.programImageUrl ? (
                                    <img
                                        src={program.programImageUrl}
                                        alt={program.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <div className="text-center text-white">
                                            <svg 
                                                className="w-16 h-16 mx-auto mb-2 opacity-80" 
                                                fill="none" 
                                                stroke="currentColor" 
                                                viewBox="0 0 24 24"
                                            >
                                                <path 
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round" 
                                                    strokeWidth={1.5} 
                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                                                />
                                            </svg>
                                            <p className="text-sm opacity-80">{program.category.name}</p>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Status Badge */}
                                <div className="absolute top-4 right-4">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                        program.isOpen 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {program.isOpen ? 'Terbuka' : 'Tertutup'}
                                    </span>
                                </div>
                            </div>

                            {/* Program Content */}
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-1 line-clamp-2">
                                            {program.title}
                                        </h3>
                                        <p className="text-sm text-blue-600 font-medium">
                                            {program.category.name}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {program.description}
                                </p>

                                {/* Program Details */}
                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="font-medium">Durasi:</span>
                                        <span className="ml-1">{program.duration}</span>
                                    </div>
                                    
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span className="font-medium">Lokasi:</span>
                                        <span className="ml-1 truncate">{program.location}</span>
                                    </div>
                                    
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="font-medium">Mulai:</span>
                                        <span className="ml-1">{new Date(program.startDate).toLocaleDateString('id-ID')}</span>
                                    </div>
                                </div>

                                {/* Statistics */}
                                <div className="flex items-center justify-between mb-6 p-3 bg-gray-50 rounded-lg">
                                    <div className="text-center">
                                        <div className="text-lg font-semibold text-gray-900">
                                            {program.applications.length}
                                        </div>
                                        <div className="text-xs text-gray-600">Pendaftar</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-semibold text-green-600">
                                            {program.applications.filter(app => app.status === 'APPROVED').length}
                                        </div>
                                        <div className="text-xs text-gray-600">Diterima</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-semibold text-yellow-600">
                                            {program.applications.filter(app => app.status === 'PENDING').length}
                                        </div>
                                        <div className="text-xs text-gray-600">Menunggu</div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Link
                                        href={`/programs/${program.id}`}
                                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-center text-sm font-medium hover:bg-blue-700 transition duration-200"
                                    >
                                        Lihat Detail
                                    </Link>
                                    <Link
                                        href={`/dashboard/artisan/programs/${program.id}/edit`}
                                        className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-center text-sm font-medium hover:bg-gray-300 transition duration-200"
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
                <div className="mt-12 bg-white rounded-xl shadow-md p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Program</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{programs.length}</div>
                            <div className="text-sm text-gray-600">Total Program</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                                {programs.filter(p => p.isOpen).length}
                            </div>
                            <div className="text-sm text-gray-600">Program Aktif</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">
                                {programs.reduce((total, program) => total + program.applications.length, 0)}
                            </div>
                            <div className="text-sm text-gray-600">Total Pendaftar</div>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                            <div className="text-2xl font-bold text-yellow-600">
                                {programs.reduce((total, program) => 
                                    total + program.applications.filter(app => app.status === 'PENDING').length, 0
                                )}
                            </div>
                            <div className="text-sm text-gray-600">Menunggu Review</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}