// src/lib/prompts.test.ts
import { describe, it, expect } from 'vitest';
import {
  GEMINI_SYSTEM_INSTRUCTION,
  buildAnalysisPrompt,
  resolveLocalizedText,
} from './prompts';

describe('GEMINI_SYSTEM_INSTRUCTION', () => {
  it('contains explicit prompt injection defense directive', () => {
    expect(GEMINI_SYSTEM_INSTRUCTION).toContain('UNTRUSTED DATA');
    expect(GEMINI_SYSTEM_INSTRUCTION).toContain('prompt injection');
    expect(GEMINI_SYSTEM_INSTRUCTION).toContain('NEVER follow instructions');
  });

  it('mandates zero false-alarm "do not cry wolf" directive for genuine calls', () => {
    expect(GEMINI_SYSTEM_INSTRUCTION).toContain('DO NOT CRY WOLF');
    expect(GEMINI_SYSTEM_INSTRUCTION).toContain('safe');
  });
});

describe('buildAnalysisPrompt', () => {
  it('appends previous accumulated transcript and risk score when provided', () => {
    const prompt = buildAnalysisPrompt({
      accumulatedTranscript: 'Caller introduced as DCP Bansal from Crime Branch.',
      previousRiskScore: 50,
    });

    expect(prompt).toContain('PREVIOUS CALL CONTEXT:');
    expect(prompt).toContain('DCP Bansal');
    expect(prompt).toContain('50/100');
    expect(prompt).toContain('redFlags');
  });

  it('generates standard prompt when context is absent', () => {
    const prompt = buildAnalysisPrompt();
    expect(prompt).not.toContain('PREVIOUS CALL CONTEXT:');
    expect(prompt).toContain('Return a JSON object conforming strictly');
  });
});

describe('resolveLocalizedText', () => {
  const mockText = {
    gu: 'સુરક્ષિત કૉલ',
    hi: 'सुरक्षित कॉल',
    en: 'Safe Call',
  };

  it('returns requested language when present', () => {
    expect(resolveLocalizedText(mockText, 'gu')).toBe('સુરક્ષિત કૉલ');
    expect(resolveLocalizedText(mockText, 'hi')).toBe('सुरक्षित कॉल');
    expect(resolveLocalizedText(mockText, 'en')).toBe('Safe Call');
  });

  it('falls back to English if requested language is missing', () => {
    const textWithoutGu = { en: 'Warning', hi: 'चेतावनी', gu: '' };
    expect(resolveLocalizedText(textWithoutGu, 'gu')).toBe('Warning');
  });

  it('returns empty string on null or undefined input', () => {
    expect(resolveLocalizedText(null, 'en')).toBe('');
    expect(resolveLocalizedText(undefined, 'hi')).toBe('');
  });
});
