// src/app/components/Navbar.tsx
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-6 py-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg mt-4 mx-auto max-w-7xl">
      {/* Logo */}
      <div className="text-2xl font-bold text-red-700 ml-2">HeritagesIDN</div>

      {/* Search Bar */}
      <div className="flex-1 flex justify-center mx-6">
        <div className="relative w-full max-w-xl">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-200 focus:bg-white focus:ring-2 focus:ring-orange-400 transition outline-none text-gray-700"
            style={{ minWidth: 300 }}
          />
        </div>
      </div>

      {/* Menu */}
      <div className="flex items-center gap-6 mr-2">
        <Link href="/artists" className="text-gray-700 font-medium hover:text-orange-600 transition">The Artists</Link>
        <Link href="/internship" className="text-gray-700 font-medium hover:text-orange-600 transition">Internship</Link>
        <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 shadow hover:bg-gray-100 transition font-medium">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
          <span className="text-gray-700">Sign-In</span>
        </button>
      </div>
    </nav>
  );
}