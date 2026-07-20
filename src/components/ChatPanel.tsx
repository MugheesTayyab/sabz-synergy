"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Sun, Sparkles, RefreshCw } from "lucide-react";
import { useApp } from "@/context/AppContext";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatPanel() {
  const { isChatOpen, setIsChatOpen, t, language, sizingResult, selectedCity, selectedProvince } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: language === 'ur'
            ? "السلام علیکم! میں آپ کا سبز ساتھی ہوں۔ آپ کے گھر، فارم یا فیکٹری کے لیے سولر، بیٹری اور بچت سے متعلق کسی بھی سوال کا جواب دینے کے لیے حاضر ہوں۔"
            : "Assalam-o-Alaikum! I am Sabz Saathi, your AI Energy Consultant. Ask me anything about solar sizing, NEPRA net metering, Islamic financing, or energy savings for your site in Pakistan!"
        }
      ]);
    }
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  if (!isChatOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query || isStreaming) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsStreaming(true);

    const botMsgId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, { id: botMsgId, role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/agents/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          language,
          context: {
            city: selectedCity,
            province: selectedProvince,
            sizingResult: sizingResult ? {
              systemKW: sizingResult.systemKW,
              annualSavingsPKR: sizingResult.annualSavingsPKR,
              totalCostPKR: sizingResult.totalCostPKR,
              siteType: sizingResult.siteType,
            } : null,
          },
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error("Chat stream connection failed");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let streamedContent = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        // Parse SSE stream output from OpenRouter
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.replace("data: ", "").trim();
            if (dataStr === "[DONE]") break;
            try {
              const parsed = JSON.parse(dataStr);
              const textChunk = parsed.choices?.[0]?.delta?.content || "";
              streamedContent += textChunk;
              setMessages((prev) =>
                prev.map((msg) => (msg.id === botMsgId ? { ...msg, content: streamedContent } : msg))
              );
            } catch {
              // Ignore partial JSON parse errors in stream
            }
          }
        }
      }

      if (!streamedContent) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMsgId
              ? { ...msg, content: language === 'ur' ? "معذرت، رابطہ مکمل نہ ہو سکا۔ آپ کا سوال دوبارہ بھیجیں۔" : "I apologize, I couldn't complete the response. Please try asking again." }
              : msg
          )
        );
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMsgId
            ? { ...msg, content: "I am ready to help! Please ask your question again." }
            : msg
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const chips = [
    t("chip1"),
    t("chip2"),
    t("chip3"),
    t("chip4"),
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-bg-deep/95 backdrop-blur-xl border border-sun-gold/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white animate-fade-up">
      {/* Header */}
      <div className="bg-forest-green/80 px-5 py-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-sun-gold/20 flex items-center justify-center border border-sun-gold/40">
            <Sun className="w-5 h-5 text-sun-gold animate-spin-slow" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-white flex items-center gap-1.5">
              Sabz Saathi (سبز ساتھی)
              <Sparkles className="w-3.5 h-3.5 text-sun-gold" />
            </h3>
            <p className="text-[11px] text-white/70">
              {t("chatSubtitle")} • Powered by OpenRouter AI
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsChatOpen(false)}
          className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-forest-green text-white rounded-br-none"
                  : "bg-white/10 border border-white/10 text-white/90 rounded-bl-none"
              }`}
              style={m.content.match(/[\u0600-\u06FF]/) ? { fontFamily: "Noto Nastaliq Urdu, serif", direction: "rtl" } : {}}
            >
              {m.content || (isStreaming && m.role === "assistant" ? <RefreshCw className="w-4 h-4 animate-spin text-sun-gold" /> : "")}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {chips.map((c, i) => (
            <button
              key={i}
              onClick={() => handleSend(c)}
              className="text-[11px] bg-white/5 border border-sun-gold/20 hover:border-sun-gold text-white/80 hover:text-sun-gold px-2.5 py-1 rounded-full transition-all"
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-black/30 border-t border-white/10 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("chatPlaceholder")}
          className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-sun-gold transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim() || isStreaming}
          className="bg-sun-gold text-bg-deep p-2.5 rounded-xl font-bold hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
