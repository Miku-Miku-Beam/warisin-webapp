"use client";
import { useState } from "react";
import Image from "next/image";
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

const ProgramDetail = ({ program }: ProgramDetailProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="max-w-3xl mx-auto bg-white/80 rounded-xl shadow p-8 mt-8">
      <h1 className="text-3xl font-bold mb-2">{program.title}</h1>
      <div className="flex items-center gap-4 mb-4">
        <Image
          src={program.artisan?.profileImageUrl || "/default-avatar.png"}
          alt={program.artisan?.name || "Artisan"}
          width={64}
          height={64}
          className="w-16 h-16 rounded-full object-cover border"
        />
        <div>
          <div className="font-semibold text-lg">{program.artisan?.name}</div>
          <div className="text-sm text-gray-500">{program.artisan?.bio}</div>
        </div>
      </div>
      <div className="mb-4">
        <span className="inline-block bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold mr-2">
          {program.category?.name}
        </span>
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${program.isOpen ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"}`}>
          {program.isOpen ? "Open" : "Closed"}
        </span>
      </div>
      <p className="mb-4 text-gray-700">{program.description}</p>
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="font-medium">Duration</div>
          <div>{program.duration}</div>
        </div>
        <div>
          <div className="font-medium">Criteria</div>
          <div>{program.criteria}</div>
        </div>
      </div>
      <div className="mb-6">
        <div className="font-medium">Location</div>
        <div>{program.location || "-"}</div>
      </div>
      <button
        className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 ${
          program.isOpen
            ? "bg-yellow-600 text-white hover:bg-yellow-700"
            : "bg-gray-200 text-gray-500 cursor-not-allowed"
        }`}
        disabled={!program.isOpen}
        onClick={() => program.isOpen && setShowModal(true)}
      >
        {program.isOpen ? "Apply for Internship" : "Closed"}
      </button>
      <ModalApplyForm open={showModal} onClose={() => setShowModal(false)} programId={program.id} />
    </div>
  );
};

export default ProgramDetail;