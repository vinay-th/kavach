// src/app/api/analyze/route.test.ts
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';
import { apiRateLimiter } from '@/lib/rate-limit';

// Mock server-only module
vi.mock('server-only', () => ({}));

// Mock @google/genai SDK
const mockGenerateContent = vi.fn();
vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: vi.fn().mockImplementation(() => ({
      models: {
        generateContent: mockGenerateContent,
      },
    })),
  };
});

describe('POST /api/analyze', () => {
  const originalEnv = process.env;

  const validPayload = {
    audioBase64: 'UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=' + 'A'.repeat(200),
    mimeType: 'audio/wav',
    chunkIndex: 0,
    totalChunks: 4,
    callSessionId: 'test-session-1',
  };

  const validModelResponse = {
    transcript: 'This is Crime Branch. Transfer funds to avoid arrest.',
    languageDetected: 'en-IN',
    riskScore: 92,
    verdict: 'scam',
    redFlags: [
      { type: 'fake_authority', evidence: 'Claims to be Crime Branch' },
      { type: 'money_request', evidence: 'Demands funds transfer' },
    ],
    explanation: {
      en: 'Scam call impersonating police.',
      hi: 'पुलिस बन कर फ्रॉड कॉल।',
      gu: 'પોલીસ બનીને છેતરપિંડી કૉલ.',
    },
    recommendedAction: {
      en: 'Hang up immediately.',
      hi: 'तुरंत फ़ोन काटें।',
      gu: 'તરત ફોન કાપો.',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    apiRateLimiter.clear();
    process.env = { ...originalEnv, GEMINI_API_KEY: 'test-valid-key', GEMINI_MODEL: 'gemini-2.5-flash' };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  function createRequest(body: unknown, headers: Record<string, string> = {}) {
    const reqHeaders = new Headers({
      'content-type': 'application/json',
      'x-forwarded-for': '127.0.0.1',
      ...headers,
    });

    return new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      headers: reqHeaders,
      body: typeof body === 'string' ? body : JSON.stringify(body),
    });
  }

  it('returns 200 with schema-valid analysis result on valid request', async () => {
    mockGenerateContent.mockResolvedValueOnce({
      text: JSON.stringify(validModelResponse),
    });

    const req = createRequest(validPayload);
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.riskScore).toBe(92);
    expect(json.verdict).toBe('scam');
    expect(json.redFlags).toHaveLength(2);
  });

  it('retries when model returns malformed JSON on first attempt and succeeds on second', async () => {
    mockGenerateContent
      .mockResolvedValueOnce({ text: 'INVALID_JSON{{{' })
      .mockResolvedValueOnce({ text: JSON.stringify(validModelResponse) });

    const req = createRequest(validPayload);
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.riskScore).toBe(92);
    expect(mockGenerateContent).toHaveBeenCalledTimes(2);
  });

  it('returns 502 with generic message when model retries are exhausted without leaking stack traces', async () => {
    mockGenerateContent.mockResolvedValue({ text: 'CORRUPTED_RESPONSE' });

    const req = createRequest(validPayload);
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(502);
    expect(json.error).toBe('Failed to process audio intelligence.');
    expect(json.stack).toBeUndefined();
  });

  it('returns 413 when content-length or body payload is oversized', async () => {
    const req = createRequest(validPayload, {
      'content-length': String(3 * 1024 * 1024), // 3MB header
    });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(413);
    expect(json.error).toContain('payload exceeds maximum');
  });

  it('returns 400 when MIME type is unsupported or body fails Zod schema', async () => {
    const badMimePayload = {
      ...validPayload,
      mimeType: 'audio/mp3',
    };
    const req = createRequest(badMimePayload);
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('Invalid request parameters.');
  });

  it('returns 429 with Retry-After header when rate limit is exceeded', async () => {
    mockGenerateContent.mockResolvedValue({
      text: JSON.stringify(validModelResponse),
    });

    // Make 15 successful requests (the limit)
    for (let i = 0; i < 15; i++) {
      const r = await POST(createRequest(validPayload));
      expect(r.status).toBe(200);
    }

    // 16th request is blocked
    const blockedRes = await POST(createRequest(validPayload));
    expect(blockedRes.status).toBe(429);
    expect(blockedRes.headers.get('Retry-After')).toBeTruthy();
  });

  it('returns 500 when GEMINI_API_KEY is missing without leaking the secret name or value', async () => {
    delete process.env.GEMINI_API_KEY;

    const req = createRequest(validPayload);
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe('Analysis service configuration error.');
    expect(JSON.stringify(json)).not.toContain('GEMINI_API_KEY');
  });
});
