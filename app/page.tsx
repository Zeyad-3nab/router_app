"use client";

import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setChat((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...chat, userMessage] }),
      });

      const data = await res.json();

      if (data.reply) {
        setChat((prev) => [...prev, { role: "ai", content: data.reply.content }]);
      } else if (data.error) {
        setChat((prev) => [...prev, { role: "ai", content: "Error: " + data.error }]);
      }
    } catch (err) {
      setChat((prev) => [...prev, { role: "ai", content: "Error sending message" }]);
    } finally {
      setInput("");
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Chat with Free AI</h1>

      <div className="border rounded p-4 h-96 overflow-y-auto mb-4 bg-gray-50">
        {chat.map((msg, idx) => (
          <div key={idx} className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}>
            <span className={`inline-block px-3 py-1 rounded ${
              msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}>
              {msg.content}
            </span>
          </div>
        ))}
        {loading && <div className="text-gray-500">AI is typing...</div>}
        
        <div ref={chatEndRef}></div>
      </div>

      <textarea className="w-full border rounded p-2 mb-2" rows={2} value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
      />

      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={sendMessage} disabled={loading}>
        Send
      </button>
    </main>
  );
}
