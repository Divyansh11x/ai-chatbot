"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Zap, MessageSquareText, ShieldCheck } from "lucide-react";

const features = [
  {
    title: "Fast responses",
    description: "Get answers, drafts, and coding help in a clean chat interface.",
    icon: Zap,
  },
  {
    title: "Context-aware help",
    description: "Ask follow-up questions and keep the conversation moving naturally.",
    icon: MessageSquareText,
  },
  {
    title: "Private workspace",
    description: "Built for focused chats with a simple flow and clear controls.",
    icon: ShieldCheck,
  },
];

export default function Website() {
  const [open, setOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#1d4ed8,_#020617_45%,_#000_100%)] text-white">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 md:px-8">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          AI Chatbot
        </Link>

        <div className="hidden items-center gap-6 text-sm text-white/80 md:flex">
          <a href="#features" className="transition hover:text-white">
            Features
          </a>
          <a href="#about" className="transition hover:text-white">
            About
          </a>
          <a href="#contact" className="transition hover:text-white">
            Contact
          </a>
          <Link
            href="/chat"
            className="rounded-full bg-white px-4 py-2 font-medium text-slate-950 transition hover:bg-blue-100"
          >
            Open Chat
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle navigation"
          className="rounded-full border border-white/15 bg-white/5 p-2 md:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="mx-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur md:hidden">
          <div className="flex flex-col gap-3 text-sm text-white/85">
            <a href="#features" onClick={() => setOpen(false)}>
              Features
            </a>
            <a href="#about" onClick={() => setOpen(false)}>
              About
            </a>
            <a href="#contact" onClick={() => setOpen(false)}>
              Contact
            </a>
            <Link
              href="/chat"
              onClick={() => setOpen(false)}
              className="rounded-full bg-white px-4 py-2 text-center font-medium text-slate-950"
            >
              Open Chat
            </Link>
          </div>
        </div>
      )}

      <section className="mx-auto flex max-w-6xl flex-col items-center px-4 pb-16 pt-16 text-center md:px-8 md:pb-24 md:pt-24">
        <div className="rounded-full border border-blue-300/25 bg-blue-400/10 px-4 py-1 text-sm text-blue-100">
          Next.js AI assistant workspace
        </div>

        <h1 className="mt-8 max-w-4xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
          Smart chatbot support for writing, coding, and everyday questions.
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
          Launch the chat, ask what you need, and keep moving with a responsive AI
          experience built for simple, focused conversations.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/chat"
            className="rounded-full bg-blue-500 px-6 py-3 font-medium text-white transition hover:bg-blue-400"
          >
            Start chatting
          </Link>
          <a
            href="#features"
            className="rounded-full border border-white/15 bg-white/5 px-6 py-3 font-medium text-white transition hover:bg-white/10"
          >
            Explore features
          </a>
        </div>
      </section>

      <section
        id="features"
        className="mx-auto grid max-w-6xl gap-6 px-4 pb-8 md:grid-cols-3 md:px-8"
      >
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <article
              key={feature.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-100">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-xl font-semibold text-white">
                {feature.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {feature.description}
              </p>
            </article>
          );
        })}
      </section>

      <section
        id="about"
        className="mx-auto max-w-4xl px-4 py-16 text-center md:px-8"
      >
        <h2 className="text-3xl font-semibold text-white">About the project</h2>
        <p className="mt-5 text-base leading-7 text-slate-300">
          This project combines Next.js with AI APIs to create a lightweight chat
          experience for brainstorming, coding help, and quick answers.
        </p>
      </section>

      <section
        id="contact"
        className="mx-auto max-w-4xl px-4 pb-20 text-center md:px-8"
      >
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <h2 className="text-3xl font-semibold text-white">Stay in touch</h2>
          <p className="mt-4 text-slate-300">
            Ready to try it? Open the chatbot and start a conversation.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Your email"
              className="min-w-0 rounded-full border border-white/10 bg-slate-950/70 px-5 py-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-400"
            />
            <button
              type="button"
              className="rounded-full bg-white px-6 py-3 font-medium text-slate-950 transition hover:bg-blue-100"
            >
              Send
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
