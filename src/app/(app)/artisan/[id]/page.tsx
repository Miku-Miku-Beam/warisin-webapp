import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getArtisanProfile(id: string) {
    try {
        const artisan = await prisma.user.findUnique({
            where: {
                id: id,
                role: 'ARTISAN'
            },
            include: {
                ArtisanProfile: true,
                ArtisanPrograms: {
                    include: {
                        category: true,
                        applications: {
                            select: {
                                id: true,
                                status: true
                            }
                        }
                    }
                }
            }
        });

        return artisan;
    } catch (error) {
        console.error('Error fetching artisan profile:', error);
        return null;
    }
}


interface ArtisanProfilePageProps {
    params: Promise<{
        id: string;
    }>;
}


export default async function ArtisanProfilePage({ params }: ArtisanProfilePageProps) {
    const { id } = await params;

    console.log(id);
    const artisan = await getArtisanProfile(id);

    console.log(artisan)

    if (!artisan || !artisan.ArtisanProfile) {
        notFound();
    }

    const profile = artisan.ArtisanProfile;
    const programs = artisan.ArtisanPrograms || [];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Profile Image */}
                        <div className="flex-shrink-0">
                            {(profile.imageUrl || artisan.profileImageUrl) ? (
                                <Image
                                    src={profile.imageUrl || artisan.profileImageUrl || '/placeholder-avatar.png'}
                                    alt={artisan.name || 'Artisan'}
                                    width={200}
                                    height={200}
                                    className="rounded-full border-4 border-white shadow-lg object-cover"
                                />
                            ) : (
                                <div className="w-48 h-48 rounded-full bg-white/20 flex items-center justify-center border-4 border-white">
                                    <span className="text-4xl font-bold text-white">
                                        {artisan.name?.charAt(0)?.toUpperCase() || 'A'}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Profile Info */}
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl font-bold mb-2">{artisan.name || 'Unknown Artisan'}</h1>
                            <p className="text-xl text-orange-100 mb-4">{profile.expertise || 'Heritage Artisan'}</p>
                            {(profile.location || artisan.location) && (
                                <div className="flex items-center justify-center md:justify-start gap-2 text-orange-100">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                    <span>{profile.location || artisan.location}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* About Section */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
                            <div className="prose prose-gray max-w-none">
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                    {profile.story || 'No story available yet.'}
                                </p>
                            </div>
                        </div>

                        {/* Works/Portfolio Section */}
                        {profile.works && Array.isArray(profile.works) && profile.works.length > 0 && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Portfolio & Works</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {profile.works.map((work, index) => (
                                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-gray-700">{String(work)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Programs Section */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Training Programs</h2>
                            {programs.length > 0 ? (
                                <div className="space-y-4">
                                    {programs.map((program) => {
                                        const totalApplications = program.applications.length;
                                        const pendingApplications = program.applications.filter(app => app.status === 'PENDING').length;
                                        const acceptedApplications = program.applications.filter(app => app.status === 'ACCEPTED').length;

                                        return (
                                            <div key={program.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <h3 className="text-lg font-semibold text-gray-900">{program.title}</h3>
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                program.isOpen 
                                                                    ? 'bg-green-100 text-green-800' 
                                                                    : 'bg-red-100 text-red-800'
                                                            }`}>
                                                                {program.isOpen ? 'Open' : 'Closed'}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-600 mb-2">{program.description}</p>
                                                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                                            <span className="flex items-center gap-1">
                                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                                </svg>
                                                                Duration: {program.duration}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                Category: {program.category.name}
                                                            </span>
                                                        </div>
                                                        <div className="mt-2 flex gap-4 text-sm">
                                                            <span className="text-blue-600">Total Applications: {totalApplications}</span>
                                                            <span className="text-yellow-600">Pending: {pendingApplications}</span>
                                                            <span className="text-green-600">Accepted: {acceptedApplications}</span>
                                                        </div>
                                                    </div>
                                                    <Link 
                                                        href={`/program/${program.id}`}
                                                        className="ml-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                                                    >
                                                        View Details
                                                    </Link>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">No training programs available yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Contact Card */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                    <span>{artisan.email || 'No email provided'}</span>
                                </div>
                                {(profile.location || artisan.location) && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                        <span>{profile.location || artisan.location}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Stats Card */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Total Programs</span>
                                    <span className="font-semibold text-lg">{programs.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Active Programs</span>
                                    <span className="font-semibold text-lg text-green-600">
                                        {programs.filter(p => p.isOpen).length}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Total Applications</span>
                                    <span className="font-semibold text-lg text-blue-600">
                                        {programs.reduce((total, program) => total + program.applications.length, 0)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Member Since</span>
                                    <span className="font-semibold text-sm">
                                        {artisan.createdAt ? new Date(artisan.createdAt).toLocaleDateString('en-US', { 
                                            year: 'numeric', 
                                            month: 'long' 
                                        }) : 'Unknown'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="space-y-3">
                                <Link 
                                    href={`/programs?artisan=${artisan.id}`}
                                    className="w-full px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-center block"
                                >
                                    View All Programs
                                </Link>
                                <Link 
                                    href="/artisans"
                                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-center block"
                                >
                                    Back to Artisans
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
