import Link from 'next/link';
import { usePathname } from 'next/navigation';

type SidebarProps = {
    user: { email: string; name: string };
    onLogout: () => void;
  };
  
  const ArtisanSidebar = ({ user, onLogout }: SidebarProps) => {
    const pathname = usePathname();
    
    return (
    <aside className="w-full md:w-64 bg-white h-full border-r px-6 py-8 flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Artisan Dashboard</h2>
        <nav className="flex flex-col gap-2">
          <Link 
            href="/dashboard/artisan" 
            className={`transition hover:text-black ${pathname === '/dashboard/artisan' ? 'text-black font-medium' : 'text-gray-700'}`}
          >
            Overview (Applications)
          </Link>
          <Link 
            href="/dashboard/artisan/profile" 
            className={`transition hover:text-black ${pathname === '/dashboard/artisan/profile' ? 'text-black font-medium' : 'text-gray-700'}`}
          >
            Edit Profile
          </Link>
        </nav>
      </div>
      <div className="mt-auto">
        <div className="text-xs text-gray-500 mb-1">Logged in as</div>
        <div className="text-sm font-medium">{user.email}</div>
        <div className="text-sm mb-4">{user.name}</div>
        <button
          className="text-red-500 hover:underline text-sm"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </aside>
  );
  };
  export default ArtisanSidebar;
