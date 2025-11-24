"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BACKEND_URL } from "@/config";

export default function Rooms() {
  const [slug, setSlug] = useState("");
  const [joining, setJoining] = useState(false);
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleJoin = async () => {
    if (!slug.trim()) return;

    setJoining(true);
    setError(null);

    try {
      const res = await axios.post(
        `${BACKEND_URL}/room/joinroom`,
        {
          slug,
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        router.push(`/rooms/${slug}`);
      }

    } catch (error: any) {
      console.error(error.response?.data?.message);
      setError(error.response?.data?.message || "Something went Wrong");
    } finally{
      setJoining(false);
    }
    
  };

  const goToCreate = () => {
    router.push("/rooms/create");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 px-4">
      <div className="w-full max-w-sm bg-gray-900/60 backdrop-blur-lg border border-gray-700 p-8 rounded-xl shadow-xl">
      
        <h1 className="text-3xl font-semibold text-white text-center mb-6 tracking-tight">
          Join a Room
        </h1>

    
        <div className="space-y-5">
          <div>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              type="text"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Enter the Room ID"
              disabled={joining}
            />
          </div>


          <button
            onClick={handleJoin}
            disabled={!slug.trim() || joining}
            className={`w-full py-2 rounded-lg font-medium transition 
              ${
                joining
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } 
              text-white`}
          >
            {joining ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Joining...</span>
              </div>
            ) : (
              "Join Room"
            )}
          </button>


          <div className="flex items-center gap-3 my-4">
            <div className="h-px bg-gray-700 flex-1"></div>
            <span className="text-gray-500 text-sm">OR</span>
            <div className="h-px bg-gray-700 flex-1"></div>
          </div>


          <button
            onClick={goToCreate}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-medium transition"
            disabled={joining}
          >
            Create New Room
          </button>
        </div>
      </div>
    </div>
  );
}
