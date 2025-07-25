import { applicantRepository } from "@/lib/repository/applicant.repository";
import { userUtils } from "@/lib/repository/user.repository";
import Image from "next/image";
import Link from "next/link";

export default async function ApplicantProfilePage({ params }: { params: { id: string } }) {
  const userId = params.id;
  const profile = await applicantRepository.getApplicantProfile(userId);
  if (!profile) {
    return (
      <div className="p-8 text-center text-gray-500">Applicant profile not found.</div>
    );
  }
  const user = profile.user;
  const avatarUrl = userUtils.getAvatarUrl(user);

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="flex items-center gap-6 mb-8">
        <Image
          src={avatarUrl}
          alt={user.name || user.email}
          width={96}
          height={96}
          className="rounded-full border shadow"
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{user.name || user.email}</h1>
          <div className="text-sm text-gray-500">{user.location}</div>
          <div className="mt-2 text-xs text-gray-400">Joined: {new Date(user.createdAt).toLocaleDateString()}</div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2 text-amber-700">Background</h2>
        <p className="text-gray-700 mb-4">{profile.background || <span className="italic text-gray-400">No background info</span>}</p>
        <h2 className="text-lg font-semibold mb-2 text-amber-700">Interests</h2>
        <p className="text-gray-700 mb-4">{profile.interests || <span className="italic text-gray-400">No interests info</span>}</p>
        {profile.portfolioUrl && (
          <div className="mt-4">
            <span className="font-semibold text-amber-700">Portfolio: </span>
            <Link href={profile.portfolioUrl} target="_blank" className="text-blue-600 underline">{profile.portfolioUrl}</Link>
          </div>
        )}
      </div>
      <div className="flex gap-4 mt-6">
        {user.email && (
          <a
            href={`mailto:${user.email}`}
            className="px-4 py-2 bg-amber-500 text-white rounded shadow hover:bg-amber-600 transition"
          >
            Email
          </a>
        )}
        {user.location && (
          <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded shadow">{user.location}</span>
        )}
      </div>
    </div>
  );
}
