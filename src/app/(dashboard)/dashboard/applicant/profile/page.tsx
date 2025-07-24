import { getCurrentUser } from '@/lib/auth';
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PrismaClient } from "../../../../../../generated";
import Sidebar from '../components/Sidebar';
import ProfileForm from './ProfileForm';

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

            {/* Card Container - Centered with full width within bounds */}
            <div className="w-full">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <ProfileForm user={safeUser} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}