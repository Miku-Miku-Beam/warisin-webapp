import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import LogoutButton from './LogoutButton';

const Header = async () => {
  const user = await getCurrentUser();
  const isLoggedIn = !!user;
  const isArtisan = user?.role === 'ARTISAN';
  const isApplicant = user?.role === 'Applicant';

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-yellow-100 shadow-sm">
      <nav className="container mx-auto flex items-center justify-between py-3 px-4">
        <Link href="/" className="text-xl md:text-2xl font-bold text-yellow-800 tracking-tight">
          HeritageID
        </Link>

        <div className="hidden md:flex gap-6 items-center">
          {/* Public navigation */}
          {!isLoggedIn && (
            <>
              <Link href="#fitur" className="text-gray-700 hover:text-yellow-700 font-medium transition">Fitur</Link>
              <Link href="/artisans" className="text-gray-700 hover:text-yellow-700 font-medium transition">Artisan</Link>
              <Link href="#testimoni" className="text-gray-700 hover:text-yellow-700 font-medium transition">Testimoni</Link>
              <Link href="/login" className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-5 rounded-lg shadow transition">Login</Link>
              <Link href="/register" className="border border-yellow-600 hover:bg-yellow-50 text-yellow-700 font-bold py-2 px-5 rounded-lg transition">Daftar</Link>
            </>
          )}

          {/* Logged in navigation */}
          {isLoggedIn && (
            <>
              {/* Common links for all logged-in users */}
              <Link href="/artisans" className="text-gray-700 hover:text-yellow-700 font-medium transition">Artisan</Link>
              <Link href="/programs" className="text-gray-700 hover:text-yellow-700 font-medium transition">Programs</Link>

              {/* Artisan-specific links */}
              {isArtisan && (
                <>
                  <Link href="/dashboard/artisan" className="text-gray-700 hover:text-yellow-700 font-medium transition">Dashboard</Link>
                  <Link href="/dashboard/artisan/programs" className="text-gray-700 hover:text-yellow-700 font-medium transition">My Programs</Link>
                  <Link href="/dashboard/artisan/applications" className="text-gray-700 hover:text-yellow-700 font-medium transition">Applications</Link>
                </>
              )}

              {/* Applicant-specific links */}
              {isApplicant && (
                <>
                  <Link href="/dashboard/applicant" className="text-gray-700 hover:text-yellow-700 font-medium transition">Dashboard</Link>
                  <Link href="/dashboard/applicant/applications" className="text-gray-700 hover:text-yellow-700 font-medium transition">My Applications</Link>
                </>
              )}

              {/* User profile and logout */}
              <div className="flex items-center gap-3">
                <Link 
                  href={isArtisan ? `/artisan/${user.id}` : '/profile'} 
                  className="flex items-center gap-2 text-gray-700 hover:text-yellow-700 font-medium transition"
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
                  <span className="hidden lg:inline">{user.name || 'Profile'}</span>
                </Link>
                <LogoutButton />
              </div>
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
};

export default Header; 