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
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold mb-4 tracking-tight drop-shadow-lg">Heritage Artisans</h1>
                        <p className="text-xl text-orange-100 max-w-2xl mx-auto">
                            Discover talented artisans preserving traditional crafts and heritage skills
                        </p>
                    </div>
                </div>
            </div>

            {/* Artisans Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {artisans.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                        {artisans.map((artisan) => {
                            const profile = artisan.ArtisanProfile;
                            const activePrograms = artisan.ArtisanPrograms.length;

                            return (
                                <Link key={artisan.id} href={`/artisan/${artisan.id}`}  aria-label={`View profile of ${artisan.name}`}>
                                    <div className="bg-white/70 backdrop-blur-md border border-orange-100 shadow-xl hover:shadow-2xl hover:scale-[1.025] active:scale-95 active:shadow-md focus:ring-4 focus:ring-yellow-300 transition-all duration-150 rounded-3xl p-7 cursor-pointer flex flex-col items-center relative overflow-hidden mb-4 w-full max-w-xs min-h-[420px] h-full mx-auto select-none outline-none">
                                        {/* Border Gradient Avatar */}
                                        <div className="flex justify-center mb-5">
                                            {profile?.imageUrl || artisan.profileImageUrl ? (
                                                <div className="p-[3px] rounded-full bg-gradient-to-tr from-orange-400 via-yellow-300 to-pink-400 w-28 h-28 flex items-center justify-center">
                                                    <Image
                                                        src={profile?.imageUrl || artisan.profileImageUrl || '/placeholder-avatar.png'}
                                                        alt={artisan.name || 'Artisan'}
                                                        width={104}
                                                        height={104}
                                                        className="rounded-full object-cover border-4 border-white shadow-md w-24 h-24"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-orange-100 via-yellow-100 to-pink-100 flex items-center justify-center border-4 border-white shadow-md">
                                                    <span className="text-4xl font-extrabold text-orange-600">
                                                        {artisan.name?.charAt(0).toUpperCase() || 'A'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Artisan Info */}
                                        <div className="text-center w-full">
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight transition-colors">
                                                {artisan.name}
                                            </h3>
                                            {profile?.expertise && (
                                                <span className="inline-block bg-orange-100 text-orange-700 font-semibold text-xs px-3 py-1 rounded-full mb-3 shadow-sm">
                                                    {profile.expertise}
                                                </span>
                                            )}
                                            {(profile?.location || artisan.location) && (
                                                <div className="flex items-center justify-center gap-1 text-gray-500 mb-4">
                                                    <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="text-sm font-medium">{profile?.location || artisan.location}</span>
                                                </div>
                                            )}

                                            {/* Story Preview */}
                                            {profile?.story && (
                                                <p className="text-gray-600 text-sm mb-5 line-clamp-3 italic flex items-start gap-2">
                                                    <svg className="w-4 h-4 text-orange-300 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7a4 4 0 014-4h2a4 4 0 014 4v10" /></svg>
                                                    <span>{profile.story.length > 100
                                                        ? `${profile.story.substring(0, 100)}...`
                                                        : profile.story
                                                    }</span>
                                                </p>
                                            )}

                                            {/* Stats */}
                                            <div className="flex justify-center gap-4 text-sm mt-3">
                                                <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 font-semibold px-3 py-1 rounded-full shadow-sm">
                                                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h2a4 4 0 014 4v2" /></svg>
                                                    {activePrograms} Active Program{activePrograms !== 1 ? 's' : ''}
                                                </span>
                                            </div>
                                        </div>
                                        {/* Decorative gradient blur */}
                                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-orange-200 via-yellow-100 to-pink-100 rounded-full blur-2xl opacity-40 pointer-events-none" />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="flex justify-center mb-4">
                            <svg className="w-20 h-20 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.5 9.5a2 2 0 115 0c0 1.5-2.5 2-2.5 4" />
                                <circle cx="12" cy="17" r="1" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-orange-700 mb-2">No Artisans Found</h3>
                        <p className="text-gray-600">There are no registered artisans at the moment. Please check back soon!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
