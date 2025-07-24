"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';

export default function ApplicantDashboardPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const totalApplied = 0;
  const applications = [];

  useEffect(() => {
    // Ambil user dari localStorage (atau sessionStorage)
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.replace("/login/applicant");
    }
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("user");
    router.replace("/login/applicant");
  }

  if (!user) {
    return null; // atau loading spinner
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} onLogout={handleLogout} />
      <MainContent totalApplied={totalApplied} applications={applications} user={user} />
    </div>
  );
}