"use client";

import { ChevronDown, Play, Sparkles } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function Hero() {
  const { t, setIsChatOpen } = useApp();

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0B1E14 0%, #1A6B3C 100%)",
      }}
    >
      <div className="absolute inset-0 ajrak-pattern opacity-30" />

      <div className="absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-sun-gold/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `pulse-glow ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 grid lg:grid-cols-2 gap-12 items-center w-full">
        <div className="animate-fade-up">
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(2.75rem,6vw,4.5rem)] font-bold text-white leading-tight">
            {t("heroTitle")}
          </h1>
          <p
            className="mt-3 text-sun-gold text-2xl leading-relaxed"
            style={{ fontFamily: "Noto Nastaliq Urdu, serif" }}
            dir="rtl"
          >
            {t("heroUrduSub")}
          </p>
          <p className="mt-6 text-white/80 text-[17px] max-w-xl leading-relaxed">
            {t("heroDesc")}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#calculator"
              className="bg-sun-gold text-bg-deep font-semibold px-7 py-3.5 rounded-lg hover:brightness-110 transition-all hover:scale-[1.02] text-[15px] shadow-lg"
            >
              {t("startTrial")}
            </a>
            <button
              onClick={() => setIsChatOpen(true)}
              className="flex items-center gap-2 border border-white/40 text-white px-6 py-3.5 rounded-lg hover:border-sun-gold transition-colors text-[15px] bg-white/5 backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 text-sun-gold" />
              Ask AI Consultant
            </button>
          </div>
        </div>

        <div className="animate-float hidden lg:block">
          <div className="glass-card rounded-2xl p-6 max-w-md ml-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/60 text-sm">{t("livePreview")}</span>
              <span className="w-2 h-2 rounded-full bg-surplus-green animate-pulse" />
            </div>

            <div className="flex items-center gap-4 mb-5">
              <div className="relative w-20 h-20">
                <svg viewBox="0 0 80 80" className="w-20 h-20 -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="6"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke="#F5A623"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${0.8 * 2 * Math.PI * 34} ${2 * Math.PI * 34}`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-white font-[family-name:var(--font-mono)] text-sm font-medium">
                    145
                  </span>
                  <span className="text-white/50 text-[10px]">kWh</span>
                </div>
              </div>
              <div>
                <p className="text-white text-sm font-medium">{t("todaysSolar")}</p>
                <span className="inline-block mt-1 bg-surplus-green/20 text-surplus-green text-xs px-2 py-0.5 rounded-full">
                  {t("surplus")} +23 kWh
                </span>
              </div>
            </div>

            <div className="flex items-end gap-1 h-16 mb-4">
              {[65, 80, 55, 90, 75, 85, 70].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-sm bg-sun-gold/60"
                    style={{ height: `${h}%` }}
                  />
                  <span className="text-[9px] text-white/40">
                    {["M", "T", "W", "T", "F", "S", "S"][i]}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-white/5 rounded-lg p-3 flex items-center gap-2">
              <span className="text-white/40 text-xs">☁️</span>
              <span className="text-white/70 text-xs">
                Open-Meteo: Clear skies expect +15% solar yield today
              </span>
            </div>
          </div>
        </div>
      </div>

      <a
        href="#trust"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-chevron"
      >
        <ChevronDown className="w-6 h-6 text-white/60" />
      </a>
    </section>
  );
}
