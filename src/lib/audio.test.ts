// src/lib/audio.test.ts
import { describe, it, expect } from 'vitest';
import {
  encodeWav,
  computeChunkWindows,
  mixToMono,
  resampleBuffer,
  floatTo16BitPCM,
  bufferToBase64,
  base64ToUint8Array,
} from './audio';

describe('encodeWav', () => {
  it('generates a valid RIFF/WAVE header with PCM format 1 and correct sample rate', () => {
    const samples = new Int16Array([0, 1000, -1000, 2000, -2000]);
    const wavBuffer = encodeWav(samples, 16000, 1);
    const view = new DataView(wavBuffer);

    // Check RIFF header
    const riff = String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3));
    expect(riff).toBe('RIFF');

    const wave = String.fromCharCode(view.getUint8(8), view.getUint8(9), view.getUint8(10), view.getUint8(11));
    expect(wave).toBe('WAVE');

    // "fmt " chunk
    const fmt = String.fromCharCode(view.getUint8(12), view.getUint8(13), view.getUint8(14), view.getUint8(15));
    expect(fmt).toBe('fmt ');

    expect(view.getUint16(20, true)).toBe(1); // AudioFormat PCM = 1
    expect(view.getUint16(22, true)).toBe(1); // NumChannels = 1 (Mono)
    expect(view.getUint32(24, true)).toBe(16000); // SampleRate = 16000
    expect(view.getUint16(34, true)).toBe(16); // BitsPerSample = 16

    // "data" chunk
    const data = String.fromCharCode(view.getUint8(36), view.getUint8(37), view.getUint8(38), view.getUint8(39));
    expect(data).toBe('data');
    expect(view.getUint32(40, true)).toBe(samples.length * 2);

    // Audio samples at offset 44
    expect(view.getInt16(44, true)).toBe(0);
    expect(view.getInt16(46, true)).toBe(1000);
    expect(view.getInt16(48, true)).toBe(-1000);
  });
});

describe('computeChunkWindows', () => {
  it('calculates correct chunk counts and overlap offsets', () => {
    // 20-second call with 6s chunks and 1s overlap => step = 5s
    // Windows: [0-6], [5-11], [10-16], [15-20]
    const windows = computeChunkWindows(20, 6, 1);
    expect(windows).toHaveLength(4);

    expect(windows[0]).toEqual({
      index: 0,
      startSeconds: 0,
      endSeconds: 6,
      durationSeconds: 6,
    });

    expect(windows[1]).toEqual({
      index: 1,
      startSeconds: 5,
      endSeconds: 11,
      durationSeconds: 6,
    });

    expect(windows[3]).toEqual({
      index: 3,
      startSeconds: 15,
      endSeconds: 20,
      durationSeconds: 5,
    });
  });

  it('returns empty array for non-positive duration', () => {
    expect(computeChunkWindows(0)).toEqual([]);
    expect(computeChunkWindows(-10)).toEqual([]);
  });
});

describe('mixToMono', () => {
  it('averages stereo channels into a single mono channel', () => {
    const left = new Float32Array([1.0, 0.5, -0.5]);
    const right = new Float32Array([0.0, 0.5, 0.5]);
    const mono = mixToMono([left, right]);

    expect(mono).toHaveLength(3);
    expect(mono[0]).toBeCloseTo(0.5);
    expect(mono[1]).toBeCloseTo(0.5);
    expect(mono[2]).toBeCloseTo(0.0);
  });

  it('handles single channel without mutation', () => {
    const channel = new Float32Array([0.2, 0.4]);
    expect(mixToMono([channel])).toBe(channel);
  });
});

describe('resampleBuffer', () => {
  it('calculates correct resampled output buffer length', () => {
    // Resample 44.1kHz (44100 samples) to 16kHz
    const input = new Float32Array(44100);
    const resampled = resampleBuffer(input, 44100, 16000);
    expect(resampled.length).toBe(16000);
  });

  it('returns original buffer when sample rates match', () => {
    const input = new Float32Array([0.1, 0.2, 0.3]);
    expect(resampleBuffer(input, 16000, 16000)).toBe(input);
  });
});

describe('floatTo16BitPCM & Base64 conversions', () => {
  it('converts normalized floats to 16-bit PCM integer range', () => {
    const floats = new Float32Array([0.0, 1.0, -1.0, 0.5]);
    const pcm = floatTo16BitPCM(floats);

    expect(pcm[0]).toBe(0);
    expect(pcm[1]).toBe(32767);
    expect(pcm[2]).toBe(-32768);
    expect(pcm[3]).toBe(16383);
  });

  it('roundtrips buffer to base64 and back', () => {
    const original = new Uint8Array([1, 2, 3, 4, 5, 255]);
    const base64 = bufferToBase64(original.buffer);
    const restored = base64ToUint8Array(base64);

    expect(Array.from(restored)).toEqual(Array.from(original));
  });
});
