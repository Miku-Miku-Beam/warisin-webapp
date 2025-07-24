import { getCurrentUser } from '@/lib/auth';
import LogoutButton from '@/lib/components/LogoutButton';
import ActiveLink from './ActiveLink';

const Sidebar = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <aside className="w-full md:w-64 bg-white h-full border-r px-6 py-8 flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Applicant Dashboard</h2>
        <nav className="flex flex-col gap-2">
          <ActiveLink
            href="/dashboard/applicant"
            exactMatch={true}
          >
            Overview
          </ActiveLink>
          <ActiveLink
            href="/dashboard/applicant/profile"
          >
            Edit Profile
          </ActiveLink>
        </nav>
      </div>
      <div className="mt-auto">
        <div className="text-xs text-gray-500 mb-1">Logged in as</div>
        <div className="text-sm font-medium">{user.email}</div>
        <div className="text-sm mb-4">{user.name}</div>
        <LogoutButton />
      </div>
    </aside>
  );
};

export default Sidebar;