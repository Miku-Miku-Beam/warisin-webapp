'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const buttonClass =
  "bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-6 rounded-xl shadow transition flex items-center gap-2 disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed";
const buttonSecondary =
  "bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-6 rounded-xl shadow transition flex items-center gap-2";

const GetStarted = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    location: "",
    dob: "",
  });
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Ambil user dari localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.replace("/login/applicant");
    }
  }, [router]);

  useEffect(() => {
    // Prefill form jika user sudah punya data
    if (user && step === 2) {
      setForm(f => ({
        ...f,
        name: user.name || "",
        // Bisa tambahkan prefill location/dob jika ada di user
      }));
    }
  }, [user, step]);

  function handleComplete() {
    // Set flag onboarding
    localStorage.setItem("onboarded", "true");
    // Redirect ke dashboard sesuai role
    const role = user?.role || "USER";
    if (role === "USER") {
      router.replace("/dashboard/applicant");
    } else if (role === "ARTISAN") {
      router.replace("/dashboard/artisan");
    } else {
      router.replace("/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white/60 backdrop-blur-md border border-white/30 shadow-lg rounded-2xl p-8 w-full max-w-xl">
        {step === 1 && (
          <>
            <h2 className="text-lg font-semibold mb-4">Welcome, Future Culture Bearer!</h2>
            <p className="mb-8 text-gray-700">
              Complete your profile to begin your journey of finding a maestro and becoming part of preserving a national legacy. A detailed profile will help maestros recognize your passion and potential.
            </p>
            <div className="flex justify-end">
              <button
                className={buttonClass}
                onClick={() => setStep(2)}
              >
                Next <span aria-hidden>→</span>
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <form
            onSubmit={e => {
              e.preventDefault();
              setStep(3);
            }}
          >
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
            <div className="flex justify-between">
              <button
                type="button"
                className={buttonSecondary}
                onClick={() => setStep(1)}
              >
                ← Prev
              </button>
              <button
                type="submit"
                className={buttonClass}
                disabled={!form.name || !form.location || !form.dob}
              >
                Next <span aria-hidden>→</span>
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-4">Profile Completed!</h2>
            <p className="mb-8 text-gray-700">
              Thank you, <b>{form.name}</b>! Your profile is ready. You can now explore maestro opportunities and join the cultural heritage journey.
            </p>
            <button className={buttonClass} onClick={handleComplete}>
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetStarted; 