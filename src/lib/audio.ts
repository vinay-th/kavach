// src/lib/audio.ts
/**
 * Audio processing utilities for Kavach.
 * Handles PCM 16-bit encoding, WAV header construction, mono downmixing,
 * resampling, and streaming chunk window partitioning for native Gemini audio models.
 */

import { AUDIO_CONSTANTS } from './constants';

export interface ChunkWindow {
  index: number;
  startSeconds: number;
  endSeconds: number;
  durationSeconds: number;
}

/**
 * Calculates sliding chunk windows over an audio timeline with configurable duration and overlap.
 */
export function computeChunkWindows(
  totalDurationSeconds: number,
  chunkDuration: number = AUDIO_CONSTANTS.CHUNK_DURATION_SECONDS,
  overlap: number = AUDIO_CONSTANTS.CHUNK_OVERLAP_SECONDS
): ChunkWindow[] {
  if (totalDurationSeconds <= 0 || chunkDuration <= 0) {
    return [];
  }

  const step = Math.max(1, chunkDuration - overlap);
  const windows: ChunkWindow[] = [];
  let start = 0;
  let index = 0;

  while (start < totalDurationSeconds) {
    const end = Math.min(totalDurationSeconds, start + chunkDuration);
    windows.push({
      index,
      startSeconds: Number(start.toFixed(2)),
      endSeconds: Number(end.toFixed(2)),
      durationSeconds: Number((end - start).toFixed(2)),
    });
    index++;
    start += step;

    if (end >= totalDurationSeconds) {
      break;
    }
  }

  return windows;
}

/**
 * Encodes raw 16-bit linear PCM samples into a standard, self-describing RIFF/WAVE ArrayBuffer.
 */
export function encodeWav(
  pcmSamples: Int16Array,
  sampleRate: number = AUDIO_CONSTANTS.SAMPLE_RATE,
  channels: number = AUDIO_CONSTANTS.CHANNELS
): ArrayBuffer {
  const byteRate = sampleRate * channels * 2;
  const blockAlign = channels * 2;
  const dataSize = pcmSamples.length * 2;
  const bufferSize = 44 + dataSize;
  const buffer = new ArrayBuffer(bufferSize);
  const view = new DataView(buffer);

  // Helper to write ASCII strings
  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  // RIFF Chunk Descriptor
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true); // Total file size - 8 bytes
  writeString(8, 'WAVE');

  // "fmt " Subchunk
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size for PCM
  view.setUint16(20, 1, true); // AudioFormat 1 = Linear PCM
  view.setUint16(22, channels, true); // NumChannels
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, byteRate, true); // ByteRate
  view.setUint16(32, blockAlign, true); // BlockAlign
  view.setUint16(34, 16, true); // BitsPerSample

  // "data" Subchunk
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  // Write PCM audio samples
  let offset = 44;
  for (let i = 0; i < pcmSamples.length; i++) {
    const sample = pcmSamples[i] ?? 0;
    view.setInt16(offset, sample, true);
    offset += 2;
  }

  return buffer;
}

/**
 * Downmixes multi-channel audio buffers into a single mono channel.
 */
export function mixToMono(channels: Float32Array[]): Float32Array {
  if (channels.length === 0 || !channels[0]) {
    return new Float32Array(0);
  }
  if (channels.length === 1) {
    return channels[0];
  }

  const length = channels[0].length;
  const mono = new Float32Array(length);
  const numChannels = channels.length;

  for (let i = 0; i < length; i++) {
    let sum = 0;
    for (let c = 0; c < numChannels; c++) {
      const channelData = channels[c];
      if (channelData) {
        sum += channelData[i] ?? 0;
      }
    }
    mono[i] = sum / numChannels;
  }

  return mono;
}

/**
 * Resamples a Float32Array buffer to a target sample rate via linear interpolation.
 */
export function resampleBuffer(
  input: Float32Array,
  inputSampleRate: number,
  targetSampleRate: number
): Float32Array {
  if (input.length === 0 || inputSampleRate === targetSampleRate) {
    return input;
  }

  const ratio = targetSampleRate / inputSampleRate;
  const outputLength = Math.max(1, Math.round(input.length * ratio));
  const output = new Float32Array(outputLength);

  for (let i = 0; i < outputLength; i++) {
    const srcIndex = i / ratio;
    const indexLow = Math.floor(srcIndex);
    const indexHigh = Math.min(input.length - 1, indexLow + 1);
    const fraction = srcIndex - indexLow;

    const sampleLow = input[indexLow] ?? 0;
    const sampleHigh = input[indexHigh] ?? 0;
    output[i] = sampleLow + (sampleHigh - sampleLow) * fraction;
  }

  return output;
}

/**
 * Converts Float32 normalized audio (-1.0 to +1.0) to 16-bit signed PCM Int16Array.
 */
export function floatTo16BitPCM(input: Float32Array): Int16Array {
  const output = new Int16Array(input.length);
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i] ?? 0));
    output[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return output;
}

/**
 * Converts ArrayBuffer to Base64 string.
 */
export function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i] ?? 0);
  }
  if (typeof btoa !== 'undefined') {
    return btoa(binary);
  }
  return Buffer.from(binary, 'binary').toString('base64');
}

/**
 * Converts Base64 string to Uint8Array.
 */
export function base64ToUint8Array(base64: string): Uint8Array {
  if (typeof atob !== 'undefined') {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
  return new Uint8Array(Buffer.from(base64, 'base64'));
}
