'use client';

// src/components/shield/FlagChip.tsx
import {
  Siren,
  ShieldX,
  CreditCard,
  Banknote,
  BadgeAlert,
  EyeOff,
  MonitorSmartphone,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { RED_FLAG_LABELS } from '@/lib/scam-rules';
import type { RedFlag } from '@/types/analysis';

const FLAG_ICONS = {
  urgency:        Siren,
  threat:         ShieldX,
  otp_request:    CreditCard,
  money_request:  Banknote,
  fake_authority: BadgeAlert,
  secrecy:        EyeOff,
  remote_access:  MonitorSmartphone,
} as const;

const FLAG_COLORS = {
  urgency:        { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.4)', text: '#F59E0B' },
  threat:         { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.5)',  text: '#EF4444' },
  otp_request:    { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.5)',  text: '#EF4444' },
  money_request:  { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.5)',  text: '#EF4444' },
  fake_authority: { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.5)',  text: '#EF4444' },
  secrecy:        { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.4)', text: '#F59E0B' },
  remote_access:  { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.5)',  text: '#EF4444' },
} as const;

interface FlagChipProps {
  flag: RedFlag;
  className?: string;
}

export function FlagChip({ flag, className }: FlagChipProps) {
  const { language } = useLanguage();
  const Icon = FLAG_ICONS[flag.type];
  const colors = FLAG_COLORS[flag.type];
  const labels = RED_FLAG_LABELS[flag.type];
  const label = labels[language];

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            role="listitem"
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-3 py-1.5 border text-sm font-semibold cursor-default select-none',
              className,
            )}
            style={{
              backgroundColor: colors.bg,
              borderColor: colors.border,
              color: colors.text,
            }}
          >
            <Icon size={14} aria-hidden="true" />
            <span>{label}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="max-w-xs bg-slate-800 border border-slate-700 text-slate-100 text-sm px-3 py-2"
        >
          <p className="font-semibold mb-1">Evidence:</p>
          <p>{flag.evidence}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
