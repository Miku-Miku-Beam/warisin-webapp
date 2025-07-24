"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';

interface ArtisanUser {
  email: string;
  name: string;
  role?: string;
}

export default function ArtisanProfilePage() {
  const [user, setUser] = useState<ArtisanUser | null>(null);
  const [profileData, setProfileData] = useState({
    story: '',
    expertise: '',
    location: '',
    imageUrl: '',
    works: [] as string[]
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newWork, setNewWork] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem("artisan");
    if (userData) {
      const parsedUser = JSON.parse(userData) as ArtisanUser;
      setUser(parsedUser);
    } else {
      router.replace("/login/artisan");
    }
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("artisan");
    router.replace("/login/artisan");
  }

  function handleInputChange(field: string, value: string) {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  }

  function addWork() {
    if (newWork.trim()) {
      setProfileData(prev => ({
        ...prev,
        works: [...prev.works, newWork.trim()]
      }));
      setNewWork('');
    }
  }

  function removeWork(index: number) {
    setProfileData(prev => ({
      ...prev,
      works: prev.works.filter((_, i) => i !== index)
    }));
  }

  function handleSave() {
    // Here you would typically save to backend/database
    console.log('Artisan profile data to save:', profileData);
    setIsEditing(false);
    // You could also update localStorage or make an API call here
  }

  if (!user) {
    return null; // or loading spinner
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - Same as Dashboard */}
      <aside className="w-full md:w-64 bg-white h-full border-r px-6 py-8 flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-bold mb-4">Artisan Dashboard</h2>
          <nav className="flex flex-col gap-2">
            <a href="/dashboard/artisan" className="text-gray-700 hover:text-black transition">Overview (Applications)</a>
            <a href="/dashboard/artisan/profile" className="text-black font-medium">Edit Profile</a>
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Artisan Profile</h1>
          
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Profile Picture Section */}
            <div className="flex items-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {profileData.imageUrl ? (
                    <Image 
                      src={profileData.imageUrl} 
                      alt="Profile" 
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl text-gray-500">🎨</span>
                  )}
                </div>
                <button className="absolute -bottom-1 -right-1 bg-black text-white rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-gray-800 transition">
                  ✏️
                </button>
              </div>
              <div className="ml-6">
                <h2 className="text-xl font-semibold">Edit Image</h2>
                <p className="text-gray-600 text-sm">Upload a new profile picture</p>
              </div>
            </div>

            {/* Profile Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Artisan Name (from user) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Artisan Name
                </label>
                <input
                  type="text"
                  value={user.name || ''}
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg"
                  readOnly
                />
              </div>

              {/* Expertise */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expertise
                </label>
                <input
                  type="text"
                  value={profileData.expertise}
                  onChange={(e) => handleInputChange('expertise', e.target.value)}
                  placeholder="e.g., Traditional Batik Making, Wood Carving, Keris Crafting"
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  readOnly={!isEditing}
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location (City & Province/State)
                </label>
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Yogyakarta, Special Region of Yogyakarta"
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  readOnly={!isEditing}
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Image URL (optional)
                </label>
                <input
                  type="url"
                  value={profileData.imageUrl}
                  onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                  placeholder="https://example.com/your-image.jpg"
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  readOnly={!isEditing}
                />
              </div>
            </div>

            {/* Story - Full Width */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Story
              </label>
              <textarea
                value={profileData.story}
                onChange={(e) => handleInputChange('story', e.target.value)}
                placeholder="Tell us about your journey as an artisan, your passion for traditional crafts, and what drives you to preserve cultural heritage..."
                rows={4}
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                readOnly={!isEditing}
              />
            </div>

            {/* Works/Portfolio */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Works & Portfolio
              </label>
              <div className="space-y-2">
                {profileData.works.map((work, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={work}
                      readOnly
                      className="flex-1 px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg"
                    />
                    {isEditing && (
                      <button
                        onClick={() => removeWork(index)}
                        className="text-red-500 hover:text-red-700 px-2"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                
                {isEditing && (
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="text"
                      value={newWork}
                      onChange={(e) => setNewWork(e.target.value)}
                      placeholder="Add a new work or portfolio piece"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      onKeyPress={(e) => e.key === 'Enter' && addWork()}
                    />
                    <button
                      onClick={addWork}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
