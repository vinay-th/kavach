'use client';

// src/components/shield/ElderExplanation.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import type { LocalizedText, Verdict } from '@/types/analysis';
import { cn } from '@/lib/utils';

const BG: Record<Verdict, string> = {
  safe: 'bg-emerald-950/40 border-emerald-800/40',
  suspicious: 'bg-amber-950/40 border-amber-800/40',
  scam: 'bg-red-950/50 border-red-700/50',
};

const HEADING: Record<Verdict, { gu: string; hi: string; en: string }> = {
  safe: { gu: 'સ્ટેટસ', hi: 'स्थिति', en: 'Status' },
  suspicious: { gu: 'ચેતવણી', hi: 'चेतावनी', en: 'Warning' },
  scam: { gu: 'છેતરપિંડી!', hi: 'धोखाधड़ी!', en: 'Fraud Alert!' },
};

interface ElderExplanationProps {
  explanation?: LocalizedText | null;
  recommendedAction?: LocalizedText | null;
  verdict?: Verdict;
  className?: string;
}

export function ElderExplanation({
  explanation,
  recommendedAction,
  verdict = 'safe',
  className,
}: ElderExplanationProps) {
  const { t, language = 'en' } = useLanguage();
  const safeVerdict: Verdict =
    verdict && verdict in HEADING ? verdict : 'safe';
  const headingObj = HEADING[safeVerdict] || HEADING.safe;
  const heading = headingObj[language] || headingObj.en;
  const bgClass = BG[safeVerdict] || BG.safe;

  const defaultExplanation: LocalizedText = {
    gu: 'કૉલ શરૂ કરવા "Start Call Simulation" પર ક્લિક કરો. કવચ આપમેળે સ્કેમ ઓળખશે.',
    hi: 'कॉल शुरू करने के लिए "Start Call Simulation" पर क्लिक करें। कवच अपने-आप फ्रॉड पहचानेगा।',
    en: 'Click "Start Call Simulation" to test. Kavach will analyze the call stream in real time.',
  };

  const defaultAction: LocalizedText = {
    gu: 'ધ્યાનથી સાંભળો, ગભરાટ ન અનુભવો.',
    hi: 'ध्यान से सुनें, घबराएं नहीं।',
    en: 'Listen carefully, do not panic.',
  };

  const explanationText = t(explanation || defaultExplanation);
  const actionText = t(recommendedAction || defaultAction);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${safeVerdict}-${language}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.35 }}
        className={cn(
          'rounded-xl border p-5 space-y-3',
          bgClass,
          className
        )}
        role="status"
        aria-live="assertive"
        aria-label={`Kavach analysis: ${heading}`}
      >
        <h3 className="text-base font-bold uppercase tracking-widest text-slate-300">
          {heading}
        </h3>

        {/* Main explanation — large text for elders */}
        <p
          className="text-[22px] leading-relaxed font-medium text-white"
          lang={language === 'en' ? 'en' : language === 'hi' ? 'hi' : 'gu'}
        >
          {explanationText}
        </p>

        {/* Recommended action — high contrast pill */}
        <div className="flex items-start gap-3 rounded-lg bg-white/5 border border-white/10 px-4 py-3">
          <span
            className="mt-0.5 text-lg font-black shrink-0 text-white"
            aria-hidden="true"
          >
            →
          </span>
          <p
            className="text-lg font-semibold text-white"
            lang={language === 'en' ? 'en' : language === 'hi' ? 'hi' : 'gu'}
          >
            {actionText}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
