// src/lib/constants.ts
/**
 * Global constants for Kavach AI Scam Shield.
 * All magic numbers for audio processing, risk evaluation, and thresholds are centralized here.
 */

/** Audio format constraints expected by Gemini audio input */
export const AUDIO_CONSTANTS = {
  /** Target sample rate in Hz (16kHz recommended for speech intelligence) */
  SAMPLE_RATE: 16000,
  /** Number of channels (Mono) */
  CHANNELS: 1,
  /** Bits per sample (16-bit signed PCM) */
  BIT_DEPTH: 16,
  /** Chunk length in seconds for continuous analysis */
  CHUNK_DURATION_SECONDS: 6,
  /** Overlap duration in seconds between consecutive chunks to avoid boundary clipping */
  CHUNK_OVERLAP_SECONDS: 1,
  /** Maximum audio file upload size in bytes (1.5 MB) */
  MAX_AUDIO_BYTES: 1.5 * 1024 * 1024,
  /** Allowed audio MIME types */
  ALLOWED_MIME_TYPES: ['audio/wav', 'audio/x-wav'] as const,
} as const;

/** Risk score verdict boundaries (0 - 100) */
export const RISK_THRESHOLDS = {
  /** Upper boundary for safe verdict (0 - 34) */
  SAFE_MAX: 34,
  /** Lower boundary for suspicious warning (35 - 69) */
  SUSPICIOUS_MIN: 35,
  /** Upper boundary for suspicious warning */
  SUSPICIOUS_MAX: 69,
  /** Lower boundary for confirmed scam alert (70 - 100) */
  SCAM_MIN: 70,
  /** Maximum possible risk score */
  MAX_SCORE: 100,
  /** Minimum possible risk score */
  MIN_SCORE: 0,
} as const;

/** Rate limiting defaults (per client IP) */
export const RATE_LIMIT_CONSTANTS = {
  /** Maximum chunk analysis requests per window */
  MAX_REQUESTS_PER_WINDOW: 15,
  /** Sliding window duration in milliseconds (60 seconds) */
  WINDOW_MS: 60 * 1000,
} as const;

/** Emergency Contacts & National Helplines */
export const HELPLINE_CONSTANTS = {
  /** Indian National Cyber Crime Reporting Helpline */
  CYBER_HELPLINE: '1930',
  /** Official Cyber Crime Reporting Portal */
  CYBER_PORTAL_URL: 'https://cybercrime.gov.in',
} as const;
