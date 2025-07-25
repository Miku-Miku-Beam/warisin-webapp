import { getCurrentCookie } from '@/lib/auth';
import { repositories } from '@/lib/repository';
import { redirect } from "next/navigation";


export default async function ProfilePage() {
  const user = await getCurrentCookie();

  if (!user || user.role !== "APPLICANT") {
    redirect("/login/applicant");
  }

  const userData = await repositories.applicant.getApplicantById(user.userId);

  return (
    <div className="flex min-h-screen">
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
                  <form className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        defaultValue={userData.name}
                        placeholder="Fawwaz Humam"
                        className="w-full px-3 py-2 bg-gray-200 border-0 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location (City & Province/State)
                      </label>
                      <input
                        type="text"
                        defaultValue={userData.location}
                        placeholder="Yogyakarta, Special Region of Yogyakarta"
                        className="w-full px-3 py-2 bg-gray-200 border-0 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>


                    {/* Background */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Background
                      </label>
                      <input
                        type="text"
                        defaultValue={userData.ApplicantProfile?.background}
                        placeholder="Computer Science"
                        className="w-full px-3 py-2 bg-gray-200 border-0 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>

                    {/* Interests */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Interests
                      </label>
                      <div className="relative">
                        <select
                          defaultValue={userData.interests}
                          className="w-full px-3 py-2 bg-gray-200 border-0 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 appearance-none"
                        >
                          <option defaultValue="">Select your interests...</option>
                          <option defaultValue="Indonesian Furniture">
                            Indonesian Furniture
                          </option>
                          <option defaultValue="Traditional Batik">Traditional Batik</option>
                          <option defaultValue="Wood Carving">Wood Carving</option>
                          <option defaultValue="Pottery">Pottery</option>
                          <option defaultValue="Textile Arts">Textile Arts</option>
                          <option defaultValue="Keris Making">Keris Making</option>
                          <option defaultValue="Cultural Heritage">Cultural Heritage</option>
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
                        defaultValue={user.bio}
                        placeholder="I am a final-year Product Design student who fell in love with the detail and philosophy behind the Javanese Keris."
                        rows={3}
                        className="w-full px-3 py-2 bg-gray-200 border-0 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
                      />
                    </div>

                    {/* Portfolio URL */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Portfolio URL (optional)
                      </label>
                      <input
                        type="url"
                        defaultValue={userData.portfolioUrl}
                        placeholder="https://your-portfolio.com"
                        className="w-full px-3 py-2 bg-gray-200 border-0 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                      {/* Action Buttons */}
                      <div className="mt-8">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}