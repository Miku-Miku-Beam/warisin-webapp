import Link from 'next/link';

type Program = {
  id: string;
  title?: string;
  category?: { name?: string };
  artisan?: { name?: string };
};

type Application = {
  status: string;
  createdAt: string | Date;
  Program?: Program;
};

type MainContentProps = {
  totalApplied: number;
  applications: Application[];
  user: {
    id: string;
    email: string;
    name: string | null;
    role: string;
  };
};

const MainContent = ({ totalApplied, applications, user }: MainContentProps) => {
  // Function to get status styling
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'APPROVED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Function to get status text in Indonesian
  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Menunggu';
      case 'APPROVED':
        return 'Diterima';
      case 'REJECTED':
        return 'Ditolak';
      case 'COMPLETED':
        return 'Selesai';
      default:
        return status;
    }
  };

  return (
    <div className="flex-1 bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Saya</h1>
        <p className="text-gray-600">Kelola aplikasi program warisan budaya Anda</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Aplikasi</p>
              <p className="text-2xl font-bold text-gray-900">{totalApplied}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Menunggu</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter(app => app.status === 'PENDING').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Diterima</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter(app => app.status === 'APPROVED').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Selesai</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter(app => app.status === 'COMPLETED').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Selamat datang, {user.name?.split(' ')[0] || 'User'}!</h2>
            <p className="text-blue-100 mb-4">
              Temukan program warisan budaya terbaik dan kembangkan keterampilan tradisional Anda.
            </p>
            <Link
              href="/programs"
              className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition duration-200 shadow-md"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Jelajahi Program
            </Link>
          </div>
          <div className="hidden md:block">
            <svg className="w-24 h-24 text-blue-200" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Applications Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Aplikasi Terbaru</h2>
          <Link
            href="/dashboard/applicant/applications"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Lihat Semua
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada aplikasi</h3>
            <p className="text-gray-500 mb-4">Anda belum mendaftar ke program manapun.</p>
            <Link
              href="/programs"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Mulai Mendaftar
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.slice(0, 5).map((app, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      {/* Program Image/Icon */}
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </div>

                      {/* Program Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {app.Program?.title || 'Program Tidak Diketahui'}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          Kategori: {app.Program?.category?.name || 'Tidak ada kategori'}
                        </p>
                        <p className="text-sm text-gray-500 mb-2">
                          Artisan: {app.Program?.artisan?.name || 'Tidak diketahui'}
                        </p>
                        <p className="text-xs text-gray-400">
                          Mendaftar: {new Date(app.createdAt).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(app.status)}`}>
                      {getStatusText(app.status)}
                    </span>

                    {/* Action Button */}
                    <Link
                      href={`/program/${app.Program?.id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Lihat Detail
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainContent;