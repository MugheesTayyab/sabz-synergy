"use client";

import { useState, useEffect } from "react";
import { Menu, X, Sun, Sparkles, Star } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, language, toggleLanguage, setIsChatOpen } = useApp();

  const navLinks = [
    { label: t("home"), href: "#home" },
    { label: `${t("calculator")} ✦`, href: "#calculator", isMain: true },
    { label: t("features"), href: "#features" },
    { label: t("pricing"), href: "#pricing" },
    { label: t("about"), href: "#about" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto w-full px-6 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2">
          <Sun className="w-8 h-8 text-sun-gold animate-spin-slow" />
          <span
            className={`font-[family-name:var(--font-display)] text-xl font-bold ${
              scrolled ? "text-text-dark" : "text-white"
            }`}
          >
            Sabz Synergy
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold transition-colors hover:text-sun-gold relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-sun-gold after:transition-all hover:after:w-full ${
                link.isMain
                  ? scrolled
                    ? "text-forest-green font-bold bg-forest-green/10 px-3 py-1 rounded-full border border-forest-green/20"
                    : "text-sun-gold font-bold bg-sun-gold/20 px-3 py-1 rounded-full border border-sun-gold/40 shadow-sm"
                  : scrolled
                  ? "text-text-mid"
                  : "text-white/80"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className={`text-sm px-3.5 py-1.5 rounded-full border transition-all hover:scale-105 font-medium ${
              scrolled
                ? "border-text-muted text-text-mid hover:border-sun-gold hover:text-forest-green"
                : "border-white/40 text-white/90 hover:border-sun-gold hover:text-sun-gold"
            }`}
          >
            {language === 'en' ? 'اردو / EN' : 'EN / اردو'}
          </button>
          
          <button
            onClick={() => setIsChatOpen(true)}
            className="flex items-center gap-1.5 text-xs bg-sun-gold/20 text-sun-gold border border-sun-gold/40 px-3 py-1.5 rounded-full hover:bg-sun-gold/30 transition-all font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>AI Advisor</span>
          </button>

          <a
            href="#calculator"
            className="bg-forest-green text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:brightness-110 transition-all hover:scale-[1.02]"
          >
            {t("getStarted")}
          </a>
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className={scrolled ? "text-text-dark" : "text-white"} />
          ) : (
            <Menu className={scrolled ? "text-text-dark" : "text-white"} />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-[72px] bg-white z-40 p-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-lg font-medium text-text-dark hover:text-forest-green py-2 border-b border-warm-sand flex items-center justify-between"
            >
              <span>{link.label}</span>
              {link.isMain && <Star className="w-4 h-4 text-sun-gold fill-sun-gold" />}
            </a>
          ))}
          <button
            onClick={toggleLanguage}
            className="text-sm px-4 py-2 rounded-full border border-text-muted text-text-mid w-fit mt-2 font-medium"
          >
            {language === 'en' ? 'اردو / EN' : 'EN / اردو'}
          </button>
          <a
            href="#calculator"
            onClick={() => setMobileOpen(false)}
            className="bg-forest-green text-white text-center font-semibold px-5 py-3 rounded-lg mt-2"
          >
            {t("getStarted")}
          </a>
        </div>
      )}
    </nav>
  );
}
