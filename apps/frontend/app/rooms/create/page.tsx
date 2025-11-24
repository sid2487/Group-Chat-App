"use client";

import { BACKEND_URL } from "@/config";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Create() {
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        `${BACKEND_URL}/room/createroom`,
        { slug, description },
        { withCredentials: true }
      );

      if (res.status === 201) {
        const room = res.data.room;
        router.push(`/rooms/${room.slug}`);
      }
    } catch (error: any) {
      setError(error?.response?.data?.message || "Something went Wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 px-4">
      <div className="w-full max-w-md bg-gray-900/60 backdrop-blur-lg border border-gray-700 p-8 rounded-xl shadow-xl">
        <h1 className="text-3xl font-semibold text-white text-center mb-6">
          Create a Room
        </h1>

        <form onSubmit={handleCreate} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Room Slug
            </label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              type="text"
              placeholder="my-cool-room"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Description
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              type="text"
              placeholder="A room for chatting..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {error && <p className="text-red-500 text-center text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition disabled:bg-blue-400"
          >
            {loading ? "Creating..." : "Create Room"}
          </button>
        </form>
      </div>
    </div>
  );
}
