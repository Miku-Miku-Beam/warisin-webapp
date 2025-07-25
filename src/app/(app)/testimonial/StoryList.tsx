// src/app/(app)/Testimonial/StoryList.tsx
import React from "react";

export default function StoryList({ stories }: { stories: any[] }) {
  if (!stories.length) {
    return <div className="text-center text-gray-500 py-8">No stories yet. Be the first to share!</div>;
  }
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {stories.map((story, idx) => (
        <div key={idx} className="bg-white/90 rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-bold text-red-700">{story.userName || "Anonymous"}</span>
            <span className="text-xs text-gray-400">{new Date(story.createdAt).toLocaleDateString()}</span>
          </div>
          <h3 className="text-lg font-semibold mb-1">{story.title}</h3>
          <p className="text-gray-700">{story.story}</p>
        </div>
      ))}
    </div>
  );
}