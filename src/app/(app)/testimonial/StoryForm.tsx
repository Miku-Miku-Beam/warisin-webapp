"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StoryForm() {
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/story", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, story }),
    });
    setLoading(false);
    setTitle("");
    setStory("");
    // SSR: Refresh page to get latest stories
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/80 rounded-xl shadow p-6 mb-8 max-w-xl mx-auto">
      {/* ...input & button sama seperti sebelumnya... */}
    </form>
  );
}