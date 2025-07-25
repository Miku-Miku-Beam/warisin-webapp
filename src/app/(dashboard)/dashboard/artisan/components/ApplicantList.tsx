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

const ApplicantList = ({ notifications }: { notifications: Notification[] }) => {
  return (
    <div className="space-y-4">
      {notifications.map((notif) => (
        <div key={notif.id} className="bg-white/90 backdrop-blur-md border border-yellow-100 rounded-xl p-4 flex items-center justify-between shadow-md hover:shadow-lg transition-all duration-150 group text-base">
          <div className="flex items-center gap-4">
            <img src={typeof notif.applicant.profileImageUrl === 'string' && notif.applicant.profileImageUrl ? notif.applicant.profileImageUrl : '/default-avatar.png'} alt={notif.applicant.name ?? 'User'} className="w-12 h-12 rounded-full border-2 border-yellow-200 object-cover bg-white" />
            <div>
              <div className="font-semibold text-gray-800 mb-1 flex items-center gap-2 text-base">
                {notif.applicant.name ?? 'User'}
                <span className="inline-block ml-2 px-3 py-1 rounded bg-yellow-50 text-yellow-700 text-sm font-semibold">New Applicant</span>
              </div>
              <div className="text-sm text-gray-600 mb-1">applied to <span className="font-medium text-orange-600">{notif.Program.title}</span></div>
              <div className="text-xs text-gray-400">{new Date(notif.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href={`/dashboard/artisan/applicants/${notif.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium bg-blue-50 px-4 py-2 rounded shadow transition-all duration-150 group-hover:bg-blue-100">
              View
            </Link>
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-800 text-sm font-medium bg-green-50 px-4 py-2 rounded shadow transition-all duration-150 group-hover:bg-green-100"
            >
              Hubungi
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApplicantList;
