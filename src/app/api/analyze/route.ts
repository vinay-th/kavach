// src/app/api/analyze/route.ts
/**
 * Real-time audio chunk analysis API route.
 * Accepts 16kHz mono WAV base64 audio chunks, validates input with Zod,
 * applies sliding-window IP rate limiting, and forwards to Gemini audio model.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { ChunkAnalysisRequestSchema } from '@/lib/schema';
import { apiRateLimiter } from '@/lib/rate-limit';
import { analyzeAudioChunkWithGemini } from '@/lib/gemini';
import { AUDIO_CONSTANTS } from '@/lib/constants';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  // 1. IP extraction & rate limiting
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0]?.trim() || 'unknown' : '127.0.0.1';

  const rateCheck = apiRateLimiter.check(ip);
  if (!rateCheck.success) {
    return NextResponse.json(
      { error: 'Too many analysis requests. Please slow down.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateCheck.retryAfterSeconds || 10),
        },
      }
    );
  }

  // 2. Payload size check
  const contentLength = req.headers.get('content-length');
  if (contentLength && parseInt(contentLength, 10) > AUDIO_CONSTANTS.MAX_AUDIO_BYTES * 1.5) {
    return NextResponse.json(
      { error: 'Audio chunk payload exceeds maximum allowed limit.' },
      { status: 413 }
    );
  }

  // 3. Body parse and Zod validation
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON request payload.' },
      { status: 400 }
    );
  }

  const validation = ChunkAnalysisRequestSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      {
        error: 'Invalid request parameters.',
        details: validation.error.issues?.map((e) => e.message) || [validation.error.message],
      },
      { status: 400 }
    );
  }

  const { audioBase64, mimeType, previousContext } = validation.data;

  // 4. Gemini AI Model Call with error isolation
  try {
    const result = await analyzeAudioChunkWithGemini({
      audioBase64,
      mimeType,
      previousContext,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '';

    if (message.includes('API key is not configured')) {
      return NextResponse.json(
        { error: 'Analysis service configuration error.' },
        { status: 500 }
      );
    }

    // Generic 502 for upstream/model parsing failure without leaking stack trace
    return NextResponse.json(
      { error: 'Failed to process audio intelligence.' },
      { status: 502 }
    );
  }
}
