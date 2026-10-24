'use client';

// src/components/shield/CallSummary.tsx
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, AlertTriangle, Clock, MessageSquare, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { RedFlagsList } from './RedFlagsList';
import type { CallSessionState } from '@/types/analysis';

const HEADING = { gu: 'કૉલ વિશ્લેષણ સારાંશ', hi: 'कॉल विश्लेषण सारांश', en: 'Call Analysis Summary' };

interface CallSummaryProps {
  state: CallSessionState;
}

export function CallSummary({ state }: CallSummaryProps) {
  const { t } = useLanguage();
  const { highestRiskScore, currentVerdict, accumulatedRedFlags, transcripts, latestResult, elapsedSeconds } = state;

  const mins = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
  const secs = (elapsedSeconds % 60).toString().padStart(2, '0');

  const verdictIcon = {
    safe: <ShieldCheck size={20} className="text-emerald-400" aria-hidden="true" />,
    suspicious: <AlertTriangle size={20} className="text-amber-400" aria-hidden="true" />,
    scam: <ShieldAlert size={20} className="text-red-400" aria-hidden="true" />,
  }[currentVerdict];

  const verdictColor = { safe: '#10B981', suspicious: '#F59E0B', scam: '#EF4444' }[currentVerdict];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-5 rounded-2xl border border-white/10 bg-white/5 p-6"
    >
      <h2 className="flex items-center gap-2 text-xl font-bold text-white">
        {verdictIcon}
        {t(HEADING)}
      </h2>

      {/* Key metrics row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Risk score */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
          <div className="text-3xl font-black" style={{ color: verdictColor }}>
            {highestRiskScore}
          </div>
          <div className="mt-1 text-xs uppercase tracking-widest text-slate-400">Risk Score</div>
        </div>

        {/* Duration */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-2xl font-bold text-white">
            <Clock size={16} className="text-slate-400" aria-hidden="true" />
            {mins}:{secs}
          </div>
          <div className="mt-1 text-xs uppercase tracking-widest text-slate-400">Duration</div>
        </div>

        {/* Chunks analyzed */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-2xl font-bold text-white">
            <MessageSquare size={16} className="text-slate-400" aria-hidden="true" />
            {transcripts.length}
          </div>
          <div className="mt-1 text-xs uppercase tracking-widest text-slate-400">Chunks</div>
        </div>

        {/* Language */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-xl font-bold text-white">
            <Globe size={16} className="text-slate-400" aria-hidden="true" />
            {latestResult?.languageDetected ?? '—'}
          </div>
          <div className="mt-1 text-xs uppercase tracking-widest text-slate-400">Language</div>
        </div>
      </div>

      {/* Red flags */}
      <RedFlagsList flags={accumulatedRedFlags} />

      {/* Last transcript */}
      {transcripts.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-black/20 p-4">
          <p className="mb-2 text-xs uppercase tracking-widest text-slate-400">Final Transcript</p>
          <p className="text-sm leading-relaxed text-slate-300">{transcripts[transcripts.length - 1]}</p>
        </div>
      )}
    </motion.div>
  );
}
