import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PrismaClient } from "../../../../../generated";
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';

const prisma = new PrismaClient();

export default async function ApplicantDashboardPage() {
  // Ambil user dari cookie (misal: cookie 'user')
  const userCookie = cookies().get("user")?.value;
  const user = userCookie ? JSON.parse(userCookie) : null;

  if (!user || user.role !== "APPLICANT") {
    redirect("/login/applicant");
  }

  // Ambil data aplikasi user dari database (contoh: Application)
  const applications = await prisma.application.findMany({
    where: { applicantId: user.id },
    include: { Program: true },
    orderBy: { createdAt: "desc" },
  });

  const totalApplied = applications.length;

  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} onLogout={null /* SSR, handle logout via API */} />
      <MainContent totalApplied={totalApplied} applications={applications} user={user} />
    </div>
  );
}
