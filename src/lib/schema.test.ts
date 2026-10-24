// src/lib/schema.test.ts
import { describe, it, expect } from 'vitest';
import {
  AnalysisResultSchema,
  ChunkAnalysisRequestSchema,
  VerdictSchema,
} from './schema';

describe('AnalysisResultSchema', () => {
  const validResult = {
    transcript: 'You are under digital arrest. Pay money now.',
    languageDetected: 'en-IN',
    riskScore: 94,
    verdict: 'scam',
    redFlags: [
      { type: 'fake_authority', evidence: 'Claims to be Mumbai Police officer' },
      { type: 'money_request', evidence: 'Demands ₹50,000 transfer' },
    ],
    explanation: {
      en: 'This is 100% a scam! Police never arrest over video calls.',
      hi: 'यह 100% फ्रॉड है! पुलिस कभी वीडियो कॉल पर गिरफ्तार नहीं करती।',
      gu: 'આ ૧૦૦% છેતરપિંડી છે! પોલીસ ક્યારેય વિડિયો કૉલ પર ધરપકડ નથી કરતી.',
    },
    recommendedAction: {
      en: 'Hang up immediately! Call 1930.',
      hi: 'तुरंत फ़ोन काटें! 1930 पर कॉल करें।',
      gu: 'તરત જ કૉલ કાપી નાખો! 1930 પર ફોન કરો.',
    },
  };

  it('accepts a fully valid AnalysisResult', () => {
    const parsed = AnalysisResultSchema.safeParse(validResult);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.riskScore).toBe(94);
      expect(parsed.data.verdict).toBe('scam');
    }
  });

  it('rejects out-of-range riskScore (<0 or >100)', () => {
    const low = AnalysisResultSchema.safeParse({ ...validResult, riskScore: -5 });
    expect(low.success).toBe(false);

    const high = AnalysisResultSchema.safeParse({ ...validResult, riskScore: 105 });
    expect(high.success).toBe(false);
  });

  it('rejects unknown verdict', () => {
    const invalid = AnalysisResultSchema.safeParse({ ...validResult, verdict: 'dangerous' });
    expect(invalid.success).toBe(false);
  });

  it('rejects missing localized explanation fields', () => {
    const missingGu = AnalysisResultSchema.safeParse({
      ...validResult,
      explanation: { en: 'Scam', hi: 'धोखाधड़ी' },
    });
    expect(missingGu.success).toBe(false);
  });

  it('rejects invalid red flag types', () => {
    const invalidFlag = AnalysisResultSchema.safeParse({
      ...validResult,
      redFlags: [{ type: 'unknown_flag_type', evidence: 'bad' }],
    });
    expect(invalidFlag.success).toBe(false);
  });
});

describe('ChunkAnalysisRequestSchema', () => {
  const validRequest = {
    audioBase64: 'UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=',
    mimeType: 'audio/wav',
    chunkIndex: 0,
    totalChunks: 4,
    callSessionId: 'sess-999',
  };

  it('accepts valid chunk analysis requests', () => {
    // Pad to exceed min length
    const request = {
      ...validRequest,
      audioBase64: 'A'.repeat(200),
    };
    const parsed = ChunkAnalysisRequestSchema.safeParse(request);
    expect(parsed.success).toBe(true);
  });

  it('rejects unsupported audio MIME types (e.g. mp3, ogg, webm)', () => {
    const invalidMime = ChunkAnalysisRequestSchema.safeParse({
      ...validRequest,
      audioBase64: 'A'.repeat(200),
      mimeType: 'audio/mp3',
    });
    expect(invalidMime.success).toBe(false);
  });

  it('rejects negative or excessively large chunkIndex', () => {
    const negativeIndex = ChunkAnalysisRequestSchema.safeParse({
      ...validRequest,
      audioBase64: 'A'.repeat(200),
      chunkIndex: -1,
    });
    expect(negativeIndex.success).toBe(false);

    const outOfBoundsIndex = ChunkAnalysisRequestSchema.safeParse({
      ...validRequest,
      audioBase64: 'A'.repeat(200),
      chunkIndex: 1000,
    });
    expect(outOfBoundsIndex.success).toBe(false);
  });

  it('rejects oversized payload exceeding 1.5MB base64', () => {
    // 2.5MB payload
    const oversizedBase64 = 'A'.repeat(2.5 * 1024 * 1024);
    const result = ChunkAnalysisRequestSchema.safeParse({
      ...validRequest,
      audioBase64: oversizedBase64,
    });
    expect(result.success).toBe(false);
  });
});
