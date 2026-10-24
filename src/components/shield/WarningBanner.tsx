'use client';

// src/components/shield/WarningBanner.tsx
import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, AlertTriangle, PhoneOff } from 'lucide-react';
import type { Verdict, LocalizedText } from '@/types/analysis';
import { useLanguage } from '@/context/LanguageContext';

const BANNER_TEXT: LocalizedText = {
  gu: 'સાઇબર ક્રાઇમ હેલ્પલાઇન',
  hi: 'साइबर क्राइम हेल्पलाइन',
  en: 'Cyber Crime Helpline',
};

const SCAM_WARNING: LocalizedText = {
  gu: 'સ્ક્રીન પર ચેતવણી — ફોન તરત કાટો!',
  hi: 'स्कैम अलर्ट — फ़ोन तुरंत काटें!',
  en: 'Scam Alert — Hang up immediately!',
};

interface WarningBannerProps {
  verdict: Verdict;
  onHangUp?: () => void;
  explanation?: LocalizedText;
}

export function WarningBanner({ verdict, onHangUp, explanation }: WarningBannerProps) {
  const { t } = useLanguage();
  const show = verdict === 'scam' || verdict === 'suspicious';
  const hangUpButtonRef = useRef<HTMLButtonElement | null>(null);

  // Focus the Hang Up emergency button when warning becomes active
  useEffect(() => {
    if (show && hangUpButtonRef.current) {
      hangUpButtonRef.current.focus();
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="warning-banner"
          role="alert"
          aria-live="assertive"
          className="w-full border-t border-red-600/50 bg-[#880d09]/95 text-white backdrop-blur-md shadow-2xl fixed bottom-0 left-0 z-50"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-3.5">
            {/* Left: scam warning & explanation */}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
                <AlertTriangle size={20} aria-hidden="true" />
              </div>
              <div>
                <span className="text-sm md:text-base font-bold block" data-testid="warning-headline">
                  {t(SCAM_WARNING)}
                </span>
                {explanation && (
                  <span className="text-xs text-white/90 font-medium block mt-0.5" data-testid="warning-explanation">
                    {t(explanation)}
                  </span>
                )}
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              {onHangUp && (
                <button
                  ref={hangUpButtonRef}
                  type="button"
                  onClick={onHangUp}
                  className="flex items-center gap-2 rounded-xl bg-white text-[#b7140f] px-4 py-2 text-sm font-bold shadow-md hover:bg-stone-100 transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white"
                  data-testid="hang-up-button"
                >
                  <PhoneOff size={16} aria-hidden="true" />
                  <span>Hang Up Now</span>
                </button>
              )}

              <a
                href="tel:1930"
                className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Call Cyber Crime Helpline 1930"
              >
                <Phone size={15} aria-hidden="true" />
                <span className="text-xs sm:text-sm font-semibold">
                  {t(BANNER_TEXT)}: <strong className="font-mono text-sm tracking-wide">1930</strong>
                </span>
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
