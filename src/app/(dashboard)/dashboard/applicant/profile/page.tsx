import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PrismaClient } from "../../../../../../generated";
import ProfileForm from './ProfileForm';
import { getCurrentUser } from '@/lib/auth';
import Sidebar from '../components/Sidebar';

const prisma = new PrismaClient();

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "APPLICANT") {
    redirect("/login/applicant");
  }

  // Fetch profile dari database
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { ApplicantProfile: true },
  });

  if (!dbUser) {
    return <div className="container mx-auto py-8 text-red-600">User not found.</div>;
  }

  // Convert nullable string fields to undefined for ProfileForm typing
  const safeUser = {
    ...dbUser,
    name: dbUser.name ?? undefined,
    bio: dbUser.bio ?? undefined,
    location: dbUser.location ?? undefined,
    profileImageUrl: dbUser.profileImageUrl ?? undefined,
    ApplicantProfile: dbUser.ApplicantProfile
      ? {
          ...dbUser.ApplicantProfile,
          background: dbUser.ApplicantProfile.background ?? undefined,
          interests: dbUser.ApplicantProfile.interests ?? undefined,
          portfolioUrl: dbUser.ApplicantProfile.portfolioUrl ?? undefined,
        }
      : undefined,
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
        <ProfileForm user={safeUser} />
      </div>
    </div>
  );
}