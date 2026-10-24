'use client';

// src/components/shield/WarningBanner.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, AlertTriangle } from 'lucide-react';
import type { Verdict } from '@/types/analysis';
import { useLanguage } from '@/context/LanguageContext';

const BANNER_TEXT = {
  gu: 'સાઇબર ક્રાઇમ હેલ્પલાઇન',
  hi: 'साइबर क्राइम हेल्पलाइन',
  en: 'Cyber Crime Helpline',
};

const SCAM_WARNING = {
  gu: 'સ્ક્રીન પર ચેતવણી — ફોન તરત કાટો!',
  hi: 'स्कैम अलर्ट — फ़ोन तुरंत काटें!',
  en: 'Scam Alert — Hang up immediately!',
};

interface WarningBannerProps {
  verdict: Verdict;
}

export function WarningBanner({ verdict }: WarningBannerProps) {
  const { t } = useLanguage();
  const show = verdict === 'scam' || verdict === 'suspicious';

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="warning-banner"
          role="alert"
          aria-live="assertive"
          className="w-full border-t border-amber-600/40 bg-amber-950/80 backdrop-blur-sm"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
            {/* Left: scam warning */}
            <div className="flex items-center gap-2 text-amber-300">
              <AlertTriangle size={18} aria-hidden="true" />
              <span className="text-base font-bold">
                {t(SCAM_WARNING)}
              </span>
            </div>

            {/* Right: helpline number */}
            <a
              href="tel:1930"
              className="flex items-center gap-2 rounded-full border border-amber-500/50 bg-amber-900/60 px-4 py-2 text-amber-200 transition hover:bg-amber-800/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              aria-label="Call Cyber Crime Helpline 1930"
            >
              <Phone size={16} aria-hidden="true" />
              <span className="text-sm font-bold">
                {t(BANNER_TEXT)}: <strong className="text-lg tracking-wider">1930</strong>
              </span>
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
