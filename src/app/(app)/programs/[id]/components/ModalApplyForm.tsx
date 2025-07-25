"use client";
import { useState, useRef } from "react";

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
  const [cvFile, setCvFile] = useState<File | null>(null);
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
    // Validate file again before submit
    if (cvFile) {
      const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (!allowed.includes(cvFile.type)) {
        setCvError("Only PDF or DOCX files are allowed.");
        setLoading(false);
        return;
      }
      if (cvFile.size > 10 * 1024 * 1024) {
        setCvError("File size max 10MB.");
        setLoading(false);
        return;
      }
    }
    // Prepare FormData
    const formData = new FormData();
    formData.append("programId", programId);
    formData.append("motivation", motivation);
    formData.append("message", message);
    if (cvFile) formData.append("cv", cvFile);
    // Send to API
    const res = await fetch("/api/apply", {
      method: "POST",
      body: formData,
      credentials: "include",
    });
    setLoading(false);
    if (res.ok) setSuccess(true);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCvError("");
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(file.type)) {
      setCvError("Only PDF or DOCX files are allowed.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setCvError("File size max 10MB.");
      return;
    }
    setCvFile(file);
  }

  function handleRemoveFile() {
    setCvFile(null);
    setCvError("");
  }

  function handleDragOver(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }
  function handleDragLeave(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }
  function handleDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const fakeEvent = { target: { files: e.dataTransfer.files } } as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(fakeEvent);
    }
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
              <label className="block font-medium mb-1">CV/Portfolio <span className="text-xs text-gray-400">(PDF/DOCX, max 10MB, optional)</span></label>
              <label
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl px-4 py-6 cursor-pointer transition-all ${dragActive ? "border-yellow-500 bg-yellow-50" : "border-gray-200 bg-gray-50 hover:border-yellow-400"}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                tabIndex={0}
                htmlFor="cv-upload"
              >
                <input
                  ref={fileInputRef}
                  id="cv-upload"
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-2">
                  <svg className="w-10 h-10 text-yellow-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4a2 2 0 012-2h6a2 2 0 012 2v12M7 16l-2 2m0 0l2 2m-2-2h12" /></svg>
                  <span className="text-sm text-gray-600 font-medium">Drag & drop or <span className="text-yellow-700 underline">browse</span> file</span>
                  <span className="text-xs text-gray-400">PDF/DOCX, max 10MB</span>
                </div>
                {cvFile && (
                  <div className="mt-3 flex items-center gap-2 bg-yellow-50 rounded px-3 py-2 w-full">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4a2 2 0 012-2h6a2 2 0 012 2v12M7 16l-2 2m0 0l2 2m-2-2h12" /></svg>
                    <span className="truncate flex-1 text-xs text-gray-700">{cvFile.name}</span>
                    <button type="button" onClick={handleRemoveFile} className="text-xs text-red-500 hover:underline ml-2">Remove</button>
                  </div>
                )}
                {cvError && <div className="text-xs text-red-600 mt-2">{cvError}</div>}
              </label>
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