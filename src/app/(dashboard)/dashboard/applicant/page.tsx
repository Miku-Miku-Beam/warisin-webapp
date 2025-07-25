// src/app/(dashboard)/dashboard/applicant/page.tsx
import Link from "next/link";
import { getCurrentCookie } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

function statusBadge(status: string) {
  switch (status) {
    case "PENDING":
      return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200">Pending</span>;
    case "APPROVED":
      return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">Approved</span>;
    case "COMPLETED":
      return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">Completed</span>;
    case "REJECTED":
      return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">Rejected</span>;
    default:
      return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">{status}</span>;
  }
}

export default async function ApplicantDashboardPage() {
  const user = await getCurrentCookie();
  if (!user || user.role !== "APPLICANT") redirect("/login/applicant");

  // Fetch applications for this applicant
  const applications = await prisma.application.findMany({
    where: { applicantId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      Program: { select: { title: true, programImageUrl: true } },
    },
  });

  const total = applications.length;
  const pending = applications.filter(a => a.status === "PENDING").length;
  const approved = applications.filter(a => a.status === "APPROVED" || a.status === "COMPLETED").length;

  return (
    <div className="flex h-full min-h-screen bg-gradient-to-br to-white font-sans">
      <main className="flex-1 p-6 max-w-6xl mx-auto">
        {/* Header & Profile */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
              Welcome, <span className="text-orange-600">{user.name?.split(" ")[0]}</span>!
            </h1>
            <p className="text-gray-600 text-lg">Manage your applications and profile here.</p>
          </div>
          
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-orange-100 p-7 flex flex-col items-center group transition-all duration-200 hover:shadow-2xl">
            <span className="text-3xl font-extrabold text-orange-600 mb-1">{total}</span>
            <span className="text-base text-gray-700 font-medium">Total Applications</span>
            <span className="mt-2 text-xs text-gray-400">All programs you have applied to</span>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-yellow-100 p-7 flex flex-col items-center group transition-all duration-200 hover:shadow-2xl">
            <span className="text-3xl font-extrabold text-yellow-600 mb-1">{pending}</span>
            <span className="text-base text-gray-700 font-medium">Pending</span>
            <span className="mt-2 text-xs text-gray-400">Awaiting response</span>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-green-100 p-7 flex flex-col items-center group transition-all duration-200 hover:shadow-2xl">
            <span className="text-3xl font-extrabold text-green-600 mb-1">{approved}</span>
            <span className="text-base text-gray-700 font-medium">Approved/Completed</span>
            <span className="mt-2 text-xs text-gray-400">Accepted or finished</span>
          </div>
        </div>

        {/* Recent Applications */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">Recent Applications</h2>
            <Link href="/dashboard/applicant/applications" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
            </Link>
          </div>
          {applications.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-md rounded-xl shadow border border-gray-100 p-6 text-center text-gray-500">
              No applications yet.
            </div>
          ) : (
            <div className="space-y-3">
              {applications.slice(0, 3).map(app => (
                <div key={app.id} className="bg-white/90 backdrop-blur-md border border-yellow-100 rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-150 group">
                  <div className="flex items-center gap-3">
                    <img
                      src={app.Program?.programImageUrl ?? "/default-program.jpg"}
                      alt={app.Program?.title}
                      className="w-10 h-10 rounded-lg border-2 border-yellow-200 object-cover bg-white"
                    />
                    <div>
                      <div className="font-semibold text-gray-800 mb-0.5">{app.Program?.title}</div>
                      <div className="text-xs text-gray-400">{new Date(app.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {statusBadge(app.status)}
                    <Link
                      href={`/dashboard/applicant/applications/${app.id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium bg-blue-50 px-3 py-1 rounded-lg shadow transition-all duration-150 group-hover:bg-blue-100"
                    >
                      View Application
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Add Program Button */}
        <div className="mb-10 flex justify-end">
          <Link
            href="/programs"
            className="inline-flex items-center px-5 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow hover:bg-orange-600 transition text-base"
          >
            <span className="text-xl mr-2">+</span> Find Program
          </Link>
        </div>
      </main>
    </div>
  );
}