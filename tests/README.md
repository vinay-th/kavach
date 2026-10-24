# Kavach Test Suite & Verification Strategy

This directory contains shared test fixtures, mocks, and integration test suites for Kavach. Unit and component tests are colocated alongside their source files in `src/` as `*.test.ts` / `*.test.tsx`.

---

## Running Tests

```bash
# Run all unit, component, and regression tests once
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report with thresholds check (>=70% lines, functions, branches, statements)
npm run test:coverage

# Run Playwright E2E tests
npm run test:e2e
```

---

## Test Organization & Coverage Matrix

| Test File | Type | What It Covers |
|---|---|---|
| `src/lib/risk.test.ts` | Unit | Monotonic risk accumulation, thresholds (34 safe, 35 suspicious, 69 suspicious, 70 scam), deduplication of red flags, score clamping [0, 100], and contradiction handling. |
| `src/lib/audio.test.ts` | Unit | Audio chunk math, RIFF/WAVE header encoding, 16kHz mono mixdown, sample rate validation, and chunk sizing. |
| `src/lib/schema.test.ts` | Unit | Zod validation of `AnalysisResult`, rejection of negative scores, scores >100, invalid verdicts, and missing localized fields. |
| `src/lib/rate-limit.test.ts` | Unit | Sliding window rate limiter: permits requests within capacity, rejects over-limit with 429 and `Retry-After`, and replenishes after time window. |
| `src/lib/prompts.test.ts` | Unit | Prompt builder, language fallback selection, and prompt-injection defense directives. |
| `src/app/api/analyze/route.test.ts` | API Route | Gemini API integration: valid payload 200, malformed model JSON retry, retries exhausted 502, oversized payload 413, wrong MIME 400, rate limited 429, missing key 500 without leaking secrets. |
| `src/components/shield/WarningBanner.test.tsx` | Component | `role="alert"`, `aria-live="assertive"`, multilingual Gujarati/Hindi/English rendering, emergency action triggers. |
| `src/components/shield/RiskGauge.test.tsx` | Component | `role="meter"`, accessibility attributes (`aria-valuenow`, `aria-valuemin`, `aria-valuemax`), and verdict text badges. |
| `src/components/shield/FlagChip.test.tsx` | Component | Accessible flag chip rendering, icon + text representation (not color alone), and evidence tooltip trigger. |
| `src/components/shield/CallLibrary.test.tsx` | Component | Scenario selection, keyboard navigation (`Enter` and `Space`), and active state highlighting. |
| `src/components/locale/LanguageToggle.test.tsx` | Component | Switching active language across English, Hindi, and Gujarati, updating context state. |
| `src/hooks/useCallAnalysis.test.ts` | Hook | Progression from safe -> suspicious -> scam, elapsed timing, and ensuring genuine delivery calls remain safe. |
| `tests/regression-cry-wolf.test.ts` | Regression | Verifying genuine calls never exceed 'safe', scam calls trigger mid-call alert before final chunk, all 5 key red flags are identified, and no Web Speech API or client-side secret leakage exists. |
