import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { Suspense } from 'react';
import LogoutButton from './LogoutButton';
import Image from 'next/image';

// Loading component for Navbar
const NavbarSkeleton = () => (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-yellow-100 shadow-sm">
        <nav className="container mx-auto flex items-center justify-between py-3 px-4">
            <Link href="/" className="text-xl md:text-2xl font-bold text-yellow-800 tracking-tight">
                HeritageID
            </Link>
            <div className="hidden md:flex gap-6 items-center">
                <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
        </nav>
    </header>
);

const NavbarContent = async () => {
    try {
        const user = await getCurrentUser();
        const isLoggedIn = !!user;
        const isArtisan = user?.role === 'ARTISAN';
        const isApplicant = user?.role === 'APPLICANT';

        return (
            <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-yellow-100 shadow-sm">
                <nav className="container mx-auto flex items-center justify-between py-3 px-4">
                    <Link href="/" className="flex items-center gap-2 text-xl md:text-2xl font-bold text-yellow-800 tracking-tight">
                        <Image src="/logo-warisin.svg" alt="Warisin Logo" width={36} height={36} />
                        Warisin
                    </Link>

                    <div className="hidden md:flex gap-6 items-center">
                        {/* Public navigation */}
                        {!isLoggedIn && (
                            <>
                                <Link href="/artisans" className="text-gray-700 hover:text-yellow-700 font-medium transition">The Artist</Link>
                                <Link href="/programs" className="text-gray-700 hover:text-yellow-700 font-medium transition">Programs</Link>
                                <Link href="/login" className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-5 rounded-lg shadow transition">Login</Link>
                                <Link href="/register" className="border border-yellow-600 hover:bg-yellow-50 text-yellow-700 font-bold py-2 px-5 rounded-lg transition">SignUp</Link>
                            </>
                        )}

                        {/* Logged in navigation */}
                        {isLoggedIn && (
                            <>
                                {/* Common links for all logged-in users */}
                                <Link href="/artisans" className="text-gray-700 hover:text-yellow-700 font-medium transition">The Artist</Link>
                                <Link href="/programs" className="text-gray-700 hover:text-yellow-700 font-medium transition">Programs</Link>

                                {/* Artisan-specific links */}
                                {isArtisan && (
                                    <>
                                        <Link href="/dashboard/artisan" className="bg-slate-100 text-yellow-800 font-bold px-4 py-2 rounded-full shadow-sm hover:bg-yellow-200 transition border border-slate-300">Dashboard</Link>
                                    </>
                                )}

                                {/* Applicant-specific links */}
                                {isApplicant && (
                                    <>
                                        <Link href="/dashboard/applicant" className="bg-slate-100 text-yellow-800 font-bold px-4 py-2 rounded-full shadow-sm hover:bg-yellow-200 transition border border-slate-300">Dashboard</Link>
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    {/* Mobile menu */}
                    <div className="md:hidden">
                        {isLoggedIn ? (
                            <div className="flex items-center gap-2">
                                <Link
                                    href={isArtisan ? `/artisan/${user.id}` : '/profile'}
                                    className="flex items-center gap-2"
                                >
                                    {user.profileImageUrl ? (
                                        <img
                                            src={user.profileImageUrl}
                                            alt={user.name || 'User'}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                                            <span className="text-yellow-700 font-semibold text-sm">
                                                {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                    )}
                                </Link>
                                <LogoutButton />
                            </div>
                        ) : (
                            <Link href="/login" className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg shadow transition">
                                Login
                            </Link>
                        )}
                    </div>
                </nav>
            </header>
        );
    } catch (error) {
        console.error('Error in Navbar:', error);
        // Fallback to logged-out state
        return (
            <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-yellow-100 shadow-sm">
                <nav className="container mx-auto flex items-center justify-between py-3 px-4">
                    <Link href="/" className="text-xl md:text-2xl font-bold text-yellow-800 tracking-tight">
                        Warisin
                    </Link>
                    <div className="hidden md:flex gap-6 items-center">
                        <Link href="/artisans" className="text-gray-700 hover:text-yellow-700 font-medium transition">The Artist</Link>
                        <Link href="/programs" className="text-gray-700 hover:text-yellow-700 font-medium transition">Programs</Link>
                        <Link href="/login" className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-5 rounded-lg shadow transition">Login</Link>
                    </div>
                    <div className="md:hidden">
                        <Link href="/login" className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg shadow transition">
                            Login
                        </Link>
                    </div>
                </nav>
            </header>
        );
    }
};

const Navbar = () => {
    return (
        <Suspense fallback={<NavbarSkeleton />}>
            <NavbarContent />
        </Suspense>
    );
};

export default Navbar; 