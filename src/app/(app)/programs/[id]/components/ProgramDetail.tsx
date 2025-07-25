"use client";
import { useState } from "react";
import ModalApplyForm from "./ModalApplyForm";

interface ProgramDetailProps {
  program: {
    id: string;
    title: string;
    description: string;
    duration: string;
    criteria: string;
    isOpen: boolean;
    location?: string;
    programImageUrl?: string;
    artisan?: {
      name?: string;
      bio?: string;
      profileImageUrl?: string;
    };
    category?: {
      name?: string;
    };
  };
}

const fallbackProgram = "/default-program.png";

const ProgramDetail = ({ program }: ProgramDetailProps) => {
  const [showModal, setShowModal] = useState(false);
  const [imgSrc, setImgSrc] = useState(
    program.programImageUrl || fallbackProgram
  );

  return (
    <div className="max-w-3xl mx-auto mt-8">
      {/* Cover Image */}
      <div className="relative w-full h-56 md:h-72 rounded-t-2xl overflow shadow-lg">
        <img
          src={imgSrc}
          alt={program.title}
          className="object-cover w-full h-full"
          onError={() => setImgSrc(fallbackProgram)}
        />

        {/* Profile Picture - Di tengah bawah cover */}
        <div className="absolute -bottom-10 left-1/6 transform -translate-x-1/2 z-20">
          <img
            src={program.artisan?.profileImageUrl || "/default-avatar.png"}
            alt={program.artisan?.name || "Artisan"}
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
          />
        </div>
      </div>

      {/* Card Content */}
      <div className="bg-white/80 shadow-xl p-8 pt-14 flex flex-col relative">
        {/* Header & Artisan */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-extrabold mb-1 text-gray-900">
              {program.title}
            </h1>
            <div className="font-semibold text-lg text-[#F53900] flex items-center justify-center md:justify-start gap-2">
              <svg
                className="w-5 h-5 text-[#ff9000]"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 11c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3z"
                />
              </svg>
              {program.artisan?.name || "-"}
            </div>
            {program.artisan?.bio && (
              <div className="text-sm text-gray-500 mt-1">
                {program.artisan.bio}
              </div>
            )}
          </div>
        </div>
        {/* Divider */}
        <hr className="my-4 border-yellow-200" />
        {/* Status & Category */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
            <svg
              className="w-4 h-4 text-yellow-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 01-8 0"
              />
            </svg>
            {program.category?.name}
          </span>
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
              program.isOpen
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-500"
            }`}>
            {program.isOpen ? (
              <svg
                className="w-4 h-4 text-green-500"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
            {program.isOpen ? "Open" : "Closed"}
          </span>
        </div>
        {/* Deskripsi */}
        <div className="mb-6">
          <p className="text-gray-800 text-base leading-relaxed whitespace-pre-line">
            {program.description}
          </p>
        </div>
        {/* Divider */}
        <hr className=" border-yellow-100" />
        {/* Info Grid */}
        <div className="mb-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-[#F6F6F6] rounded-md p-4 flex flex-col items-center shadow-sm">
            <div className="font-medium text-gray-700 mb-1 flex items-center gap-1">
              <svg
                className="w-5 h-5 text-[#F53900]"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Duration
            </div>
            <div className="text-gray-800 font-semibold">
              {program.duration}
            </div>
          </div>
          <div className="bg-[#F6F6F6] rounded-md p-4 flex flex-col items-center shadow-sm">
            <div className="font-medium text-gray-700 mb-1 flex items-center gap-1">
              <svg
                className="w-5 h-5 text-[#F53900]"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.657 16.657L13.414 12.414a2 2 0 10-2.828 0l-4.243 4.243"
                />
              </svg>
              Location
            </div>
            <div className="text-gray-900 font-semibold">
              {program.location || "-"}
            </div>
          </div>
        </div>
        {/* Criteria Section (full width) */}
        <div className="mb-6">
          <div className="font-medium text-gray-700 mb-1 flex items-center gap-1">
            <svg
              className="w-5 h-5 text-[#F53900]"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Criteria
          </div>
          <div className="text-gray-900 font-semibold whitespace-pre-line bg-[#F6F6F6] rounded-md p-4 mt-1 shadow-sm">
            {program.criteria}
          </div>
        </div>
        {/* Sticky Apply Button (mobile) */}
        <div className="sticky bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-white/90 via-white/60 to-transparent pt-4 pb-2 -mx-8 px-8">
          <button
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ${
              program.isOpen
                ? "bg-yellow-600 text-white hover:bg-yellow-700 active:bg-yellow-800"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!program.isOpen}
            onClick={() => program.isOpen && setShowModal(true)}
            aria-disabled={!program.isOpen}>
            {program.isOpen ? (
              <>
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Apply for Internship
              </>
            ) : (
              <>
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Closed
              </>
            )}
          </button>
        </div>
        <ModalApplyForm
          open={showModal}
          onClose={() => setShowModal(false)}
          programId={program.id}
        />
      </div>
    </div>
  );
};

export default ProgramDetail;
