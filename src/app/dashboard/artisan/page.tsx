"use client";
import { useState } from "react";

const Sidebar = ({ user, onLogout }) => (
  <aside className="w-full md:w-64 bg-white h-full border-r px-6 py-8 flex flex-col gap-6">
    <div>
      <h2 className="text-xl font-bold mb-4">Candidate Dashboard</h2>
      <nav className="flex flex-col gap-2">
        <a href="#" className="text-black font-medium">Overview (Applications)</a>
        <a href="#" className="text-gray-700 hover:text-black">Edit Profile</a>
      </nav>
    </div>
    <div className="mt-auto">
      <div className="text-xs text-gray-500 mb-1">Logged in as</div>
      <div className="text-sm font-medium">{user.email}</div>
      <div className="text-sm mb-4">{user.name}</div>
      <button
        className="text-red-500 hover:underline text-sm"
        onClick={onLogout}
      >
        Logout
      </button>
    </div>
  </aside>
);

const MainContent = ({ totalApplied }) => (
  <div className="flex-1 bg-gray-50 min-h-screen p-8">
    <h1 className="text-3xl font-bold mb-6">My Applications</h1>
    <div className="bg-white rounded-xl shadow p-6 mb-8 flex items-center gap-8">
      <div>
        <div className="text-gray-500 text-sm">Total Applied Jobs</div>
        <div className="text-2xl font-bold">{totalApplied}</div>
      </div>
    </div>
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <h2 className="text-xl font-semibold mb-2">Welcome</h2>
      <p className="mb-4 text-gray-700">
        Dapatkan pengalaman bekerja terbaik, silahkan explore loker tersedia.
      </p>
      <a
        href="#"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition"
      >
        Explore Available Jobs
      </a>
    </div>
    <div>
      <h2 className="text-xl font-semibold mb-2">Your Latest Applications</h2>
      <p className="text-gray-500">You haven’t applied to any job yet.</p>
    </div>
  </div>
);

export default function CandidateDashboard() {
  // Dummy user, ganti dengan data user dari auth/session
  const user = {
    email: "mfawwazhumam@students.amikom.ac.id",
    name: "Muhammad Fawwaz Humam",
  };

  // Dummy data, ganti dengan data asli dari backend
  const totalApplied = 0;

  function handleLogout() {
    // Tambahkan logic logout (signOut, redirect, dsb)
    alert("Logout clicked!");
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} onLogout={handleLogout} />
      <MainContent totalApplied={totalApplied} />
    </div>
  );
}