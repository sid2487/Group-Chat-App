"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { MessageCircle, Users } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex flex-col items-center justify-center px-6 md:px-12">
      {/* Glow background */}
      <div className="absolute inset-0 flex justify-center items-center -z-10">
        <div className="w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[150px]" />
      </div>

      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-2xl"
      >
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          Welcome to ChatterBox
        </motion.h1>

        <motion.p
          className="text-gray-300 text-lg md:text-xl mt-4 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          A modern, fast, real-time chat application where conversations feel
          alive. Join rooms, create your own spaces, and chat with anyone —
          instantly.
        </motion.p>
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4 mt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <button
          onClick={() => router.push("/login")}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg font-medium shadow-lg shadow-blue-600/20 transition"
        >
          Login
        </button>

        <button
          onClick={() => router.push("/rooms")}
          className="px-8 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white rounded-lg text-lg font-medium transition"
        >
          Enter App
        </button>
      </motion.div>

      {/* Features Section */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-20 max-w-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        {/* Feature 1 */}
        <div className="bg-gray-900/40 p-6 rounded-xl border border-gray-700 backdrop-blur-md shadow-lg hover:scale-[1.02] transition">
          <MessageCircle className="h-10 w-10 text-blue-400" />
          <h3 className="text-xl font-semibold mt-3">Real-time Messaging</h3>
          <p className="text-gray-400 mt-2">
            Lightning-fast WebSocket powered chat with instant updates.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="bg-gray-900/40 p-6 rounded-xl border border-gray-700 backdrop-blur-md shadow-lg hover:scale-[1.02] transition">
          <Users className="h-10 w-10 text-purple-400" />
          <h3 className="text-xl font-semibold mt-3">Create & Join Rooms</h3>
          <p className="text-gray-400 mt-2">
            Build private or public chat rooms and bring people together.
          </p>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.p
        className="text-gray-500 text-sm mt-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.7 }}
      >
        Built with ❤️ using Next.js, Prisma, WebSockets & TurboRepo
      </motion.p>
    </div>
  );
}
