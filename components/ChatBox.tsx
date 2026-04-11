"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

type Message = {
  role: "user" | "assistant";
  text: string;
};

export default function ChatBox() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);

  // 🔊 TEXT TO SPEECH
  const speakText = (text: string) => {
    if (!("speechSynthesis" in window)) return;

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
  };

  // 🎤 SPEECH TO TEXT
  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported. Use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);

      setTimeout(() => {
        sendMessage(transcript);
      }, 500);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech error:", event.error);

      if (event.error === "not-allowed") {
        alert("Please allow microphone access.");
      }
    };

    recognition.start();
  };

  // 🗑️ CLEAR CHAT (WITH CONFIRMATION POPUP)
  const clearChat = async () => {
    if (!confirm("Are you sure you want to delete all chats?")) return;

    try {
      await fetch("/api/clear", {
        method: "DELETE",
      });

      setChat([]);
    } catch (error) {
      console.error("Clear failed", error);
    }
  };

  // 📥 LOAD HISTORY
  useEffect(() => {
    fetch("/api/history")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setChat(data);
      })
      .catch(() => setChat([]));
  }, []);

  // 🔽 AUTO SCROLL
  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chat]);

  // 🧠 SEND MESSAGE
  const sendMessage = async (inputText?: string) => {
    const finalMessage = inputText || message;

    if (!finalMessage || loading) return;

    setChat((prev) => [
      ...prev,
      { role: "user", text: finalMessage },
      { role: "assistant", text: "Typing..." },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: finalMessage }),
      });

      const data = await res.json();
      const fullText: string = data.reply || "";

      let currentText = "";

      for (let i = 0; i < fullText.length; i++) {
        currentText += fullText[i];
        await new Promise((r) => setTimeout(r, 15));

        setChat((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            text: currentText,
          };
          return updated;
        });
      }

      speakText(fullText);
    } catch (error) {
      console.error(error);
      setChat((prev) => prev.filter((m) => m.text !== "Typing..."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white p-4">

      {/* TOP BAR */}
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-xl font-bold tracking-wide">
          🤖 AI Chatbot
        </h1>

        <button
          onClick={clearChat}
          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-sm"
        >
          Clear Chat
        </button>
      </div>

      {/* CHAT AREA */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto space-y-5 p-4 border border-gray-700 rounded-xl shadow-lg"
      >

        {/* Empty state */}
        {chat.length === 0 && (
          <div className="flex flex-col items-center justify-center text-gray-500 mt-20 space-y-2">
            <p className="text-lg">Start a conversation 👇</p>
            <p className="text-sm opacity-70">Type or use 🎤 voice</p>
          </div>
        )}

        {/* Messages */}
        {chat.map((c, i) => (
          <div
            key={i}
            className={`flex ${c.role === "user" ? "justify-end" : "justify-start"
              }`}
          >
            <div
              className={`px-5 py-3 rounded-2xl max-w-[60%] transition-all duration-200 ${c.role === "user"
                  ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white"
                  : "bg-gray-800 text-gray-200"
                }`}
            >
              <div className="prose prose-invert max-w-none break-words">
                <ReactMarkdown>
                  {c.text}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}

      </div>

      {/* INPUT AREA */}
      <div className="flex mt-4 gap-2">

        <input
          className="flex-1 p-3 rounded-lg bg-gray-900 border border-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={loading}
        />

        {/* VOICE BUTTON */}
        <button
          onClick={startListening}
          className={`px-4 py-2 rounded-lg ${listening
            ? "bg-red-600 animate-pulse"
            : "bg-gray-700 hover:bg-gray-600"
            }`}
        >
          🎤
        </button>

        <button
          onClick={() => sendMessage()}
          className="bg-gradient-to-r from-blue-500 to-blue-700 hover:scale-105 transition px-5 py-2 rounded-lg"
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}