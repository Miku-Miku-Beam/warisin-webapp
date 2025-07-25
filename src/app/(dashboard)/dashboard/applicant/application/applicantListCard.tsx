
import Link from 'next/link';
// Simple status chip
function StatusChip({ status }: { status: string }) {
  let color = 'bg-gray-200 text-gray-700 border-gray-300';
  if (status === 'pending') color = 'bg-yellow-100 text-yellow-700 border-yellow-200';
  else if (status === 'approved') color = 'bg-green-100 text-green-700 border-green-200';
  else if (status === 'rejected') color = 'bg-red-100 text-red-700 border-red-200';
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${color}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
  );
}


interface Notification {
  id: string;
  createdAt: string | Date;
  status: string;
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
              <div className="flex items-center gap-2 mb-1">
                <div className="text-sm text-gray-600">applied to <span className="font-medium text-orange-600">{notif.Program.title}</span></div>
                {/* {notif.status && <StatusChip status={notif.status} />} */}
              </div>
              <div className="text-xs text-gray-400">{new Date(notif.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApplicantList;
