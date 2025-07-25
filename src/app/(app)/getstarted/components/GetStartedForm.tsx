"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name?: string;
  location?: string;
  dob?: string;
  role?: string;
}

interface GetStartedFormProps {
  user: User;
}

const buttonClass =
  "bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-6 rounded-xl shadow transition flex items-center gap-2 disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed";
const buttonSecondary =
  "bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-6 rounded-xl shadow transition flex items-center gap-2";

export default function GetStartedForm({ user }: GetStartedFormProps) {
  const [step, setStep] = useState(1);
  const [selectedInterest, setSelectedInterest] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: user.name || "",
    location: user.location || "",
    dob: user.dob || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const interestsList = [
    "Wood Carving",
    "Hand-drawn Batik",
    "Keris & Bladesmithing",
    "Traditional Weaving",
    "Silver Smithing",
    "Pottery & Ceramics",
    "Shadow Puppetry"
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/applicant/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          name: form.name,
          location: form.location,
          dob: form.dob,
          interests: selectedInterest,
        }),
      });
      if (!res.ok) throw new Error("Failed to complete onboarding");
      setStep(4);
      setTimeout(() => {
        if (user.role === "ARTISAN") {
          router.replace("/dashboard/artisan");
        } else {
          router.replace("/dashboard/applicant");
        }
      }, 1200);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf3e7]">
      <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-lg min-h-[600px] flex flex-col px-8 py-8">
        {/* Welcome Text */}
        {step === 1 && (
          <>
            <div className="mb-2 mt-2">
              <div className="text-lg font-bold mb-2">Welcome, Future Culture Bearer!</div>
              <div className="mb-6 text-gray-800">
                Complete your profile to begin your journey of finding a maestro and becoming part of preserving a national legacy. A detailed profile will help maestros recognize your passion and potential.
              </div>
            </div>
            {/* Illustration Centered */}
            <div className="flex-1 flex items-center justify-center">
              <img src="/gamelan-girls.png" alt="Gamelan Girls" className="h-90 w-auto" />
            </div>
            {/* Next Button at Bottom Right */}
            <div className="absolute bottom-6 right-8">
              <button
                className="bg-yellow-700 hover:bg-yellow-800 text-white font-semibold py-2 px-6 rounded-lg shadow transition flex items-center gap-2"
                onClick={() => setStep(2)}
              >
                Next <span aria-hidden>→</span>
              </button>
            </div>
          </>
        )}
        {step === 2 && (
            <form onSubmit={handleSubmit}>
              <h2 className="text-lg font-semibold mb-6">Tell Us About Yourself</h2>
              <div className="mb-4">
                <label className="block font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  className="w-full bg-gray-200 rounded-lg px-4 py-2 mb-2"
                  placeholder="e.g., Fawwaz Human"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1">Location (City & Province/State)</label>
                <input
                  type="text"
                  className="w-full bg-gray-200 rounded-lg px-4 py-2 mb-2"
                  placeholder="e.g., Yogyakarta, Special Region of Yogyakarta"
                  value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                  required
                />
              </div>
              <div className="mb-8">
                <label className="block font-medium mb-1">Date Of Birth</label>
                <input
                  type="date"
                  className="w-full bg-gray-200 rounded-lg px-4 py-2"
                  value={form.dob}
                  onChange={e => setForm({ ...form, dob: e.target.value })}
                  required
                />
              </div>
              {error && <div className="text-red-600 mb-2">{error}</div>}
              <div className="flex justify-between">
                <button
                  type="button"
                  className={buttonSecondary}
                  onClick={() => setStep(1)}
                  disabled={loading}
                >
                  ← Prev
                </button>
                <button
                  type="submit"
                  className={buttonClass}
                  disabled={!form.name || !form.location || !form.dob || loading}
                >
                  {loading ? "Saving..." : <>Next <span aria-hidden>→</span></>}
                </button>
              </div>
            </form>
          )}
          {step === 3 && (
            <div className="flex flex-col md:flex-row h-full">
              {/* Left: Pilihan Interest */}
              <div className="flex-1 flex flex-col justify-center">
                <div className="text-lg font-semibold mb-6">Culture of Interest</div>
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {interestsList.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      className={`rounded-xl px-4 py-6 text-center font-medium border transition
                        ${selectedInterest === interest
                          ? 'bg-orange-500 text-white shadow'
                          : 'bg-orange-50 text-gray-900 hover:bg-orange-100'}
                      `}
                      onClick={() => setSelectedInterest(interest)}
                    >
                      <div className="flex items-center justify-between">
                        <span>{interest}</span>
                        <span className="ml-2">
                          <span className={`inline-block w-5 h-5 rounded-full border-2 ${selectedInterest === interest ? 'border-white bg-orange-400' : 'border-orange-300 bg-white'}`}></span>
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    className={buttonSecondary}
                    onClick={() => setStep(2)}
                  >
                    ← Prev
                  </button>
                  <button
                    type="button"
                    className={buttonClass}
                    onClick={() => setStep(4)}
                    disabled={!selectedInterest}
                  >
                    Next →
                  </button>
                </div>
              </div>
              {/* Right: Ilustrasi & Batik */}
              <div className="hidden md:flex flex-col items-center justify-center w-56 relative">
                <img src="/angklung.png" alt="Angklung" className="w-40 h-auto mx-auto" />
                <div className="absolute inset-y-0 right-0 w-16 bg-repeat-y bg-right" style={{ backgroundImage: "url('/batik-side.png')" }} />
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="text-center">
              <h2 className="text-lg font-semibold mb-4">Profile Completed!</h2>
              <p className="mb-8 text-gray-700">
                Thank you, <b>{form.name}</b>! Your profile is ready. You can now explore maestro opportunities and join the cultural heritage journey.
              </p>
              <button className={buttonClass} disabled>
                Redirecting...
              </button>
            </div>
          )}
        </div>
    </div>
  );
} 