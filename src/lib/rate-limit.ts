// src/lib/rate-limit.ts
/**
 * In-memory sliding-window rate limiter.
 * Limits calls per client IP to prevent abuse and denial-of-service against the Gemini audio endpoint.
 * In distributed production deployments, this can be swapped with Redis or Upstash.
 */

import { RATE_LIMIT_CONSTANTS } from './constants';

export interface RateLimitResult {
  /** Whether the request is permitted */
  success: boolean;
  /** Number of remaining allowed requests in current window */
  remaining: number;
  /** Timestamp when window resets */
  resetTime: number;
  /** Seconds until client can retry if blocked */
  retryAfterSeconds?: number;
}

export class SlidingWindowRateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(
    maxRequests: number = RATE_LIMIT_CONSTANTS.MAX_REQUESTS_PER_WINDOW,
    windowMs: number = RATE_LIMIT_CONSTANTS.WINDOW_MS
  ) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  /**
   * Evaluates request from a given identifier (e.g. IP address).
   */
  check(identifier: string, now: number = Date.now()): RateLimitResult {
    const windowStart = now - this.windowMs;
    const timestamps = this.requests.get(identifier) ?? [];

    // Filter out timestamps outside current sliding window
    const validTimestamps = timestamps.filter((time) => time > windowStart);

    if (validTimestamps.length >= this.maxRequests) {
      const oldestInWindow = validTimestamps[0] ?? windowStart;
      const resetTime = oldestInWindow + this.windowMs;
      const retryAfterSeconds = Math.max(1, Math.ceil((resetTime - now) / 1000));

      this.requests.set(identifier, validTimestamps);
      return {
        success: false,
        remaining: 0,
        resetTime,
        retryAfterSeconds,
      };
    }

    // Record this request
    validTimestamps.push(now);
    this.requests.set(identifier, validTimestamps);

    return {
      success: true,
      remaining: this.maxRequests - validTimestamps.length,
      resetTime: now + this.windowMs,
    };
  }

  /**
   * Resets limiter storage (useful for test isolation).
   */
  clear(): void {
    this.requests.clear();
  }
}

/** Global shared instance for API route handlers */
export const apiRateLimiter = new SlidingWindowRateLimiter();
