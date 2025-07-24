import { getCurrentCookie, getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { repositories } from '@/lib/repository';
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import MainContent from './components/MainContent';

export default async function ApplicantDashboardPage() {
  // Get current user using our auth utility
  const user = await getCurrentCookie();

  if (!user || user.role !== "APPLICANT") {
    redirect("/login");
  }

  // Get user's applications from database
  const applications = await repositories.application.getApplicationsByApplicant(user.id);

  const totalApplied = applications.length;

  console.log(applications)

  return (
    <MainContent totalApplied={totalApplied} applications={applications} user={user} />
  );
}
