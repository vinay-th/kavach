'use client';

// src/context/LanguageContext.tsx
import { createContext, useContext, useState } from 'react';
import type { Language } from '@/types/call';
import type { LocalizedText } from '@/types/analysis';

export interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (text?: LocalizedText | null) => string;
}

const defaultContextValue: LanguageContextValue = {
  language: 'en',
  setLanguage: () => {},
  t: (text?: LocalizedText | null): string => {
    if (!text) return '';
    return text.en || text.hi || text.gu || '';
  },
};

const LanguageContext = createContext<LanguageContextValue>(defaultContextValue);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (text?: LocalizedText | null): string => {
    if (!text) return '';
    return text[language] || text.en || text.hi || text.gu || '';
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  return ctx || defaultContextValue;
}
