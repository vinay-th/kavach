'use client';

// src/components/locale/LanguageToggle.tsx
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import type { Language } from '@/types/call';
import { cn } from '@/lib/utils';

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'gu', label: 'ગુજરાતી' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'en', label: 'English' },
];

interface LanguageToggleProps {
  className?: string;
}

export function LanguageToggle({ className }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1',
        className,
      )}
      role="group"
      aria-label="Select language"
    >
      {LANGUAGES.map(({ code, label }) => {
        const isActive = language === code;
        return (
          <button
            key={code}
            onClick={() => setLanguage(code)}
            className={cn(
              'relative rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400',
              isActive ? 'text-white' : 'text-slate-400 hover:text-white',
            )}
            aria-pressed={isActive}
            aria-label={`Switch to ${label}`}
          >
            {isActive && (
              <motion.span
                layoutId="language-pill"
                className="absolute inset-0 rounded-full bg-white/15"
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative z-10">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
