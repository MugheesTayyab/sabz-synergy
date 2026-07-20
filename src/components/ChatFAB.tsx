"use client";

import { MessageSquare, Sparkles } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function ChatFAB() {
  const { isChatOpen, setIsChatOpen } = useApp();

  if (isChatOpen) return null;

  return (
    <button
      onClick={() => setIsChatOpen(true)}
      className="fixed bottom-6 right-6 z-50 bg-forest-green text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all flex items-center gap-2.5 border-2 border-sun-gold/50 group"
      aria-label="Open Sabz Saathi AI Advisor"
    >
      <div className="relative">
        <MessageSquare className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sun-gold opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-sun-gold"></span>
        </span>
      </div>
      <span className="hidden sm:inline font-semibold text-sm pr-1">
        Ask Sabz AI
      </span>
      <Sparkles className="w-4 h-4 text-sun-gold animate-pulse hidden sm:inline" />
    </button>
  );
}
