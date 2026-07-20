"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Sun, Sparkles, RefreshCw, Trash2, MapPin } from "lucide-react";
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
            ? `السلام علیکم! میں آپ کا سبز ساتھی ہوں۔ میں ${selectedCity} (${selectedProvince}) میں آپ کے گھر، فارم یا فیکٹری کے لیے سولر، نیپرا نیٹ میٹرنگ، اور میزان بینک اسلامی فائنانسنگ کی مکمل رہنمائی فراہم کرنے کے لیے حاضر ہوں۔`
            : `Assalam-o-Alaikum! I am Sabz Saathi, your AI Energy Consultant for **${selectedCity}, ${selectedProvince}**. Ask me about solar system sizing, NEPRA net metering rates, Meezan Bank Islamic financing, or battery storage!`
        }
      ]);
    }
  }, [language, selectedCity]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  if (!isChatOpen) return null;

  const handleClearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: "assistant",
        content: language === 'ur'
          ? `گفتگو کو ریسیٹ کر دیا گیا ہے۔ میں ${selectedCity} کے لیے آپ کی کیا مدد کر سکتا ہوں؟`
          : `Chat reset. How can I assist you with solar energy in **${selectedCity}** today?`
      }
    ]);
  };

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
              // Ignore partial JSON parse
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

  const topicChips = [
    { label: `☀️ Solar for 10 Marla in ${selectedCity}`, prompt: `What size solar system and cost for a 10 Marla house in ${selectedCity}?` },
    { label: `🌾 Tubewell Farm Sizing`, prompt: `How much solar capacity is needed to run a 15 HP agricultural tubewell in ${selectedProvince}?` },
    { label: `🕌 Meezan Islamic Finance`, prompt: `Explain Meezan Bank Diminishing Musharakah solar financing terms and monthly payments.` },
    { label: `⚡ NEPRA Net Metering`, prompt: `What are the current NEPRA net metering rules and buyback rate for my area?` },
  ];

  // Helper to format simple markdown (bold, bullets, newlines)
  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, lineIdx) => {
      const formattedLine = line.split(/(\*\*.*?\*\*)/g).map((part, partIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={partIdx} className="text-sun-gold font-bold">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      return (
        <span key={lineIdx} className="block min-h-[1em] mb-1">
          {formattedLine}
        </span>
      );
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[94vw] sm:w-[440px] h-[620px] max-h-[88vh] bg-bg-deep/95 backdrop-blur-xl border border-sun-gold/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white animate-fade-up">
      {/* Header */}
      <div className="bg-forest-green px-5 py-3.5 border-b border-white/10 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-sun-gold/20 flex items-center justify-center border border-sun-gold/40 shadow-inner">
            <Sun className="w-5 h-5 text-sun-gold animate-spin-slow" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-white flex items-center gap-1.5">
              Sabz Saathi (سبز ساتھی)
              <Sparkles className="w-3.5 h-3.5 text-sun-gold animate-pulse" />
            </h3>
            <p className="text-[11px] text-white/70 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-sun-gold" />
              {selectedCity}, {selectedProvince} • Sabz AI Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleClearChat}
            title="Clear Chat"
            className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsChatOpen(false)}
            className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[88%] rounded-2xl px-4 py-3 leading-relaxed shadow-sm ${
                m.role === "user"
                  ? "bg-forest-green text-white rounded-br-none border border-forest-green"
                  : "bg-white/10 border border-white/15 text-white/90 rounded-bl-none"
              }`}
              style={m.content.match(/[\u0600-\u06FF]/) ? { fontFamily: "Noto Nastaliq Urdu, serif", direction: "rtl" } : {}}
            >
              {m.content ? renderFormattedText(m.content) : (isStreaming && m.role === "assistant" ? <RefreshCw className="w-4 h-4 animate-spin text-sun-gold" /> : "")}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Topic Chips */}
      {messages.length <= 3 && (
        <div className="px-3 py-2 bg-black/20 border-t border-white/5 flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
          {topicChips.map((c, i) => (
            <button
              key={i}
              onClick={() => handleSend(c.prompt)}
              className="text-[11px] bg-white/5 border border-sun-gold/25 hover:border-sun-gold text-white/90 hover:text-sun-gold px-2.5 py-1 rounded-full transition-all text-left truncate max-w-full"
            >
              {c.label}
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
        className="p-3 bg-black/40 border-t border-white/10 flex items-center gap-2"
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
          className="bg-sun-gold text-bg-deep p-2.5 rounded-xl font-bold hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center shadow-md"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
