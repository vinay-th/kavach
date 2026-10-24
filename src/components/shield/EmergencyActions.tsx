'use client';

// src/components/shield/EmergencyActions.tsx
import { PhoneOff, BellRing } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import type { Verdict } from '@/types/analysis';

const HANG_UP_LABEL = { gu: 'ફોન કાપો', hi: 'फ़ोन काटें', en: 'Hang Up Now' };
const ALERT_LABEL   = { gu: 'પરિવારને ચેતવો', hi: 'परिवार को सूचित करें', en: 'Alert Family' };
const STOP_LABEL    = { gu: 'સિમ્યુલેશન બંધ', hi: 'सिमुलेशन बंद', en: 'Stop Simulation' };

interface EmergencyActionsProps {
  verdict: Verdict;
  onHangUp: () => void;
  onAlertFamily?: () => void;
  onStop?: () => void;
  isActive: boolean;
}

export function EmergencyActions({
  verdict,
  onHangUp,
  onAlertFamily,
  onStop,
  isActive,
}: EmergencyActionsProps) {
  const { t } = useLanguage();
  const showEmergency = verdict === 'scam' || verdict === 'suspicious';

  return (
    <div className="flex flex-col gap-3">
      {/* Hang up — shown when suspicious or scam */}
      <AnimatePresence>
        {showEmergency && (
          <motion.button
            key="hangup"
            onClick={onHangUp}
            className="flex h-16 w-full items-center justify-center gap-3 rounded-xl bg-red-600 text-white text-lg font-bold shadow-lg transition hover:bg-red-700 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-400"
            style={{ boxShadow: '0 0 24px -4px rgba(239,68,68,0.5)' }}
            initial={{ opacity: 0, scale: 0.9, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 12 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            aria-label={t(HANG_UP_LABEL)}
          >
            <PhoneOff size={22} aria-hidden="true" />
            {t(HANG_UP_LABEL)}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Alert family */}
      <AnimatePresence>
        {showEmergency && onAlertFamily && (
          <motion.button
            key="alert"
            onClick={onAlertFamily}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-white/20 bg-white/5 text-white text-base font-semibold transition hover:bg-white/10 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ delay: 0.1 }}
            aria-label={t(ALERT_LABEL)}
          >
            <BellRing size={18} aria-hidden="true" />
            {t(ALERT_LABEL)}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Stop simulation */}
      {isActive && onStop && (
        <button
          onClick={onStop}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-transparent text-slate-400 text-sm font-medium transition hover:border-slate-500 hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
          aria-label={t(STOP_LABEL)}
        >
          {t(STOP_LABEL)}
        </button>
      )}
    </div>
  );
}
