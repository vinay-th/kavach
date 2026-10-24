'use client';

// src/components/shield/RiskGauge.tsx
// SVG arc gauge for risk score 0-100
// Colors: emerald <35, amber 35-69, crimson 70+
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Verdict } from '@/types/analysis';

const SIZE = 200;
const STROKE_WIDTH = 18;
const R = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = Math.PI * R; // half-circle arc

function verdictColor(verdict: Verdict): string {
  switch (verdict) {
    case 'scam':       return '#EF4444';
    case 'suspicious': return '#F59E0B';
    case 'safe':       return '#10B981';
  }
}

function verdictGlow(verdict: Verdict): string {
  switch (verdict) {
    case 'scam':       return 'drop-shadow(0 0 16px rgba(239,68,68,0.7))';
    case 'suspicious': return 'drop-shadow(0 0 14px rgba(245,158,11,0.6))';
    case 'safe':       return 'drop-shadow(0 0 12px rgba(16,185,129,0.5))';
  }
}

interface RiskGaugeProps {
  score: number;
  verdict: Verdict;
  className?: string;
}

export function RiskGauge({ score, verdict, className }: RiskGaugeProps) {
  const clamped = Math.min(100, Math.max(0, score));
  const dashOffset = CIRCUMFERENCE - (clamped / 100) * CIRCUMFERENCE;
  const color = verdictColor(verdict);

  const label: Record<Verdict, string> = {
    safe:       'SAFE',
    suspicious: 'SUSPICIOUS',
    scam:       'SCAM DETECTED',
  };

  return (
    <div
      className={cn('flex flex-col items-center gap-2', className)}
      role="img"
      aria-label={`Risk score ${score} out of 100: ${label[verdict]}`}
    >
      <svg
        width={SIZE}
        height={SIZE / 2 + STROKE_WIDTH}
        viewBox={`0 0 ${SIZE} ${SIZE / 2 + STROKE_WIDTH}`}
        overflow="visible"
      >
        {/* Background track */}
        <path
          d={`M ${STROKE_WIDTH / 2},${SIZE / 2} A ${R},${R} 0 0 1 ${SIZE - STROKE_WIDTH / 2},${SIZE / 2}`}
          fill="none"
          stroke="#1E293B"
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
        />
        {/* Animated filled arc */}
        <motion.path
          d={`M ${STROKE_WIDTH / 2},${SIZE / 2} A ${R},${R} 0 0 1 ${SIZE - STROKE_WIDTH / 2},${SIZE / 2}`}
          fill="none"
          stroke={color}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          initial={{ strokeDashoffset: CIRCUMFERENCE }}
          animate={{
            strokeDashoffset: dashOffset,
            stroke: color,
          }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ filter: verdictGlow(verdict) }}
        />
        {/* Score text */}
        <motion.text
          x={SIZE / 2}
          y={SIZE / 2 - 6}
          textAnchor="middle"
          fill={color}
          fontSize="40"
          fontWeight="800"
          fontFamily="Plus Jakarta Sans, sans-serif"
          animate={{ fill: color }}
          transition={{ duration: 0.5 }}
        >
          {clamped}
        </motion.text>
        <text
          x={SIZE / 2}
          y={SIZE / 2 + 18}
          textAnchor="middle"
          fill="#94A3B8"
          fontSize="10"
          fontWeight="600"
          fontFamily="Plus Jakarta Sans, sans-serif"
          letterSpacing="0.08em"
        >
          / 100
        </text>
      </svg>
      <motion.span
        className="text-sm font-bold tracking-widest uppercase"
        animate={{ color }}
        transition={{ duration: 0.5 }}
      >
        {label[verdict]}
      </motion.span>
    </div>
  );
}
