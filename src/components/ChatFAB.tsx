"use client";

import { MessageSquare } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function ChatFAB() {
  const { isChatOpen, setIsChatOpen } = useApp();

  if (isChatOpen) return null;

  return (
    <button
      onClick={() => setIsChatOpen(true)}
      className="fixed bottom-6 right-6 z-50 bg-forest-green text-white p-4 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-2 border border-sun-gold/40 group"
      aria-label="Open Energy Advisor"
    >
      <MessageSquare className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
      <span className="hidden sm:inline font-semibold text-sm pr-1">
        Energy Advisor
      </span>
    </button>
  );
}
