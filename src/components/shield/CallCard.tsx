'use client';

// src/components/shield/CallCard.tsx
import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  PhoneOff,
  Play,
  RotateCcw,
  User,
  Radio,
  Wifi,
  Battery,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CallScenario } from '@/types/call';
import type { CallSessionState } from '@/types/analysis';

interface CallCardProps {
  scenario?: CallScenario | null;
  sessionState: CallSessionState;
  onStartCall: () => void;
  onStopCall: () => void;
  onResetCall: () => void;
}

export function CallCard({
  scenario,
  sessionState,
  onStartCall,
  onStopCall,
  onResetCall,
}: CallCardProps) {
  const isPlaying = sessionState.status === 'playing';
  const isCompleted = sessionState.status === 'completed';
  const isIdle = sessionState.status === 'idle';
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll transcript to bottom as new chunks arrive
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessionState.transcripts]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const callerName = scenario?.callerName ?? 'Unknown caller';
  const callerNumber = scenario?.callerNumber ?? '+91 98210 44102';

  return (
    <div className="w-full bg-[#0E1116] text-[#FAF8F4] rounded-[32px] p-5 md:p-6 border border-stone-800 shadow-2xl flex flex-col justify-between overflow-hidden relative min-h-[520px]">
      {/* Top Mobile Status Header */}
      <div className="flex items-center justify-between text-xs text-stone-400 font-mono pb-4 border-b border-white/10">
        <span className="flex items-center gap-1.5">
          <span
            className={cn(
              'w-2 h-2 rounded-full',
              isPlaying
                ? 'bg-red-500 animate-ping'
                : isCompleted
                ? 'bg-amber-400'
                : 'bg-emerald-400'
            )}
          />
          {isPlaying ? 'ACTIVE AUDIO STREAM' : isCompleted ? 'CALL FINISHED' : 'SIMULATOR READY'}
        </span>
        <div className="flex items-center gap-2 text-stone-400">
          <Wifi className="w-3.5 h-3.5" />
          <Battery className="w-3.5 h-3.5" />
          <span>{isPlaying ? 'LIVE' : '4G'}</span>
        </div>
      </div>

      {/* Caller Info Block */}
      <div className="text-center my-4">
        <div className="relative mx-auto w-16 h-16 rounded-full bg-white/10 text-white flex items-center justify-center mb-3 ring-4 ring-white/5">
          <User className="w-8 h-8 text-stone-200" />
          {isPlaying && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[9px] font-bold text-white items-center justify-center">
                !
              </span>
            </span>
          )}
        </div>
        <h3 className="text-white text-lg font-semibold tracking-tight line-clamp-1">
          {callerName}
        </h3>
        <p className="text-stone-400 text-xs font-mono mt-0.5">{callerNumber}</p>
        <p className="text-xs text-stone-500 mt-1 flex items-center justify-center gap-1.5 font-mono">
          <Radio className={cn('w-3 h-3', isPlaying && 'text-red-400 animate-pulse')} />
          {isPlaying ? `Ongoing call • ${formatTimer(sessionState.elapsedSeconds)}` : 'Standby mode'}
        </p>

        {/* Dynamic Waveform Bars */}
        <div className="flex items-center justify-center gap-1.5 h-10 mt-4 px-4 py-1 rounded-full bg-white/5 border border-white/10 max-w-xs mx-auto">
          {[40, 75, 55, 90, 65, 80, 45, 70, 85, 50].map((height, i) => (
            <motion.span
              key={i}
              className={cn(
                'w-1.5 rounded-full transition-colors',
                isPlaying
                  ? sessionState.highestRiskScore >= 70
                    ? 'bg-red-500'
                    : sessionState.highestRiskScore >= 35
                    ? 'bg-amber-400'
                    : 'bg-emerald-400'
                  : 'bg-stone-700'
              )}
              animate={
                isPlaying
                  ? {
                      height: [`${Math.max(6, height * 0.2)}px`, `${height * 0.35}px`, `${Math.max(6, height * 0.15)}px`],
                    }
                  : { height: '6px' }
              }
              transition={{
                duration: 0.8 + (i % 3) * 0.2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.08,
              }}
            />
          ))}
        </div>
      </div>

      {/* Live Audio Transcript Box */}
      <div className="flex-1 bg-white/[0.04] rounded-2xl p-4 border border-white/10 my-2 overflow-hidden flex flex-col justify-between max-h-[180px]">
        <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono uppercase tracking-wider pb-2 border-b border-white/10">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-red-400" />
            Live Audio Transcript
          </span>
          <span>Chunk {sessionState.currentChunkIndex} / {sessionState.totalChunks || 4}</span>
        </div>

        <div className="overflow-y-auto pr-1 space-y-2 mt-2 text-xs text-stone-200 leading-relaxed font-sans">
          {sessionState.transcripts.length === 0 ? (
            <p className="text-stone-500 italic text-center py-4">
              Click &quot;Start Call&quot; to begin playing audio and parsing live scam patterns...
            </p>
          ) : (
            sessionState.transcripts.map((text, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  'p-2 rounded-lg text-xs',
                  idx === sessionState.transcripts.length - 1
                    ? 'bg-white/10 border border-white/15 text-white'
                    : 'bg-transparent text-stone-400'
                )}
              >
                <span className="font-mono text-[10px] text-stone-400 mr-1.5">[{idx + 1}]</span>
                <span>{text}</span>
              </motion.div>
            ))
          )}
          <div ref={transcriptEndRef} />
        </div>
      </div>

      {/* Simulator Action Controls */}
      <div className="pt-3 border-t border-white/10 flex items-center gap-2">
        {isIdle && (
          <button
            type="button"
            onClick={onStartCall}
            className="flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-[#9a0f0b] text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-900/30 transition-all active:scale-[0.98]"
          >
            <Play className="w-4 h-4 fill-current" />
            Start Call Simulation
          </button>
        )}

        {isPlaying && (
          <button
            type="button"
            onClick={onStopCall}
            className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-900/40 transition-all active:scale-[0.98]"
          >
            <PhoneOff className="w-4 h-4" />
            End Call Now
          </button>
        )}

        {isCompleted && (
          <div className="flex items-center gap-2 w-full">
            <button
              type="button"
              onClick={onResetCall}
              className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Simulation
            </button>
            <button
              type="button"
              onClick={onStartCall}
              className="flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-[#9a0f0b] text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Play className="w-4 h-4 fill-current" />
              Replay
            </button>
          </div>
        )}

        {(isPlaying || isCompleted) && (
          <button
            type="button"
            onClick={onResetCall}
            title="Reset"
            className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
