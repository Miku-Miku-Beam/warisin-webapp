import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

async function getArtisans() {
    try {
        const artisans = await prisma.user.findMany({
            where: {
                role: 'ARTISAN'
            },
            include: {
                ArtisanProfile: true,
                ArtisanPrograms: {
                    where: {
                        isOpen: true
                    },
                    select: {
                        id: true,
                        title: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return artisans;
    } catch (error) {
        console.error('Error fetching artisans:', error);
        return [];
    }
}

export default async function ArtisansPage() {
    const artisans = await getArtisans();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-4">Heritage Artisans</h1>
                        <p className="text-xl text-orange-100 max-w-2xl mx-auto">
                            Discover talented artisans preserving traditional crafts and heritage skills
                        </p>
                    </div>
                </div>
            </div>

            {/* Artisans Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {artisans.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {artisans.map((artisan) => {
                            const profile = artisan.ArtisanProfile;
                            const activePrograms = artisan.ArtisanPrograms.length;

                            return (
                                <Link key={artisan.id} href={`/artisan/${artisan.id}`}>
                                    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer">
                                        {/* Profile Image */}
                                        <div className="flex justify-center mb-4">
                                            {profile?.imageUrl || artisan.profileImageUrl ? (
                                                <Image
                                                    src={profile?.imageUrl || artisan.profileImageUrl || '/placeholder-avatar.png'}
                                                    alt={artisan.name || 'Artisan'}
                                                    width={120}
                                                    height={120}
                                                    className="rounded-full object-cover border-4 border-orange-100"
                                                />
                                            ) : (
                                                <div className="w-30 h-30 rounded-full bg-orange-100 flex items-center justify-center border-4 border-orange-200">
                                                    <span className="text-2xl font-bold text-orange-600">
                                                        {artisan.name?.charAt(0).toUpperCase() || 'A'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Artisan Info */}
                                        <div className="text-center">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">{artisan.name}</h3>
                                            {profile?.expertise && (
                                                <p className="text-orange-600 font-medium mb-2">{profile.expertise}</p>
                                            )}
                                            {(profile?.location || artisan.location) && (
                                                <div className="flex items-center justify-center gap-1 text-gray-500 mb-3">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="text-sm">{profile?.location || artisan.location}</span>
                                                </div>
                                            )}

                                            {/* Story Preview */}
                                            {profile?.story && (
                                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                                    {profile.story.length > 100 
                                                        ? `${profile.story.substring(0, 100)}...` 
                                                        : profile.story
                                                    }
                                                </p>
                                            )}

                                            {/* Stats */}
                                            <div className="flex justify-center gap-4 text-sm">
                                                <div className="flex items-center gap-1 text-green-600">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                    </svg>
                                                    <span>{activePrograms} Active Programs</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="flex justify-center mb-4">
                            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Artisans Found</h3>
                        <p className="text-gray-600">There are no registered artisans at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
