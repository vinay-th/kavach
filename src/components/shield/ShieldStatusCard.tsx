'use client';

// src/components/shield/ShieldStatusCard.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import type { Verdict } from '@/types/analysis';
import type { LocalizedText } from '@/types/analysis';

const VERDICT_CONFIG = {
  safe: {
    icon: ShieldCheck,
    color: '#10B981',
    bgColor: 'rgba(16,185,129,0.08)',
    borderColor: 'rgba(16,185,129,0.4)',
    glowColor: 'rgba(16,185,129,0.25)',
    label: { gu: 'સુરક્ષિત', hi: 'सुरक्षित', en: 'SAFE' } satisfies LocalizedText,
  },
  suspicious: {
    icon: AlertTriangle,
    color: '#F59E0B',
    bgColor: 'rgba(245,158,11,0.08)',
    borderColor: 'rgba(245,158,11,0.4)',
    glowColor: 'rgba(245,158,11,0.25)',
    label: { gu: 'સાવધાન', hi: 'सावधान', en: 'SUSPICIOUS' } satisfies LocalizedText,
  },
  scam: {
    icon: ShieldAlert,
    color: '#EF4444',
    bgColor: 'rgba(239,68,68,0.08)',
    borderColor: 'rgba(239,68,68,0.5)',
    glowColor: 'rgba(239,68,68,0.3)',
    label: { gu: 'સાયબર ફ્રોડ!', hi: 'साइबर फ्रॉड!', en: 'CYBER FRAUD ALERT' } satisfies LocalizedText,
  },
} as const;

interface ShieldStatusCardProps {
  verdict: Verdict;
  score: number;
  className?: string;
}

export function ShieldStatusCard({ verdict = 'safe', score = 0, className }: Partial<ShieldStatusCardProps>) {
  const { t } = useLanguage();
  const safeVerdict: Verdict = verdict && verdict in VERDICT_CONFIG ? verdict : 'safe';
  const cfg = VERDICT_CONFIG[safeVerdict];
  const Icon = cfg.icon;

  return (
    <motion.div
      className={cn('relative overflow-hidden rounded-2xl p-6 flex flex-col items-center gap-4', className)}
      animate={{
        backgroundColor: cfg.bgColor,
        borderColor: cfg.borderColor,
        boxShadow: `0 0 40px -8px ${cfg.glowColor}`,
      }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      style={{ border: '1.5px solid' }}
    >
      {/* Pulsing glow ring — only shown for scam/suspicious */}
      <AnimatePresence>
        {verdict !== 'safe' && (
          <motion.div
            key={verdict}
            className="absolute inset-0 rounded-2xl pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              background: `radial-gradient(ellipse at center, ${cfg.glowColor} 0%, transparent 70%)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Shield Icon */}
      <motion.div
        className="relative"
        animate={{
          scale: verdict === 'scam' ? [1, 1.05, 1] : 1,
        }}
        transition={{
          duration: 1.5,
          repeat: verdict === 'scam' ? Infinity : 0,
          ease: 'easeInOut',
        }}
      >
        <Icon
          size={72}
          strokeWidth={1.5}
          style={{ color: cfg.color, filter: `drop-shadow(0 0 12px ${cfg.glowColor})` }}
          aria-hidden="true"
        />
      </motion.div>

      {/* Status Label */}
      <motion.h2
        className="text-2xl font-bold tracking-wide text-center"
        animate={{ color: cfg.color }}
        transition={{ duration: 0.5 }}
      >
        {t(cfg.label)}
      </motion.h2>

      {/* Score badge */}
      <div
        className="flex items-center gap-2 px-4 py-1.5 rounded-full border"
        style={{
          borderColor: cfg.borderColor,
          backgroundColor: cfg.bgColor,
        }}
      >
        <Shield size={14} style={{ color: cfg.color }} aria-hidden="true" />
        <span className="text-sm font-semibold" style={{ color: cfg.color }}>
          {score}/100
        </span>
      </div>
    </motion.div>
  );
}
