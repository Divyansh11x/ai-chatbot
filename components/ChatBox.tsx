"use client";

import { useState, useEffect, useRef } from "react";

type Message = {
  role: "user" | "assistant";
  text: string;
};

export default function ChatBox() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  // ✅ Load chat history on page load with validation
  useEffect(() => {
    fetch("/api/history")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setChat(data);
        } else {
          console.error("Invalid response:", data);
          setChat([]);
        }
      })
      .catch(err => {
        console.error(err);
        setChat([]);
      });
  }, []);

  // ✅ Auto scroll to bottom when chat updates
  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [chat]);

  const sendMessage = async () => {
    if (!message || loading) return;

    const userMessage = message;
    setChat(prev => [...prev, { role: "user", text: userMessage }]);
    setMessage("");
    setLoading(true);

    // Add assistant typing placeholder immediately
    setChat(prev => [...prev, { role: "assistant", text: "Typing..." }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await res.json();
      const fullText: string = data.reply || "";

      let currentText = "";
      for (let i = 0; i < fullText.length; i++) {
        currentText += fullText[i];
        await new Promise(res => setTimeout(res, 20));

        setChat(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", text: currentText };
          return updated;
        });
      }

    } catch (error) {
      console.error(error);
      // Remove placeholder if request fails
      setChat(prev => prev.filter(m => m.text !== "Typing..."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white p-4">

      {/* Chat Area */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto space-y-4 p-4 border rounded-lg"
      >
        {chat.map((c, i) => (
          <div
            key={i}
            className={`flex ${c.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-[70%] ${
                c.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-200"
              }`}
            >
              {c.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="flex mt-4 gap-2">
        <input
          className="flex-1 p-3 rounded-lg bg-gray-900 border border-gray-700 outline-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg disabled:opacity-50"
          disabled={loading}
        >
          Send
        </button>
      </div>

    </div>
  );
}