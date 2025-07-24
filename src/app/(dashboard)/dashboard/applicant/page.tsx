import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from "next/navigation";
import MainContent from './components/MainContent';
import Sidebar from './components/Sidebar';

export default async function ApplicantDashboardPage() {
  // Get current user using our auth utility
  const user = await getCurrentUser();

  if (!user || user.role !== "APPLICANT") {
    redirect("/login");
  }

  // Get user's applications from database
  const applications = await prisma.application.findMany({
    where: { applicantId: user.id },
    include: { Program: true },
    orderBy: { createdAt: "desc" },
  });

  const totalApplied = applications.length;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <MainContent totalApplied={totalApplied} applications={applications} user={user} />
    </div>
  );
}
