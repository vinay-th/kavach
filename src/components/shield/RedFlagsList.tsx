'use client';

// src/components/shield/RedFlagsList.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { FlagChip } from './FlagChip';
import type { RedFlag } from '@/types/analysis';
import { useLanguage } from '@/context/LanguageContext';

const SECTION_LABELS = {
  gu: 'શોધાયેલ જોખમ',
  hi: 'चिह्नित खतरे',
  en: 'Detected Red Flags',
};

interface RedFlagsListProps {
  flags: RedFlag[];
  className?: string;
}

export function RedFlagsList({ flags = [], className }: { flags?: RedFlag[]; className?: string }) {
  const { language = 'en' } = useLanguage();
  const heading = SECTION_LABELS[language] || SECTION_LABELS.en;

  return (
    <div className={className}>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-400">
        {heading}
        {flags.length > 0 && (
          <span className="ml-2 rounded-full bg-red-500/20 px-2 py-0.5 text-xs text-red-400 font-bold">
            {flags.length}
          </span>
        )}
      </h3>
      <div
        role="list"
        aria-label={heading}
        className="flex flex-wrap gap-2 min-h-[2rem]"
      >
        <AnimatePresence>
          {flags.map((flag) => (
            <motion.div
              key={`${flag.type}:${flag.evidence}`}
              initial={{ opacity: 0, scale: 0.8, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            >
              <FlagChip flag={flag} />
            </motion.div>
          ))}
        </AnimatePresence>

        {flags.length === 0 && (
          <span className="text-sm text-slate-500 italic">None detected yet</span>
        )}
      </div>
    </div>
  );
}
