// src/lib/rate-limit.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SlidingWindowRateLimiter } from './rate-limit';

describe('SlidingWindowRateLimiter', () => {
  let limiter: SlidingWindowRateLimiter;

  beforeEach(() => {
    vi.useFakeTimers();
    // 3 requests allowed per 10-second window for testing
    limiter = new SlidingWindowRateLimiter(3, 10_000);
  });

  it('allows requests up to the max capacity and decrements remaining', () => {
    const ip = '192.168.1.100';
    const r1 = limiter.check(ip);
    expect(r1.success).toBe(true);
    expect(r1.remaining).toBe(2);

    const r2 = limiter.check(ip);
    expect(r2.success).toBe(true);
    expect(r2.remaining).toBe(1);

    const r3 = limiter.check(ip);
    expect(r3.success).toBe(true);
    expect(r3.remaining).toBe(0);
  });

  it('blocks request when limit is exceeded and returns Retry-After duration', () => {
    const ip = '192.168.1.100';
    limiter.check(ip);
    limiter.check(ip);
    limiter.check(ip);

    // 4th request exceeds limit
    const blocked = limiter.check(ip);
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it('recovers allowed quota after sliding window expires', () => {
    const ip = '192.168.1.100';
    limiter.check(ip);
    limiter.check(ip);
    limiter.check(ip);

    // Verify blocked initially
    expect(limiter.check(ip).success).toBe(false);

    // Advance time past 10 seconds
    vi.advanceTimersByTime(11_000);

    // Should succeed again
    const afterExpiry = limiter.check(ip);
    expect(afterExpiry.success).toBe(true);
    expect(afterExpiry.remaining).toBe(2);
  });

  it('isolates rate limits by client identifier', () => {
    const ip1 = '10.0.0.1';
    const ip2 = '10.0.0.2';

    limiter.check(ip1);
    limiter.check(ip1);
    limiter.check(ip1);
    expect(limiter.check(ip1).success).toBe(false);

    // ip2 should still be allowed full quota
    expect(limiter.check(ip2).success).toBe(true);
  });
});
