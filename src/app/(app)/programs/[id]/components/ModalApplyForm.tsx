"use client";
import { useState } from "react";

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
  const [cvUrl, setCvUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    // Ganti endpoint sesuai API apply-mu
    const res = await fetch("/api/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ programId, motivation, message, cvUrl }),
      credentials: "include", // Penting!
    });
    setLoading(false);
    if (res.ok) setSuccess(true);
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
        <h2 className="text-xl font-bold mb-4 text-yellow-700">Apply for Internship</h2>
        {success ? (
          <div className="text-green-600 text-center py-8">
            <div className="text-2xl mb-2">🎉</div>
            Application sent!<br />
            We will contact you soon.
            <button
              className="mt-6 bg-yellow-600 text-white px-6 py-2 rounded shadow hover:bg-yellow-700 transition"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Message <span className="text-red-500">*</span></label>
              <textarea
                className="w-full bg-gray-100 rounded px-3 py-2"
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
                className="w-full bg-gray-100 rounded px-3 py-2"
                value={motivation}
                onChange={e => setMotivation(e.target.value)}
                required
                rows={4}
                placeholder="Why are you interested in this program?"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">CV/Portfolio URL <span className="text-xs text-gray-400">(optional)</span></label>
              <input
                className="w-full bg-gray-100 rounded px-3 py-2"
                value={cvUrl}
                onChange={e => setCvUrl(e.target.value)}
                placeholder="https://your-cv-link.com"
                type="url"
              />
            </div>
            <button
              type="submit"
              className="bg-yellow-600 text-white px-6 py-2 rounded shadow hover:bg-yellow-700 transition w-full"
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