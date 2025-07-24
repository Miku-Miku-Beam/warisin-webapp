type MainContentProps = {
  totalApplied: number;
  applications: any[];
  user: {
    id: string;
    email: string;
    name: string | null;
    role: string;
  };
};

const MainContent = ({ totalApplied, applications, user }: MainContentProps) => (
  <div className="flex-1 bg-gray-50 n p-8">
    <h1 className="text-3xl font-bold mb-6">My Applications</h1>
    <div className="bg-white rounded-xl shadow p-6 mb-8 flex items-center gap-8">
      <div>
        <div className="text-gray-500 text-sm">Total Applied Jobs</div>
        <div className="text-2xl font-bold">{totalApplied}</div>
      </div>
    </div>
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <h2 className="text-xl font-semibold mb-2">Welcome, {user.name?.split(' ')[0] || 'User'}</h2>
      <p className="mb-4 text-gray-700">
        Dapatkan pengalaman bekerja terbaik, silahkan explore loker tersedia.
      </p>
      <a
        href="#"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition"
      >
        Explore Available Jobs
      </a>
    </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Your Latest Applications</h2>
        {applications.length === 0 ? (
          <p className="text-gray-500">You haven’t applied to any job yet.</p>
        ) : (
          <ul>
            {applications.map((app, idx) => (
              <li key={idx}>{app.title}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
  export default MainContent;