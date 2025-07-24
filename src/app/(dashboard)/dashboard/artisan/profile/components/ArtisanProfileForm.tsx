import {
  artisanRepository,
  type ArtisanProfileDetails,
} from "@/lib/repository/artisan.repository";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";

interface User {
  id: string;
  name: string | null;
  email: string;
  profileImageUrl: string | null;
  location: string | null;
  bio: string | null;
  role: string;
}

interface ArtisanProfileFormProps {
  user: User;
  artisanProfile: ArtisanProfileDetails | null;
  isEditMode: boolean;
}

export default function ArtisanProfileForm({
  user,
  artisanProfile,
  isEditMode,
}: ArtisanProfileFormProps) {
  async function saveProfile(formData: FormData) {
    "use server";

    // Get current user to verify authentication
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "ARTISAN") {
      redirect("/login/artisan");
    }

    const fullName = formData.get("fullName") as string;
    const location = formData.get("location") as string;
    const expertise = formData.get("expertise") as string;
    const bio = formData.get("bio") as string;
    const portfolioUrl = formData.get("portfolioUrl") as string;

    try {
      // Update user basic info
      await prisma.user.update({
        where: { id: currentUser.id },
        data: {
          name: fullName,
          location: location,
          bio: bio,
        },
      });

      // Create or update artisan profile
      if (artisanProfile) {
        await artisanRepository.updateArtisanProfile(currentUser.id, {
          story: bio,
          expertise: expertise,
          location: location,
          works: portfolioUrl ? [portfolioUrl] : [],
        });
      } else {
        await artisanRepository.createArtisanProfile({
          userId: currentUser.id,
          story: bio,
          expertise: expertise,
          location: location,
          works: portfolioUrl ? [portfolioUrl] : [],
        });
      }

      // Redirect to refresh the page with updated data
      redirect("/dashboard/artisan/profile?updated=true");
    } catch (error) {
      console.error("Error saving profile:", error);
      // Could add error handling here
    }
  }

  async function toggleEditMode(formData: FormData) {
    "use server";
    const action = formData.get("action") as string;

    if (action === "edit") {
      // Enable edit mode - redirect with edit parameter
      redirect("/dashboard/artisan/profile?edit=true");
    } else if (action === "cancel") {
      // Cancel edit mode - redirect without edit parameter
      redirect("/dashboard/artisan/profile");
    }
  }

  // Calculate default values
  const defaultName = user?.name || "";
  const defaultLocation = artisanProfile?.location || user?.location || "";
  const defaultBio = artisanProfile?.story || user?.bio || "";
  const defaultExpertise = artisanProfile?.expertise || "";
  const defaultPortfolioUrl = artisanProfile?.works?.[0] || "";

  return (
    <div className="max-w-xl">
      {isEditMode ? (
        // Edit Mode: Show form with save functionality
        <form action={saveProfile} className="space-y-6">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4 relative overflow-hidden">
              {user?.profileImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.profileImageUrl}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200"></div>
              )}
              <button
                type="button"
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm"
              >
                ✏️
              </button>
            </div>
            <span className="text-sm text-gray-600">Edit Image</span>
          </div>

          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              defaultValue={defaultName}
              className="w-full px-4 py-3 border-0 rounded-lg bg-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0"
              placeholder="Dekhsa Afnan"
            />
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Location (City & Province/State)
            </label>
            <input
              type="text"
              id="location"
              name="location"
              defaultValue={defaultLocation}
              className="w-full px-4 py-3 border-0 rounded-lg bg-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0"
              placeholder="Yogyakarta, Special Region of Yogyakarta"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label
              htmlFor="dateOfBirth"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Date Of Birth
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              className="w-full px-4 py-3 border-0 rounded-lg bg-gray-200 text-gray-900 focus:outline-none focus:ring-0"
            />
          </div>

          {/* Expertise */}
          <div>
            <label
              htmlFor="expertise"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Expertise
            </label>
            <div className="relative">
              <select
                id="expertise"
                name="expertise"
                defaultValue={defaultExpertise}
                className="w-full px-4 py-3 border-0 rounded-lg bg-gray-200 text-gray-900 focus:outline-none focus:ring-0 appearance-none"
              >
                <option value="">Select Expertise</option>
                <option value="Batik Tulis">Batik Tulis</option>
                <option value="Batik Cap">Batik Cap</option>
                <option value="Tenun">Tenun</option>
                <option value="Keramik">Keramik</option>
                <option value="Ukir Kayu">Ukir Kayu</option>
                <option value="Anyaman">Anyaman</option>
                <option value="Patung">Patung</option>
                <option value="Wayang">Wayang</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              defaultValue={defaultBio}
              className="w-full px-4 py-3 border-0 rounded-lg bg-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 resize-none"
              placeholder="I am a final-year Product Design student who fell in love with the detail and philosophy behind the Javanese Keris."
            />
          </div>

          {/* Portfolio URL */}
          <div>
            <label
              htmlFor="portfolioUrl"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Portofolio URL (optional)
            </label>
            <input
              type="url"
              id="portfolioUrl"
              name="portfolioUrl"
              defaultValue={defaultPortfolioUrl}
              className="w-full px-4 py-3 border-0 rounded-lg bg-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0"
              placeholder="https://your-portfolio.com"
            />
          </div>

          {/* Edit Mode Buttons */}
          <div className="pt-6 flex gap-4">
            <Link
              href="/dashboard/artisan/profile"
              className="flex-1 bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors text-center"
            >
              Clear Edit
            </Link>
            <button
              type="submit"
              className="flex-1 bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      ) : (
        // View Mode: Show disabled form with edit button
        <div className="space-y-6">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4 relative overflow-hidden">
              {user?.profileImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.profileImageUrl}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200"></div>
              )}
              <button
                type="button"
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm opacity-50 cursor-not-allowed"
                disabled
              >
                ✏️
              </button>
            </div>
            <span className="text-sm text-gray-600">Edit Image</span>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <div className="w-full px-4 py-3 border-0 rounded-lg bg-gray-200 text-gray-900">
              {defaultName || "Dekhsa Afnan"}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location (City & Province/State)
            </label>
            <div className="w-full px-4 py-3 border-0 rounded-lg bg-gray-200 text-gray-900">
              {defaultLocation || "Yogyakarta, Special Region of Yogyakarta"}
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Of Birth
            </label>
            <div className="w-full px-4 py-3 border-0 rounded-lg bg-gray-200 text-gray-900">
              14/06/2025
            </div>
          </div>

          {/* Expertise */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expertise
            </label>
            <div className="relative">
              <div className="w-full px-4 py-3 border-0 rounded-lg bg-gray-200 text-gray-900">
                {defaultExpertise || "Batik Tulis"}
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <div className="w-full px-4 py-3 border-0 rounded-lg bg-gray-200 text-gray-900 min-h-[100px]">
              {defaultBio || "I am a final-year Product Design student who fell in love with the detail and philosophy behind the Javanese Keris."}
            </div>
          </div>

          {/* Portfolio URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Portofolio URL (optional)
            </label>
            <div className="w-full px-4 py-3 border-0 rounded-lg bg-gray-200 text-gray-900">
              {defaultPortfolioUrl || ""}
            </div>
          </div>

          {/* View Mode Button */}
          <div className="pt-6">
            <form action={toggleEditMode}>
              <input type="hidden" name="action" value="edit" />
              <button
                type="submit"
                className="w-[30%] bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors"
              >
                Edit Profile
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
