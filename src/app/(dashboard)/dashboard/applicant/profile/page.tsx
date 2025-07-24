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
    <div className="flex min-h-screen">
      {/* Sidebar - Same as Dashboard */}
      <aside className="w-full md:w-64 bg-white h-full border-r px-6 py-8 flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-bold mb-4">Candidate Dashboard</h2>
          <nav className="flex flex-col gap-2">
            <a
              href="/dashboard/applicant"
              className="text-gray-700 hover:text-black transition"
            >
              Overview (Applications)
            </a>
            <a
              href="/dashboard/applicant/profile"
              className="text-black font-medium"
            >
              Edit Profile
            </a>
          </nav>
        </div>
        <div className="mt-auto">
          <div className="text-xs text-gray-500 mb-1">Logged in as</div>
          <div className="text-sm font-medium">{user.email}</div>
          <div className="text-sm mb-4">{user.name}</div>
          <button
            className="text-red-500 hover:underline text-sm"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Profile Content */}
      <div className="flex-1 bg-gray-50 min-h-screen p-8">
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Profile</h1>

          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Profile Picture Section */}
            <div className="flex items-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-gray-500">👤</span>
                </div>
                <button className="absolute -bottom-1 -right-1 bg-black text-white rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-gray-800 transition">
                  ✏️
                </button>
              </div>
              <div className="ml-6">
                <h2 className="text-xl font-semibold">Edit Image</h2>
                <p className="text-gray-600 text-sm">
                  Upload a new profile picture
                </p>
              </div>
            </div>
          <div className="space-y-8">
            <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

            {/* Profile Form */}
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  placeholder="Fawwaz Humam"
                  className="w-full px-3 py-2 bg-gray-200 border-0 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  readOnly={!isEditing}
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location (City & Province/State)
                </label>
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  placeholder="Yogyakarta, Special Region of Yogyakarta"
                  className="w-full px-3 py-2 bg-gray-200 border-0 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  readOnly={!isEditing}
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Of Birth
                </label>
                <input
                  type="date"
                  value={profileData.dateOfBirth}
                  onChange={(e) =>
                    handleInputChange("dateOfBirth", e.target.value)
                  }
                  className="w-full px-3 py-2 bg-gray-200 border-0 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  readOnly={!isEditing}
                />
              </div>

              {/* Background */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Background
                </label>
                <input
                  type="text"
                  value={profileData.background}
                  onChange={(e) =>
                    handleInputChange("background", e.target.value)
                  }
                  placeholder="Computer Science"
                  className="w-full px-3 py-2 bg-gray-200 border-0 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  readOnly={!isEditing}
                />
              </div>

              {/* Interests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interests
                </label>
                <div className="relative">
                  <select
                    value={profileData.interests}
                    onChange={(e) =>
                      handleInputChange("interests", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-gray-200 border-0 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 appearance-none"
                    disabled={!isEditing}
                  >
                    <option value="">Select your interests...</option>
                    <option value="Indonesian Furniture">
                      Indonesian Furniture
                    </option>
                    <option value="Traditional Batik">Traditional Batik</option>
                    <option value="Wood Carving">Wood Carving</option>
                    <option value="Pottery">Pottery</option>
                    <option value="Textile Arts">Textile Arts</option>
                    <option value="Keris Making">Keris Making</option>
                    <option value="Cultural Heritage">Cultural Heritage</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg
                      className="w-4 h-4 fill-current text-gray-400"
                      viewBox="0 0 20 20"
                    >
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="I am a final-year Product Design student who fell in love with the detail and philosophy behind the Javanese Keris."
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-200 border-0 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
                  readOnly={!isEditing}
                />
              </div>

              {/* Portfolio URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Portfolio URL (optional)
                </label>
                <input
                  type="url"
                  value={profileData.portfolioUrl}
                  onChange={(e) =>
                    handleInputChange("portfolioUrl", e.target.value)
                  }
                  placeholder="https://your-portfolio.com"
                  className="w-full px-3 py-2 bg-gray-200 border-0 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  readOnly={!isEditing}
                />
            {/* Card Container - Centered with full width within bounds */}
            <div className="w-full">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <ProfileForm user={safeUser} />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8">
              <button
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                className="bg-black hover:bg-gray-800 text-white font-medium py-3 px-8 rounded-lg transition"
              >
                {isEditing ? "Submit" : "Edit Profile"}
              </button>
              {isEditing && (
                <button
                  onClick={() => setIsEditing(false)}
                  className="ml-4 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-3 px-8 rounded-lg transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}