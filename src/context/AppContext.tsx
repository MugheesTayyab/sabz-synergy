"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { i18n, Language } from '@/lib/i18n';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof typeof i18n['en']) => string;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedProvince: string;
  setSelectedProvince: (province: string) => void;
  sizingResult: any;
  setSizingResult: (res: any) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;
  isMicrogridModalOpen: boolean;
  setIsMicrogridModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [selectedCity, setSelectedCity] = useState<string>('Multan');
  const [selectedProvince, setSelectedProvince] = useState<string>('Punjab');
  const [sizingResult, setSizingResult] = useState<any>(null);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isMicrogridModalOpen, setIsMicrogridModalOpen] = useState<boolean>(false);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'ur' : 'en'));
  };

  const t = (key: keyof typeof i18n['en']): string => {
    return i18n[language][key] || i18n['en'][key] || key;
  };

  useEffect(() => {
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        selectedCity,
        setSelectedCity,
        selectedProvince,
        setSelectedProvince,
        sizingResult,
        setSizingResult,
        isChatOpen,
        setIsChatOpen,
        isReportModalOpen,
        setIsReportModalOpen,
        isMicrogridModalOpen,
        setIsMicrogridModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
