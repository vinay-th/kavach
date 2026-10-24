// src/types/analysis.ts

export type Verdict = 'safe' | 'suspicious' | 'scam';

export type RedFlagType =
  | 'urgency'
  | 'threat'
  | 'otp_request'
  | 'money_request'
  | 'fake_authority'
  | 'secrecy'
  | 'remote_access';

export interface RedFlag {
  type: RedFlagType;
  evidence: string;
}

export interface LocalizedText {
  gu: string;
  hi: string;
  en: string;
}

export interface AnalysisResult {
  transcript: string;
  languageDetected: string;
  riskScore: number;
  verdict: Verdict;
  redFlags: RedFlag[];
  explanation: LocalizedText;
  recommendedAction: LocalizedText;
}

export interface ChunkAnalysisRequest {
  audioBase64: string;
  mimeType: string;
  chunkIndex: number;
  totalChunks: number;
  callSessionId: string;
  previousContext?: {
    accumulatedTranscript: string;
    previousRiskScore: number;
    detectedRedFlags: RedFlagType[];
    previousSummary: string;
  };
}

export interface CallSessionState {
  sessionId: string;
  scenarioId: string;
  status: 'idle' | 'playing' | 'analyzing' | 'completed' | 'error';
  currentChunkIndex: number;
  totalChunks: number;
  highestRiskScore: number;
  currentVerdict: Verdict;
  accumulatedRedFlags: RedFlag[];
  latestResult: AnalysisResult | null;
  transcripts: string[];
  elapsedSeconds: number;
}
