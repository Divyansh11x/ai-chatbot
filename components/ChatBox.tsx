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

    recognition.onstart = () => {
      console.log("🎤 Listening...");
      setListening(true);
    };

    recognition.onend = () => {
      console.log("🎤 Stopped");
      setListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);

      // Auto send after voice
      setTimeout(() => {
        sendMessage(transcript);
      }, 500);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech error:", event.error);

      if (event.error === "not-allowed") {
        alert("Please allow microphone access.");
      }

      if (event.error === "no-speech") {
        console.log("No speech detected.");
      }
    };

    recognition.start();
  };

  // 📥 LOAD HISTORY
  useEffect(() => {
    fetch("/api/history")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setChat(data);
      })
      .catch(() => setChat([]));
  }, []);

  // 🔽 AUTO SCROLL
  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [chat]);

  // 🧠 SEND MESSAGE
  const sendMessage = async (inputText?: string) => {
    const finalMessage = inputText || message;

    if (!finalMessage || loading) return;

    setChat(prev => [...prev, { role: "user", text: finalMessage }]);
    setMessage("");
    setLoading(true);

    // typing placeholder
    setChat(prev => [...prev, { role: "assistant", text: "Typing..." }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: finalMessage })
      });

      const data = await res.json();
      const fullText: string = data.reply || "";

      let currentText = "";

      for (let i = 0; i < fullText.length; i++) {
        currentText += fullText[i];
        await new Promise(r => setTimeout(r, 15));

        setChat(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            text: currentText
          };
          return updated;
        });
      }

      // 🔊 SPEAK RESPONSE
      speakText(fullText);

    } catch (error) {
      console.error(error);
      setChat(prev => prev.filter(m => m.text !== "Typing..."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white p-4">

      {/* CHAT AREA */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto space-y-4 p-4 border rounded-lg"
      >
        {chat.map((c, i) => (
          <div
            key={i}
            className={`flex ${c.role === "user" ? "justify-end" : "justify-start"
              }`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-[70%] ${c.role === "user"
                  ? "bg-blue-600"
                  : "bg-gray-800 text-gray-200"
                }`}
            >
              <div className="prose prose-invert max-w-none">
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
          className="flex-1 p-3 rounded-lg bg-gray-900 border border-gray-700 outline-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={loading}
        />

        {/* 🎤 VOICE BUTTON */}
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
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg"
          disabled={loading}
        >
          Send
        </button>

      </div>
    </div>
  );
}