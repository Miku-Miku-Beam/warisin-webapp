"use client";
import { useState } from "react";

interface ApplicantProfile {
  background?: string;
  interests?: string;
  portfolioUrl?: string;
}

interface User {
  id: string;
  name?: string;
  bio?: string;
  location?: string;
  profileImageUrl?: string; // tambahkan ini!
  ApplicantProfile?: ApplicantProfile;
}

interface ProfileFormProps {
  user: User;
}

// Contoh opsi background pendidikan/seni
const backgroundOptions = [
  "Seni Rupa",
  "Desain",
  "Antropologi",
  "Sejarah",
  "Teknik",
  "Lainnya",
];

// Contoh opsi minat
const interestOptions = [
  "Batik",
  "Kerajinan Kayu",
  "Tenun",
  "Keramik",
  "Lukis",
  "Musik Tradisional",
  "Lainnya",
];

export default function ProfileForm({ user }: ProfileFormProps) {
  const [form, setForm] = useState({
    name: user.name || "",
    bio: user.bio || "",
    location: user.location || "",
    profileImageUrl: user.profileImageUrl || "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);


  async function uploadImage(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "my_unsigned_preset"); // ganti dengan preset Cloudinary kamu

    const res = await fetch("https://api.cloudinary.com/v1_1/my_cloud_name/image/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.secure_url || null;
  }


  return (
    <form className="w-full space-y-4 bg-white/70 p-8 rounded-xl shadow">
      {form.profileImageUrl && (
        <div className="flex flex-col items-center mb-4">
          <img
            src={form.profileImageUrl}
            alt="Profile"
            className="w-28 h-28 object-cover rounded-full border shadow"
            onError={e => (e.currentTarget.style.display = 'none')}
          />
          <span className="text-xs text-gray-500 mt-1">Foto Profil Saat Ini</span>
        </div>
      )}
      <div>
       
  
     
        <label className="block font-medium mb-1">Name</label>
        <input
          className="w-full bg-gray-100 rounded px-3 py-2"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Bio</label>
        <textarea
          className="w-full bg-gray-100 rounded px-3 py-2"
          value={form.bio}
          onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
          rows={3}
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Location</label>
        <input
          className="w-full bg-gray-100 rounded px-3 py-2"
          value={form.location}
          onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
          required
        />
      </div>
      <button
        type="submit"
        className="bg-yellow-600 text-white px-6 py-2 rounded shadow hover:bg-yellow-700 transition"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save"}
      </button>
      {success && <div className="text-green-600">Profile updated!</div>}
    </form>
  );
}