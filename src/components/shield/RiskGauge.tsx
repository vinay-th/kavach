'use client';

// src/components/shield/RiskGauge.tsx
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Verdict } from '@/types/analysis';

const SIZE = 200;
const STROKE_WIDTH = 18;
const R = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = Math.PI * R; // half-circle arc

function verdictColor(verdict: Verdict): string {
  switch (verdict) {
    case 'scam':
      return '#EF4444';
    case 'suspicious':
      return '#F59E0B';
    case 'safe':
    default:
      return '#10B981';
  }
}

function verdictGlow(verdict: Verdict): string {
  switch (verdict) {
    case 'scam':
      return 'drop-shadow(0 0 16px rgba(239,68,68,0.7))';
    case 'suspicious':
      return 'drop-shadow(0 0 14px rgba(245,158,11,0.6))';
    case 'safe':
    default:
      return 'drop-shadow(0 0 12px rgba(16,185,129,0.5))';
  }
}

interface RiskGaugeProps {
  score?: number;
  verdict?: Verdict;
  className?: string;
}

export function RiskGauge({ score = 0, verdict = 'safe', className }: RiskGaugeProps) {
  const safeVerdict: Verdict = verdict === 'scam' || verdict === 'suspicious' ? verdict : 'safe';
  const clamped = Math.min(100, Math.max(0, Math.round(score)));
  const dashOffset = CIRCUMFERENCE - (clamped / 100) * CIRCUMFERENCE;
  const color = verdictColor(safeVerdict);

  const label: Record<Verdict, string> = {
    safe: 'SAFE',
    suspicious: 'SUSPICIOUS',
    scam: 'SCAM DETECTED',
  };

  return (
    <div
      className={cn('flex flex-col items-center gap-2', className)}
      role="meter"
      aria-label={label[safeVerdict]}
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuetext={`${label[safeVerdict]} - ${clamped} percent`}
    >
      <svg
        width={SIZE}
        height={SIZE / 2 + STROKE_WIDTH}
        viewBox={`0 0 ${SIZE} ${SIZE / 2 + STROKE_WIDTH}`}
        overflow="visible"
      >
        {/* Background track */}
        <path
          d={`M ${STROKE_WIDTH / 2} ${SIZE / 2} A ${R} ${R} 0 0 1 ${SIZE - STROKE_WIDTH / 2} ${SIZE / 2}`}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
        />

        {/* Animated fill arc */}
        <motion.path
          d={`M ${STROKE_WIDTH / 2} ${SIZE / 2} A ${R} ${R} 0 0 1 ${SIZE - STROKE_WIDTH / 2} ${SIZE / 2}`}
          fill="none"
          stroke={color}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          initial={{ strokeDashoffset: CIRCUMFERENCE }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ filter: verdictGlow(safeVerdict) }}
        />
      </svg>

      {/* Numerical score & Verdict label */}
      <div className="flex flex-col items-center -mt-6">
        <span className="text-3xl font-extrabold tracking-tight text-white font-mono">
          {clamped}
          <span className="text-sm font-normal text-stone-400">/100</span>
        </span>
        <span
          className="text-xs font-bold tracking-widest uppercase mt-0.5"
          style={{ color }}
          data-testid="verdict-label"
        >
          {label[safeVerdict]}
        </span>
      </div>
    </div>
  );
}
