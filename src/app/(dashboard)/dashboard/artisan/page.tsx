import { getCurrentCookie } from '@/lib/auth';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { redirect } from 'next/navigation';

// This page needs dynamic rendering due to cookie usage
export const dynamic = 'force-dynamic';

function statusBadge(isOpen: boolean) {
  return isOpen
    ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">Active</span>
    : <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">Completed</span>;
}

export default async function ArtisanDashboardPage() {
  // 1. Get current artisan user
  const user = await getCurrentCookie();

  // 2. Fetch programs created by this artisan
  const programs = await prisma.program.findMany({
    where: { artisanId: user.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      isOpen: true,
      createdAt: true,
      applications: true,
    },
  });

  // 3. Fetch latest applicant notifications (applications to artisan's programs)
  const notifications = await prisma.application.findMany({
    where: {
      Program: { artisanId: user.id },
    },
    orderBy: { createdAt: 'desc' },
    take: 3,
    select: {
      id: true,
      createdAt: true,
      applicant: {
        select: {
          name: true,
          profileImageUrl: true,
        },
      },
      Program: {
        select: {
          title: true,
        },
      },
    },
  });

  const totalPrograms = programs.length;
  const activePrograms = programs.filter(p => p.isOpen).length;
  const completedPrograms = programs.filter(p => !p.isOpen).length;

  return (
    <div className="flex h-full min-h-screen  to-white font-sans">
      <main className="flex-1 p-6 max-w-6xl mx-auto">
        {/* Header & Profile */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Welcome, <span className="text-orange-600">{user.name?.split(' ')[0]}</span>!</h1>
            <p className="text-gray-600 text-lg">Manage your artisan profile, programs, and applicants here.</p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-orange-100 p-7 flex flex-col items-center group transition-all duration-200 hover:shadow-2xl">
            <span className="text-3xl font-extrabold text-orange-600 mb-1">{totalPrograms}</span>
            <span className="text-base text-gray-700 font-medium">Total Programs</span>
            <span className="mt-2 text-xs text-gray-400">All programs you have created</span>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-green-100 p-7 flex flex-col items-center group transition-all duration-200 hover:shadow-2xl">
            <span className="text-3xl font-extrabold text-green-600 mb-1">{activePrograms}</span>
            <span className="text-base text-gray-700 font-medium">Active Programs</span>
            <span className="mt-2 text-xs text-gray-400">Programs currently running</span>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-blue-100 p-7 flex flex-col items-center group transition-all duration-200 hover:shadow-2xl">
            <span className="text-3xl font-extrabold text-blue-600 mb-1">{completedPrograms}</span>
            <span className="text-base text-gray-700 font-medium">Completed Programs</span>
            <span className="mt-2 text-xs text-gray-400">Programs that have been completed</span>
          </div>
        </div>

        {/* Latest Applicant Notifications */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">Latest Applicant Notifications</h2>
            <Link href="/dashboard/artisan/programs/applications" className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All</Link>
          </div>
          {notifications.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-md rounded-xl shadow border border-gray-100 p-6 text-center text-gray-500">
              No new applicants yet.
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notif) => (
                <div key={notif.id} className="bg-white/90 backdrop-blur-md border border-yellow-100 rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-150 group">
                  <div className="flex items-center gap-3">
                    <img src={typeof notif.applicant.profileImageUrl === 'string' && notif.applicant.profileImageUrl ? notif.applicant.profileImageUrl : '/default-avatar.png'} alt={notif.applicant.name || 'User'} className="w-10 h-10 rounded-full border-2 border-yellow-200 object-cover bg-white" />
                    <div>
                      <div className="font-semibold text-gray-800 mb-0.5 flex items-center gap-1">
                        {notif.applicant.name}
                        <span className="inline-block ml-1 px-2 py-0.5 rounded bg-yellow-50 text-yellow-700 text-xs font-semibold">New Applicant</span>
                      </div>
                      <div className="text-sm text-gray-600 mb-0.5">applied to <span className="font-medium text-orange-600">{notif.Program.title}</span></div>
                      <div className="text-xs text-gray-400">{new Date(notif.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    </div>
                  </div>
                  <Link href={`/dashboard/artisan/programs/applications/${notif.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium bg-blue-50 px-3 py-1 rounded-lg shadow transition-all duration-150 group-hover:bg-blue-100">
                    View Application
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Add Program Button */}
        <div className="mb-10 flex justify-end">
          <Link href="/dashboard/artisan/programs/add" className="inline-flex items-center px-5 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow hover:bg-orange-600 transition text-base">
            <span className="text-xl mr-2">+</span> Add Program
          </Link>
        </div>

        {/* Latest Programs List */}
        <section className="bg-white/90 backdrop-blur-md rounded-2xl shadow border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Latest Programs</h2>
          {programs.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No programs yet</h3>
              <p className="text-gray-500 mb-4">Create your first program to start regenerating cultural heritage!</p>
              <Link href="/dashboard/artisan/programs/new" className="inline-flex items-center px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition">
                + Add Program
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {programs.slice(0, 5).map((program) => (
                <div key={program.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200 flex items-center justify-between bg-gradient-to-br from-orange-50 via-yellow-50 to-white/80">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
                      {program.title} {statusBadge(program.isOpen)}
                    </h3>
                    <p className="text-sm text-gray-500 mb-1">Applicants: <span className="font-semibold text-orange-700">{program.applications?.length ?? 0}</span></p>
                    <p className="text-xs text-gray-400">Created: {new Date(program.createdAt).toLocaleDateString('en-US')}</p>
                  </div>
                  <Link href={`/dashboard/artisan/programs/${program.id}`} className="text-orange-600 hover:text-orange-800 text-sm font-medium bg-orange-50 px-3 py-1 rounded-lg shadow transition-all duration-150 hover:bg-orange-100">
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

