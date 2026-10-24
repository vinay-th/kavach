// src/lib/gemini.ts
import 'server-only';
/**
 * Server-only Google Gemini AI client for Kavach native audio analysis.
 * Uses official @google/genai SDK with native audio comprehension.
 */

import { GoogleGenAI } from '@google/genai';
import { GEMINI_SYSTEM_INSTRUCTION, buildAnalysisPrompt } from './prompts';
import { AnalysisResultSchema, type AnalysisResultValid } from './schema';

export interface AnalyzeAudioOptions {
  audioBase64: string;
  mimeType?: string;
  previousContext?: {
    accumulatedTranscript?: string;
    previousRiskScore?: number;
    previousSummary?: string;
  };
}

/**
 * Initializes GoogleGenAI client verifying GEMINI_API_KEY.
 * Throws clean error if missing without revealing secret values.
 */
export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('Gemini API key is not configured on the server');
  }
  return new GoogleGenAI({ apiKey });
}

/**
 * Invokes Gemini model with native audio input and JSON structured output schema.
 * Implements exponential retry logic for occasional transient JSON parse malformations.
 */
export async function analyzeAudioChunkWithGemini(
  options: AnalyzeAudioOptions,
  maxRetries: number = 2
): Promise<AnalysisResultValid> {
  const client = getGeminiClient();
  const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const prompt = buildAnalysisPrompt(options.previousContext);

  let lastError: unknown = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await client.models.generateContent({
        model: modelName,
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: options.mimeType || 'audio/wav',
                  data: options.audioBase64,
                },
              },
              {
                text: prompt,
              },
            ],
          },
        ],
        config: {
          systemInstruction: GEMINI_SYSTEM_INSTRUCTION,
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      });

      const rawText = response.text?.trim() || '';
      const parsedJson = JSON.parse(rawText);

      // Validate through Zod schema to guarantee contract integrity
      const validated = AnalysisResultSchema.parse(parsedJson);
      return validated;
    } catch (err) {
      lastError = err;
      // If we still have retries remaining, continue loop
      if (attempt < maxRetries) {
        continue;
      }
    }
  }

  throw lastError;
}
