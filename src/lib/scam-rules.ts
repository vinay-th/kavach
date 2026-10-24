// src/lib/scam-rules.ts
import type { Verdict, RedFlagType } from '@/types/analysis';
import type { CallScenario } from '@/types/call';

// Verdict thresholds
export const VERDICT_THRESHOLDS = {
  safe: { min: 0, max: 34 },
  suspicious: { min: 35, max: 69 },
  scam: { min: 70, max: 100 },
} as const;

export function scoreToVerdict(score: number): Verdict {
  if (score >= VERDICT_THRESHOLDS.scam.min) return 'scam';
  if (score >= VERDICT_THRESHOLDS.suspicious.min) return 'suspicious';
  return 'safe';
}

/** Risk score can only rise or hold within a session */
export function clampRiskScore(previous: number, incoming: number): number {
  return Math.max(previous, Math.min(100, Math.round(incoming)));
}

// Human-readable labels for each red flag type
export const RED_FLAG_LABELS: Record<RedFlagType, { en: string; hi: string; gu: string }> = {
  urgency: {
    en: 'Urgency / Panic Induction',
    hi: 'तत्कालीन दबाव',
    gu: 'ઉતાવળ / ગભરાટ',
  },
  threat: {
    en: 'Threat / Coercion',
    hi: 'धमकी / डर',
    gu: 'ધમકી / દબાણ',
  },
  otp_request: {
    en: 'OTP / PIN Request',
    hi: 'OTP / PIN मांगना',
    gu: 'OTP / PIN ની માગ',
  },
  money_request: {
    en: 'Money Transfer Request',
    hi: 'पैसे ट्रांसफर की मांग',
    gu: 'પૈસા ટ્રાન્સફર ની માગ',
  },
  fake_authority: {
    en: 'Fake Authority (Police / CBI / Bank)',
    hi: 'नकली अधिकारी (पुलिस / CBI / बैंक)',
    gu: 'નકલી અધિકારી (પોલીસ / CBI / બેન્ક)',
  },
  secrecy: {
    en: 'Secrecy Demand',
    hi: 'गोपनीयता की मांग',
    gu: 'ગોપનીયતા ની માગ',
  },
  remote_access: {
    en: 'Remote Access / App Install',
    hi: 'रिमोट ऐक्सेस / ऐप इंस्टॉल',
    gu: 'રિમોટ ઍક્સેસ / ઍપ ઇન્સ્ટૉલ',
  },
};

// Demo call scenarios
export const DEMO_SCENARIOS: CallScenario[] = [
  {
    id: 'scam-digital-arrest',
    title: 'Digital Arrest Scam — CBI Mumbai',
    callerName: 'ACP Sharma (Fake)',
    callerNumber: '+91 22 2261 XXXX (Spoofed)',
    duration: '02:45',
    expectedVerdict: 'scam',
    audioFile: '/calls/scam-digital-arrest.wav',
    description:
      'Impersonates Mumbai Cyber Crime Branch officer, claims parcel with narcotics found in your name, demands "Digital Arrest" over video call.',
  },
  {
    id: 'scam-courier-customs',
    title: 'Courier Customs Scam — FedEx',
    callerName: 'FedEx Customs (Fake)',
    callerNumber: '+91 80 4112 XXXX',
    duration: '01:50',
    expectedVerdict: 'scam',
    audioFile: '/calls/scam-courier-customs.wav',
    description:
      'Claims a parcel shipped to Taiwan was intercepted with MDMA. Transfers to fake "police officer" demanding payment to avoid arrest.',
  },
  {
    id: 'scam-bank-kyc',
    title: 'Fake Bank KYC Block — HDFC',
    callerName: 'HDFC KYC Helpdesk (Fake)',
    callerNumber: '+91 98 2001 XXXX',
    duration: '01:15',
    expectedVerdict: 'scam',
    audioFile: '/calls/scam-bank-kyc.wav',
    description:
      'Claims your HDFC account will be blocked in 2 hours unless you share OTP and UPI PIN for "KYC verification".',
  },
  {
    id: 'genuine-delivery',
    title: 'Genuine Delivery Partner — Amazon',
    callerName: 'Amazon Logistics (Verified)',
    callerNumber: 'Amazon Logistics Verified',
    duration: '00:38',
    expectedVerdict: 'safe',
    audioFile: '/calls/genuine-delivery.wav',
    description:
      'Delivery partner asking for apartment gate code and confirmation of delivery address. No OTP/money/threat requests.',
  },
];
