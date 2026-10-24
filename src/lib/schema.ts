// src/lib/schema.ts
/**
 * Zod validation schemas for Kavach.
 * Strict schemas guarantee that model responses from Gemini and client requests
 * adhere to exact runtime contracts before reaching application logic.
 */

import { z } from 'zod';
import { AUDIO_CONSTANTS, RISK_THRESHOLDS } from './constants';

export const VerdictSchema = z.enum(['safe', 'suspicious', 'scam']);

export const RedFlagTypeSchema = z.enum([
  'urgency',
  'threat',
  'otp_request',
  'money_request',
  'fake_authority',
  'secrecy',
  'remote_access',
]);

export const RedFlagSchema = z.object({
  type: RedFlagTypeSchema,
  evidence: z.string().min(1, 'Evidence snippet is required').max(300, 'Evidence exceeds length limit'),
});

export const LocalizedTextSchema = z.object({
  gu: z.string().min(1, 'Gujarati text is required'),
  hi: z.string().min(1, 'Hindi text is required'),
  en: z.string().min(1, 'English text is required'),
});

export const AnalysisResultSchema = z.object({
  transcript: z.string(),
  languageDetected: z.string().default('en-IN'),
  riskScore: z
    .number()
    .int()
    .min(RISK_THRESHOLDS.MIN_SCORE, 'Risk score cannot be less than 0')
    .max(RISK_THRESHOLDS.MAX_SCORE, 'Risk score cannot exceed 100'),
  verdict: VerdictSchema,
  redFlags: z.array(RedFlagSchema).default([]),
  explanation: LocalizedTextSchema,
  recommendedAction: LocalizedTextSchema,
});

export const PreviousContextSchema = z.object({
  accumulatedTranscript: z.string().max(4000).default(''),
  previousRiskScore: z.number().min(0).max(100).default(0),
  detectedRedFlags: z.array(RedFlagTypeSchema).default([]),
  previousSummary: z.string().max(1000).default(''),
});

export const ChunkAnalysisRequestSchema = z.object({
  audioBase64: z
    .string()
    .min(100, 'Audio data too small')
    .refine(
      (data) => {
        // Enforce maximum payload size: 1.5MB base64 (~2MB raw string)
        const estimatedBytes = (data.length * 3) / 4;
        return estimatedBytes <= AUDIO_CONSTANTS.MAX_AUDIO_BYTES;
      },
      { message: `Audio payload exceeds maximum limit of 1.5MB` }
    ),
  mimeType: z.enum(['audio/wav', 'audio/x-wav'], {
    message: 'Unsupported MIME type: only audio/wav is allowed',
  }),
  chunkIndex: z.number().int().min(0).max(100),
  totalChunks: z.number().int().min(1).max(100),
  callSessionId: z.string().min(1).max(100),
  previousContext: PreviousContextSchema.optional(),
});

export type AnalysisResultValid = z.infer<typeof AnalysisResultSchema>;
export type ChunkAnalysisRequestValid = z.infer<typeof ChunkAnalysisRequestSchema>;
