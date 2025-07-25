import Link from 'next/link';


interface Notification {
  id: string;
  createdAt: string | Date;
  applicant: {
    name?: string | null;
    profileImageUrl?: string | null;
  };
  Program: {
    title: string;
  };
}

const NotificationList = ({ notifications }: { notifications: Notification[] }) => {
  return (
    <div className="space-y-3">
      {notifications.map((notif) => (
        <div key={notif.id} className="bg-white/90 backdrop-blur-md border border-yellow-100 rounded-lg p-2 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-150 group text-sm">
          <div className="flex items-center gap-2">
            <img src={typeof notif.applicant.profileImageUrl === 'string' && notif.applicant.profileImageUrl ? notif.applicant.profileImageUrl : '/default-avatar.png'} alt={notif.applicant.name ?? 'User'} className="w-8 h-8 rounded-full border border-yellow-200 object-cover bg-white" />
            <div>
              <div className="font-semibold text-gray-800 mb-0.5 flex items-center gap-1 text-sm">
                {notif.applicant.name ?? 'User'}
                <span className="inline-block ml-1 px-2 py-0.5 rounded bg-yellow-50 text-yellow-700 text-xs font-semibold">New Applicant</span>
              </div>
              <div className="text-xs text-gray-600 mb-0.5">applied to <span className="font-medium text-orange-600">{notif.Program.title}</span></div>
              <div className="text-xs text-gray-400">{new Date(notif.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/dashboard/artisan/applicants/${notif.id}`} className="text-blue-600 hover:text-blue-800 text-xs font-medium bg-blue-50 px-2 py-1 rounded shadow transition-all duration-150 group-hover:bg-blue-100">
              View
            </Link>
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-800 text-xs font-medium bg-green-50 px-2 py-1 rounded shadow transition-all duration-150 group-hover:bg-green-100"
            >
              Hubungi
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
