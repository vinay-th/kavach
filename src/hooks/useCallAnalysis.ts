'use client';

// src/hooks/useCallAnalysis.ts
import { useReducer, useRef, useCallback, useEffect } from 'react';
import type { CallSessionState, AnalysisResult, Verdict } from '@/types/analysis';
import type { ScenarioId } from '@/types/call';
import { clampRiskScore, scoreToVerdict } from '@/lib/scam-rules';
import { getMockChunksForScenario } from '@/lib/mock-data';

// ─── State shape ──────────────────────────────────────────────────────────────

function makeInitialState(): CallSessionState {
  return {
    sessionId: '',
    scenarioId: '',
    status: 'idle',
    currentChunkIndex: 0,
    totalChunks: 0,
    highestRiskScore: 0,
    currentVerdict: 'safe',
    accumulatedRedFlags: [],
    latestResult: null,
    transcripts: [],
    elapsedSeconds: 0,
  };
}

// ─── Actions ─────────────────────────────────────────────────────────────────

type Action =
  | { type: 'SELECT_SCENARIO'; scenarioId: ScenarioId; totalChunks: number }
  | { type: 'START_PLAYING' }
  | { type: 'TICK' }
  | { type: 'CHUNK_ANALYZED'; result: AnalysisResult; chunkIndex: number }
  | { type: 'COMPLETE' }
  | { type: 'ERROR'; message: string }
  | { type: 'STOP' }
  | { type: 'RESET' };

// ─── Reducer ─────────────────────────────────────────────────────────────────

function reducer(state: CallSessionState, action: Action): CallSessionState {
  switch (action.type) {
    case 'SELECT_SCENARIO': {
      return {
        ...makeInitialState(),
        sessionId: `session-${Date.now()}`,
        scenarioId: action.scenarioId,
        status: 'idle',
        totalChunks: action.totalChunks,
      };
    }
    case 'START_PLAYING': {
      return { ...state, status: 'playing' };
    }
    case 'TICK': {
      return { ...state, elapsedSeconds: state.elapsedSeconds + 1 };
    }
    case 'CHUNK_ANALYZED': {
      const newRisk = clampRiskScore(state.highestRiskScore, action.result.riskScore);
      const newVerdict: Verdict = scoreToVerdict(newRisk);
      // Accumulate red flags (deduplicate by type+evidence)
      const existing = new Set(
        state.accumulatedRedFlags.map((f) => `${f.type}:${f.evidence}`),
      );
      const incoming = action.result.redFlags.filter(
        (f) => !existing.has(`${f.type}:${f.evidence}`),
      );
      return {
        ...state,
        status: 'playing',
        currentChunkIndex: action.chunkIndex + 1,
        highestRiskScore: newRisk,
        currentVerdict: newVerdict,
        accumulatedRedFlags: [...state.accumulatedRedFlags, ...incoming],
        latestResult: {
          ...action.result,
          riskScore: newRisk,
          verdict: newVerdict,
          redFlags: [...state.accumulatedRedFlags, ...incoming],
        },
        transcripts: [...state.transcripts, action.result.transcript],
      };
    }
    case 'COMPLETE': {
      return { ...state, status: 'completed' };
    }
    case 'ERROR': {
      return { ...state, status: 'error' };
    }
    case 'STOP':
    case 'RESET': {
      return makeInitialState();
    }
    default:
      return state;
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseCallAnalysisOptions {
  /** If true, uses mock data instead of real API */
  mockMode?: boolean;
  /** Seconds between mock chunk dispatches (default: 5) */
  mockChunkInterval?: number;
}

interface UseCallAnalysisReturn {
  sessionState: CallSessionState;
  selectScenario: (id: ScenarioId) => void;
  startCall: () => void;
  stopCall: () => void;
  resetCall: () => void;
}

export function useCallAnalysis(
  options: UseCallAnalysisOptions = {},
): UseCallAnalysisReturn {
  const { mockMode = true, mockChunkInterval = 5 } = options;

  const [sessionState, dispatch] = useReducer(reducer, makeInitialState());

  // Timer ref for the wall-clock tick
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Mock chunk dispatch ref
  const mockRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Stable reference to sessionState for use inside intervals
  const stateRef = useRef(sessionState);
  useEffect(() => {
    stateRef.current = sessionState;
  }, [sessionState]);

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mockRef.current) {
      clearInterval(mockRef.current);
      mockRef.current = null;
    }
  }, []);

  const selectScenario = useCallback(
    (id: ScenarioId) => {
      clearTimers();
      const chunks = getMockChunksForScenario(id);
      dispatch({
        type: 'SELECT_SCENARIO',
        scenarioId: id,
        totalChunks: chunks.length,
      });
    },
    [clearTimers],
  );

  const startCall = useCallback(() => {
    const { scenarioId, status } = stateRef.current;
    if (!scenarioId || status === 'playing' || status === 'analyzing') return;

    dispatch({ type: 'START_PLAYING' });

    // Wall-clock tick every second
    timerRef.current = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, 1000);

    if (mockMode) {
      const chunks = getMockChunksForScenario(scenarioId as ScenarioId);
      let chunkIdx = 0;

      // Dispatch first chunk immediately
      dispatch({ type: 'CHUNK_ANALYZED', result: chunks[0]!, chunkIndex: 0 });
      chunkIdx = 1;

      mockRef.current = setInterval(() => {
        if (chunkIdx >= chunks.length) {
          clearTimers();
          dispatch({ type: 'COMPLETE' });
          return;
        }
        dispatch({
          type: 'CHUNK_ANALYZED',
          result: chunks[chunkIdx]!,
          chunkIndex: chunkIdx,
        });
        chunkIdx++;
      }, mockChunkInterval * 1000);
    }
  }, [mockMode, mockChunkInterval, clearTimers]);

  const stopCall = useCallback(() => {
    clearTimers();
    dispatch({ type: 'STOP' });
  }, [clearTimers]);

  const resetCall = useCallback(() => {
    clearTimers();
    dispatch({ type: 'RESET' });
  }, [clearTimers]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  return { sessionState, selectScenario, startCall, stopCall, resetCall };
}
