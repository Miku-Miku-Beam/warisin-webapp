"use client";
import { useRef, useState } from "react";

export default function ModalApplyForm({
  open,
  onClose,
  programId,
}: {
  open: boolean;
  onClose: () => void;
  programId: string;
}) {
  const [motivation, setMotivation] = useState("");
  const [message, setMessage] = useState("");
  const [cvLink, setCvLink] = useState("");
  const [cvError, setCvError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setCvError("");
    // Validate link
    if (cvLink && !/^https?:\/\//.test(cvLink)) {
      setCvError("CV/Portfolio link must start with http:// or https://");
      setLoading(false);
      return;
    }

    if (!programId) {
      alert("Program ID is required.");
      setLoading(false);
      return;
    }
    // Prepare FormData
    const formData = new FormData();
    formData.append("programId", programId);
    formData.append("motivation", motivation);
    formData.append("message", message);
    if (cvLink) formData.append("cvFileUrl", cvLink);

    // Send to API
    const res = await fetch("/api/application/apply", {
      method: "POST",
      body: formData,
      credentials: "include",
    });
    setLoading(false);
    if (res.ok) setSuccess(true);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    // dihapus, tidak dipakai
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-all">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-2xl font-bold text-gray-400 hover:text-gray-600 transition"
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-extrabold mb-6 text-yellow-700 text-center tracking-tight">Apply for Internship</h2>
        {success ? (
          <div className="text-green-600 text-center py-8">
            <div className="text-3xl mb-2">🎉</div>
            <div className="font-semibold text-lg mb-2">Application sent!</div>
            <div className="text-sm text-gray-600">We will contact you soon.</div>
            <button
              className="mt-6 bg-yellow-600 text-white px-6 py-2 rounded-xl shadow hover:bg-yellow-700 transition font-semibold"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-medium mb-1">Message <span className="text-red-500">*</span></label>
              <textarea
                className="w-full bg-gray-100 rounded-xl px-3 py-2 border border-gray-200 focus:ring-2 focus:ring-yellow-400 transition min-h-[60px]"
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
                rows={3}
                placeholder="Write a short message to the artisan..."
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Motivation <span className="text-red-500">*</span></label>
              <textarea
                className="w-full bg-gray-100 rounded-xl px-3 py-2 border border-gray-200 focus:ring-2 focus:ring-yellow-400 transition min-h-[80px]"
                value={motivation}
                onChange={e => setMotivation(e.target.value)}
                required
                rows={4}
                placeholder="Why are you interested in this program?"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">CV/Portfolio Link <span className="text-xs text-gray-400">(URL, optional)</span></label>
              <input
                type="text"
                className="w-full bg-gray-100 rounded-xl px-3 py-2 border border-gray-200 focus:ring-2 focus:ring-yellow-400 transition"
                value={cvLink}
                onChange={e => setCvLink(e.target.value)}
                placeholder="https://your-cv-or-portfolio.com"
              />
              {cvError && <div className="text-xs text-red-600 mt-2">{cvError}</div>}
            </div>
            <button
              type="submit"
              className="bg-yellow-600 text-white px-6 py-3 rounded-xl shadow hover:bg-yellow-700 active:bg-yellow-800 transition w-full font-bold text-base tracking-wide disabled:bg-gray-300 disabled:text-gray-400"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Application"}
            </button>
          </form>
        )}
      </div>
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.2s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  );
}