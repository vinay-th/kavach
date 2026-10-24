// src/types/call.ts

export type ScenarioId =
  | 'scam-digital-arrest'
  | 'scam-courier-customs'
  | 'scam-bank-kyc'
  | 'genuine-delivery';

export type ScenarioVerdict = 'scam' | 'safe';

export interface CallScenario {
  id: ScenarioId;
  title: string;
  callerName: string;
  callerNumber: string;
  duration: string; // e.g. "02:45"
  expectedVerdict: ScenarioVerdict;
  audioFile: string; // path relative to /public e.g. "/calls/scam-digital-arrest.wav"
  description: string;
}

export interface AudioChunk {
  index: number;
  base64: string;
  mimeType: string;
  durationSeconds: number;
  startSeconds: number;
  endSeconds: number;
}

export type Language = 'gu' | 'hi' | 'en';
