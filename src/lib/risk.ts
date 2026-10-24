// src/lib/risk.ts
/**
 * Pure risk reduction and scoring engine for Kavach.
 * Enforces monotonic risk progression (risk score only holds or increases during a call),
 * deduplicates newly identified extortion red flags, and derives verdicts based on exact thresholds.
 */

import { RISK_THRESHOLDS } from './constants';
import type { Verdict, RedFlag, AnalysisResult, CallSessionState } from '@/types/analysis';

/**
 * Maps a numeric risk score (0 - 100) to its categorical verdict.
 * - 0 .. 34 => 'safe'
 * - 35 .. 69 => 'suspicious'
 * - 70 .. 100 => 'scam'
 */
export function scoreToVerdict(score: number): Verdict {
  const clamped = clampRiskScore(0, score);
  if (clamped >= RISK_THRESHOLDS.SCAM_MIN) return 'scam';
  if (clamped >= RISK_THRESHOLDS.SUSPICIOUS_MIN) return 'suspicious';
  return 'safe';
}

/**
 * Clamps incoming score between 0 and 100 and enforces monotonicity:
 * the returned score is never less than the previously established high-water mark.
 */
export function clampRiskScore(previousScore: number, incomingScore: number): number {
  const boundedPrevious = Math.max(RISK_THRESHOLDS.MIN_SCORE, Math.min(RISK_THRESHOLDS.MAX_SCORE, previousScore || 0));
  const boundedIncoming = Math.max(RISK_THRESHOLDS.MIN_SCORE, Math.min(RISK_THRESHOLDS.MAX_SCORE, Math.round(incomingScore || 0)));
  return Math.max(boundedPrevious, boundedIncoming);
}

/**
 * Deduplicates red flags preserving uniqueness of flag type and evidence snippet.
 */
export function deduplicateRedFlags(existing: RedFlag[], incoming: RedFlag[]): RedFlag[] {
  const seen = new Set<string>();
  const result: RedFlag[] = [];

  for (const flag of [...existing, ...incoming]) {
    const key = `${flag.type}:${flag.evidence.trim().toLowerCase()}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(flag);
    }
  }

  return result;
}

/**
 * Pure state reducer function: takes current call state and new chunk analysis result,
 * returning a new state with monotonic risk score, deduplicated red flags, and updated verdict.
 * Even if an adversary softens their tone in later chunks, established threats are never forgotten.
 */
export function reduceAnalysis(
  state: CallSessionState,
  chunkResult: AnalysisResult,
  chunkIndexOverride?: number
): CallSessionState {
  const newRisk = clampRiskScore(state.highestRiskScore, chunkResult.riskScore);
  const newVerdict = scoreToVerdict(newRisk);
  const updatedFlags = deduplicateRedFlags(state.accumulatedRedFlags, chunkResult.redFlags);
  const nextChunkIndex =
    typeof chunkIndexOverride === 'number'
      ? chunkIndexOverride + 1
      : state.currentChunkIndex + 1;

  const newTranscripts = chunkResult.transcript
    ? [...state.transcripts, chunkResult.transcript]
    : state.transcripts;

  return {
    ...state,
    status: 'playing',
    currentChunkIndex: nextChunkIndex,
    highestRiskScore: newRisk,
    currentVerdict: newVerdict,
    accumulatedRedFlags: updatedFlags,
    latestResult: {
      ...chunkResult,
      riskScore: newRisk,
      verdict: newVerdict,
      redFlags: updatedFlags,
    },
    transcripts: newTranscripts,
  };
}
