"use client";

import { WS_URL } from "@/config";
import { useEffect, useRef, useState } from "react";

interface MessageClient {
  slug: string;
  initialMessages: any[];
}

export default function MessageClient({
  slug,
  initialMessages,
}: MessageClient) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const wssRef = useRef<WebSocket | null>(null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const sendMessage = () => {
    if (!input.trim()) return;

    if (wssRef.current?.readyState !== WebSocket.OPEN) {
      console.log("ws not ready");
      return;
    }

    wssRef.current.send(
      JSON.stringify({
        type: "chat",
        roomSlug: slug,
        content: input,
      })
    );

    setInput("");
  };

  useEffect(() => {
    const token = localStorage.getItem("wsToken");

    const wss = new WebSocket(`${WS_URL}?token=${token}`);

    wss.onopen = () => {
      wss.send(
        JSON.stringify({
          type: "join",
          roomSlug: slug,
        })
      );
    };

    wss.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log(data);

      if (data.type === "error") {
        setError(data.message);
        alert(data.message);
        return;
      }

      if (data.type === "new-message") {
        setMessages((prev) => [...prev, data.message]);
      }
    };

    wssRef.current = wss;
    inputRef.current?.focus();

    return () => wss.close();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <div className="p-4 border-b border-gray-700 text-xl">Room: {slug}</div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, index) => (
          <div key={index} className="bg-gray-800 p-2 rounded max-w-[70%]">
            {msg.content}
          </div>
        ))}
      </div>

      {error && (
        <div className="text-red-500 bg-red-900/30 p-2 text-center">
          {error}
        </div>
      )}

      <div className="flex p-3 border-t border-gray-700 bg-gray-900">
        <input
          ref={inputRef}
          className="flex-1 bg-gray-800 p-2 rounded-l outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          placeholder="Type a message..."
        />
        <button className="bg-blue-600 px-4 rounded-r" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}
