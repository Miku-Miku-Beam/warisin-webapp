"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { clientAuth } from "@/lib/firebase/client";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const provider = new GoogleAuthProvider();

  async function signInWithGoogle() {
    setLoading(true);
    try {
      const userCredential = await signInWithPopup(clientAuth, provider);
      const user = {
        email: userCredential.user.email,
        name: userCredential.user.displayName,
        role: "ARTISAN", // atau ambil dari backend jika ada
      };

      // Simpan user ke localStorage
      localStorage.setItem("artisan", JSON.stringify(user));

      // Cek apakah user sudah onboarding/get started
      const onboarded = localStorage.getItem("onboarded");

      if (!onboarded) {
        // Jika belum onboarding, redirect ke getstarted
        router.replace("/getstarted");
      } else {
        // Jika sudah, redirect ke dashboard sesuai role
        if (user.role === "USER") {
          router.replace("/dashboard/applicant");
        } else if (user.role === "ARTISAN") {
          router.replace("/dashboard/artisan");
        } else {
          router.replace("/dashboard");
        }
      }
    } catch (error) {
      console.error('Error signing in:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-slate-50 backdrop-blur-md border border-white/30 shadow-lg rounded-2xl p-8 w-full max-w-sm flex flex-col items-center">
        <h2 className="text-xl font-semibold mb-8">Selamat Datang</h2>
        <button
          className="flex items-center gap-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-6 rounded-xl shadow transition w-full justify-center disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed"
          onClick={signInWithGoogle}
          disabled={loading}
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
          {loading ? 'Loading...' : 'Login with Google'}
        </button>
      </div>
    </div>
  );
}