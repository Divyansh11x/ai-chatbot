"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

type Message = {
  role: "user" | "assistant";
  text: string;
};

export default function ChatBox() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const [voiceOn, setVoiceOn] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);

  // 🔊 TEXT TO SPEECH
  const speakText = (text: string) => {
    if (!voiceOn) return; // ✅ control added

    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 1;

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

      // ✅ Speak only after typing finished
      if (voiceOn) {
        speakText(fullText);
      }


    } catch (error) {
      console.error(error);
      setChat((prev) => prev.filter((m) => m.text !== "Typing..."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-dvh min-h-dvh w-full flex-col bg-black px-3 py-3 text-white sm:px-5 sm:py-4 lg:px-8">

      {/* TOP BAR */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
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
        className="min-h-0 flex-1 space-y-5 overflow-y-auto rounded-xl border border-gray-700 p-3 shadow-lg sm:p-4"
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
              className={`max-w-[90%] rounded-2xl px-4 py-3 transition-all duration-200 sm:max-w-[75%] md:max-w-[68%] lg:max-w-[60%] ${c.role === "user"
                ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white"
                : "bg-gray-800 text-gray-200"
                }`}
            >
              <div className="prose prose-invert max-w-none break-words">
                <ReactMarkdown
                  components={{
                    p({ children }) {
                      return <>{children}</>;
                    },

                    code({ className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || "");
                      const inline = Boolean(props.inline);

                      if (!inline && match) {
                        return (
                          <SyntaxHighlighter language={match[1]}>
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        );
                      }

                      return (
                        <code className="bg-gray-700 px-1 py-0.5 rounded">
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {c.text}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}

      </div>

      {/* INPUT AREA */}
      <div className="mt-4 flex flex-wrap gap-2 md:flex-nowrap">

        <input
          className="min-w-0 flex-[1_1_260px] rounded-lg border border-gray-700 bg-gray-900 p-3 outline-none focus:ring-2 focus:ring-blue-500"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={loading}
        />

        {/* 🔊 VOICE TOGGLE */}
        <button
          title={voiceOn ? "Voice ON" : "Voice OFF"}
          onClick={() => setVoiceOn(!voiceOn)}
          className={`min-h-12 rounded-lg px-3 py-2 transition-all duration-200 ${voiceOn
              ? "bg-green-600 hover:bg-green-500 shadow-md shadow-green-500/30"
              : "bg-gray-700 hover:bg-gray-600"
            }`}
        >
          {voiceOn ? "🔊" : "🔇"}
        </button>

        {/* 🎤 SPEECH INPUT */}
        <button
          onClick={startListening}
          className={`min-h-12 rounded-lg px-4 py-2 ${listening
            ? "bg-red-600 animate-pulse"
            : "bg-gray-700 hover:bg-gray-600"
            }`}
        >
          🎤
        </button>

        {/* SEND BUTTON */}
        <button
          onClick={() => sendMessage()}
          className="min-h-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 px-5 py-2 transition hover:scale-105"
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}
