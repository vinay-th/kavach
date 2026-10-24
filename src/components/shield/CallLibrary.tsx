'use client';

// src/components/shield/CallLibrary.tsx
import { motion } from 'framer-motion';
import { PhoneCall, ShieldAlert, ShieldCheck, Clock, User, Phone } from 'lucide-react';
import { CALL_SCENARIOS } from '@/lib/mock-data';
import type { CallScenario, ScenarioId } from '@/types/call';
import { cn } from '@/lib/utils';

interface CallLibraryProps {
  selectedScenarioId: ScenarioId | '';
  onSelectScenario: (id: ScenarioId) => void;
  disabled?: boolean;
}

export function CallLibrary({
  selectedScenarioId,
  onSelectScenario,
  disabled = false,
}: CallLibraryProps) {
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-500">
          Select Call Scenario
        </h3>
        <span className="text-xs text-stone-400">
          {disabled ? 'Call in progress' : 'Pick a scenario to test'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {CALL_SCENARIOS.map((scenario: CallScenario) => {
          const isSelected = selectedScenarioId === scenario.id;
          const isScam = scenario.expectedVerdict === 'scam';

          return (
            <motion.button
              key={scenario.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectScenario(scenario.id)}
              whileHover={disabled ? undefined : { scale: 1.01 }}
              whileTap={disabled ? undefined : { scale: 0.99 }}
              className={cn(
                'relative flex flex-col text-left p-4 rounded-xl border transition-all duration-200',
                isSelected
                  ? 'bg-white border-primary shadow-md ring-2 ring-primary/20'
                  : 'bg-white/70 hover:bg-white border-stone-200 hover:border-stone-300 shadow-sm',
                disabled && 'opacity-60 cursor-not-allowed'
              )}
            >
              <div className="flex items-center justify-between gap-2 mb-2 w-full">
                <span className="font-semibold text-stone-900 text-sm line-clamp-1">
                  {scenario.title}
                </span>
                <span
                  className={cn(
                    'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0 uppercase tracking-wide',
                    isScam
                      ? 'bg-red-50 text-red-600 border border-red-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  )}
                >
                  {isScam ? (
                    <ShieldAlert className="w-3 h-3" />
                  ) : (
                    <ShieldCheck className="w-3 h-3" />
                  )}
                  {isScam ? 'Scam Demo' : 'Safe Call'}
                </span>
              </div>

              <p className="text-xs text-stone-500 line-clamp-2 mb-3">
                {scenario.description}
              </p>

              <div className="mt-auto pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400 w-full">
                <span className="flex items-center gap-1 font-mono">
                  <User className="w-3 h-3 text-stone-400" />
                  <span className="truncate max-w-[140px]">{scenario.callerName}</span>
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-stone-400" />
                  {scenario.duration}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
