// src/lib/risk.test.ts
import { describe, it, expect } from 'vitest';
import { scoreToVerdict, clampRiskScore, deduplicateRedFlags, reduceAnalysis } from './risk';
import type { CallSessionState, AnalysisResult, RedFlag } from '@/types/analysis';

function createMockSessionState(overrides: Partial<CallSessionState> = {}): CallSessionState {
  return {
    sessionId: 'session-123',
    scenarioId: 'scam-digital-arrest',
    status: 'idle',
    currentChunkIndex: 0,
    totalChunks: 4,
    highestRiskScore: 0,
    currentVerdict: 'safe',
    accumulatedRedFlags: [],
    latestResult: null,
    transcripts: [],
    elapsedSeconds: 0,
    ...overrides,
  };
}

function createMockChunkResult(overrides: Partial<AnalysisResult> = {}): AnalysisResult {
  return {
    transcript: 'Hello, this is officer Sharma calling.',
    languageDetected: 'en-IN',
    riskScore: 20,
    verdict: 'safe',
    redFlags: [],
    explanation: {
      en: 'Standard call opening.',
      hi: 'सामान्य कॉल शुरुआत।',
      gu: 'સામાન્ય કૉલ શરૂઆત.',
    },
    recommendedAction: {
      en: 'Listen carefully.',
      hi: 'ध्यान से सुनें।',
      gu: 'ધ્યાનથી સાંભળો.',
    },
    ...overrides,
  };
}

describe('scoreToVerdict', () => {
  it('maps scores <= 34 to safe', () => {
    expect(scoreToVerdict(0)).toBe('safe');
    expect(scoreToVerdict(15)).toBe('safe');
    expect(scoreToVerdict(34)).toBe('safe');
  });

  it('maps scores between 35 and 69 to suspicious', () => {
    expect(scoreToVerdict(35)).toBe('suspicious');
    expect(scoreToVerdict(50)).toBe('suspicious');
    expect(scoreToVerdict(69)).toBe('suspicious');
  });

  it('maps scores >= 70 to scam', () => {
    expect(scoreToVerdict(70)).toBe('scam');
    expect(scoreToVerdict(85)).toBe('scam');
    expect(scoreToVerdict(100)).toBe('scam');
  });

  it('handles negative or out-of-range scores safely', () => {
    expect(scoreToVerdict(-10)).toBe('safe');
    expect(scoreToVerdict(150)).toBe('scam');
  });
});

describe('clampRiskScore', () => {
  it('enforces monotonic progression where score never decreases', () => {
    expect(clampRiskScore(50, 40)).toBe(50);
    expect(clampRiskScore(85, 20)).toBe(85);
    expect(clampRiskScore(94, 94)).toBe(94);
  });

  it('increases score when incoming exceeds previous high-water mark', () => {
    expect(clampRiskScore(20, 65)).toBe(65);
    expect(clampRiskScore(65, 94)).toBe(94);
  });

  it('clamps values strictly within 0 and 100', () => {
    expect(clampRiskScore(-5, -20)).toBe(0);
    expect(clampRiskScore(90, 150)).toBe(100);
  });
});

describe('deduplicateRedFlags', () => {
  it('deduplicates flags by type and trimmed lowercased evidence', () => {
    const existing: RedFlag[] = [
      { type: 'fake_authority', evidence: 'Claims to be ACP from Mumbai Police' },
      { type: 'urgency', evidence: 'Immediate arrest threatened' },
    ];
    const incoming: RedFlag[] = [
      { type: 'fake_authority', evidence: 'claims to be acp from mumbai police ' }, // Duplicate
      { type: 'money_request', evidence: 'Demands ₹50,000 transfer' }, // New
    ];

    const deduplicated = deduplicateRedFlags(existing, incoming);
    expect(deduplicated).toHaveLength(3);
    expect(deduplicated.map((f) => f.type)).toEqual(['fake_authority', 'urgency', 'money_request']);
  });
});

describe('reduceAnalysis (pure state transition)', () => {
  it('preserves high risk score and verdict when subsequent chunk softens tone (contradiction handling)', () => {
    const initialState = createMockSessionState({
      highestRiskScore: 92,
      currentVerdict: 'scam',
      accumulatedRedFlags: [
        { type: 'fake_authority', evidence: 'Claims to be CBI' },
        { type: 'threat', evidence: 'Threatens digital arrest' },
      ],
      currentChunkIndex: 2,
    });

    const softChunk = createMockChunkResult({
      riskScore: 15,
      verdict: 'safe',
      transcript: 'Are you feeling okay? I am speaking softly now.',
      redFlags: [],
    });

    const nextState = reduceAnalysis(initialState, softChunk);

    expect(nextState.highestRiskScore).toBe(92);
    expect(nextState.currentVerdict).toBe('scam');
    expect(nextState.accumulatedRedFlags).toHaveLength(2);
    expect(nextState.currentChunkIndex).toBe(3);
    expect(nextState.latestResult?.riskScore).toBe(92);
    expect(nextState.latestResult?.verdict).toBe('scam');
  });

  it('increments chunk index and appends transcript', () => {
    const initialState = createMockSessionState({
      currentChunkIndex: 1,
      transcripts: ['Chunk 1 transcript'],
    });

    const newChunk = createMockChunkResult({
      transcript: 'Chunk 2 transcript',
      riskScore: 40,
    });

    const nextState = reduceAnalysis(initialState, newChunk);
    expect(nextState.currentChunkIndex).toBe(2);
    expect(nextState.transcripts).toEqual(['Chunk 1 transcript', 'Chunk 2 transcript']);
  });
});
