"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Rooms() {
  const [slug, setSlug] = useState("");
  const router = useRouter();

  const handleJoin = () => {
    if (!slug.trim()) return;
    router.push(`/rooms/${slug}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 px-4">
      <div className="w-full max-w-sm bg-gray-900/60 backdrop-blur-lg border border-gray-700 p-8 rounded-xl shadow-xl">
        <h1 className="text-3xl font-semibold text-white text-center mb-6">
          Join a Room
        </h1>

        <div className="space-y-5">
          <div>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              type="text"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter the Room"
            />
          </div>

          <button
            onClick={handleJoin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition disabled:bg-blue-400"
            disabled={!slug.trim()}
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
}
