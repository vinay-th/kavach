# AGENT.md — Project "Kavach" (કવચ / कवच)
> Real-Time Scam-Call Shield for Indian Elders  
> Automated live call listening, mid-call fraud detection, and multi-lingual elder-friendly advisories (Gujarati, Hindi, English).

---

## 1. Product Summary & 30-Second Demo Script

### Product Summary
**Kavach** is a specialized real-time scam-call defense application built for Indian senior citizens. Elders are disproportionately victimized by coercive psychological scams—specifically **"Digital Arrest"** (fake police/CBI/ED video interrogations), **Fake Courier/Customs** (narcotics parcel threats from DHL/FedEx), and **Fake Bank/KYC** block warnings. 

Kavach listens to or simulates ongoing phone calls in ~6-second audio chunks. As the call progresses, Kavach sends each chunk with rolling context to Google Gemini via the official `@google/genai` SDK. Mid-call, Kavach flags deceptive tactics (urgency, threats, fake police/CBI authority, OTP/money demands, secrecy instructions), calculates a live risk score (0–100), and renders an unmistakable, calm-but-urgent shield alert with explanations in simple colloquial **Gujarati** or **Hindi**.

### The 30-Second Demo Script
1. **0:00 - 0:05 (Introduction & Call Selection)**
   - Presenter: *"Indian elders lose thousands of crores annually to 'Digital Arrest' and fake courier scams. Watch Kavach protect an elderly parent in real-time."*
   - Action: Select **"Digital Arrest Scam (CBI / Mumbai Cyber Police)"** from demo call list. Language set to **ગુજરાતી (Gujarati)**. Press **"Start Call Simulation"**.
2. **0:06 - 0:13 (Chunk 1: Initial Hook & Mid-Call Analysis)**
   - Caller Audio: *"Hello, I am ACP Sharma from Crime Branch. A parcel with illegal passports and narcotics registered in your Aadhaar card has been seized..."*
   - Live Display: Status updates to **"સાવચેત રહો (Suspicious - 55%)"**. Red flag emerges: `Fake Authority (CBI / Police)`. The elder sees the yellow caution shield activate mid-call.
3. **0:14 - 0:22 (Chunk 2: Threat & Digital Arrest Escalation)**
   - Caller Audio: *"You are under Digital Arrest right now! Do not disconnect this line or inform anyone. Transfer ₹50,000 to the verification escrow account immediately to avoid arrest!"*
   - Live Display: Instant crimson transition to **"સાયબર ફ્રોડ એલર્ટ! (SCAM DETECTED - 95%)"**.
   - Red Flags Highlighted: `Threat / Coercion`, `Money Request`, `Secrecy Demand`.
   - Gujarati Explanation: *"પોલીસ ક્યારેય ફોન કે વીડિયો કૉલ પર ધરપકડ નથી કરતી. તરત જ ફોન કાપી નાખો!"*
4. **0:23 - 0:30 (Action & Genuine Call Verification)**
   - Action: Click prominent red button **"હમણાં જ ફોન કાપો (Hang Up Now)"** and trigger **"પરિવારને ચેતવણી મોકલો (Alert Family)"**.
   - Contrast Test: Switch demo to **"Genuine Delivery Partner (Swiggy/Amazon)"** asking for apartment gate directions.
   - Live Display: Remains green **"સુરક્ષિત કૉલ (Safe Call - 5%)"**, demonstrating that Kavach never cries wolf on ordinary everyday calls.

---

## 2. Tech Stack & Directory Structure

### Tech Stack
- **Framework**: Next.js (App Router, latest version) + React 19
- **Language**: TypeScript (`"strict": true`, zero `any`, zero plain `.js` files)
- **Styling**: Tailwind CSS + shadcn/ui components (Radix primitives)
- **Animations**: Framer Motion (animated shield status, pulsating pulse rings, alert drawer)
- **Icons**: `lucide-react`
- **AI Engine**: Google Gemini via official `@google/genai` SDK using native audio multimodal ingestion (Model specified via `GEMINI_MODEL` env var)
- **Validation**: `zod` for strict structured output validation (`responseMimeType: "application/json"`, `responseSchema`)
- **Audio Processing**: Client-side Web Audio API (`AudioContext`) / offline chunk slice for WAV playback and streaming to API handler
- **Fonts**: `Noto Sans Gujarati`, `Noto Sans Devanagari`, `Inter`

### Folder Structure
```
kavach/
├── AGENT.md                       # This comprehensive project playbook
├── .env.local                     # Server-only keys (GEMINI_API_KEY, GEMINI_MODEL)
├── public/
│   └── calls/                     # Demo audio files
│       ├── scam-digital-arrest.wav
│       ├── scam-courier-customs.wav
│       ├── scam-bank-kyc.wav
│       └── genuine-delivery.wav
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/
│   │   │   │   └── route.ts       # POST handler: sends audio chunk + rolling context to Gemini
│   │   │   └── demo-calls/
│   │   │       └── route.ts       # GET handler: lists and validates demo scenarios
│   │   ├── globals.css            # Tailwind directives, theme variables, elder typography rules
│   │   ├── layout.tsx             # Root layout with Noto Gujarati/Devanagari font imports
│   │   └── page.tsx               # Main Kavach Call Shield dashboard
│   ├── components/
│   │   ├── shield/
│   │   │   ├── ShieldStatusCard.tsx    # Big visual shield (Green Safe, Yellow Suspicious, Red Scam)
│   │   │   ├── RedFlagsList.tsx        # Itemized badge list of detected scam indicators
│   │   │   ├── ElderExplanation.tsx    # High-contrast 2-sentence colloquial advisory in Guj/Hi/En
│   │   │   └── EmergencyActions.tsx    # "Hang Up Now" and "Alert Family" action buttons
│   │   ├── audio/
│   │   │   ├── CallSimulator.tsx       # Player bar, waveform visualizer, chunk progress indicator
│   │   │   ├── AudioChunkPlayer.tsx    # Handles ~6s slice dispatch and audio synchronization
│   │   │   └── DemoSelector.tsx        # Quick picker for 4 demo scenarios
│   │   ├── locale/
│   │   │   └── LanguageToggle.tsx      # One-tap switcher: Gujarati (ગુજરાતી) / Hindi (हिन्दी) / English
│   │   └── ui/                         # shadcn/ui primitives (badge, button, card, progress, dialog)
│   ├── lib/
│   │   ├── gemini.ts              # Server-side @google/genai client setup and schema definition
│   │   ├── audio-slicer.ts        # Client-side WAV chunking utility (~6s buffers to base64)
│   │   ├── scam-rules.ts          # Constants, threshold logic, Indian legal/banking facts
│   │   └── utils.ts               # cn helper and utility functions
│   └── types/
│       ├── analysis.ts            # AnalysisResult, RedFlag, ChunkRequest, Verdict types
│       └── call.ts                # CallScenario, AudioChunk, SessionState types
├── tsconfig.json
└── package.json
```

---

## 3. Core TypeScript Types

All interfaces are strictly defined with zero `any`.

```typescript
// src/types/analysis.ts

export type Verdict = 'safe' | 'suspicious' | 'scam';

export type RedFlagType =
  | 'urgency'
  | 'threat'
  | 'otp_request'
  | 'money_request'
  | 'fake_authority'
  | 'secrecy'
  | 'remote_access';

export interface RedFlag {
  type: RedFlagType;
  evidence: string; // Verbatim or summarized snippet heard in audio
}

export interface LocalizedText {
  gu: string; // Gujarati
  hi: string; // Hindi
  en: string; // English
}

export interface AnalysisResult {
  transcript: string;
  languageDetected: string; // e.g. "hi-IN", "gu-IN", "en-IN", "hinglish"
  riskScore: number;        // 0 to 100
  verdict: Verdict;
  redFlags: RedFlag[];
  explanation: LocalizedText;       // Max 2 short sentences, elder-friendly colloquial phrasing
  recommendedAction: LocalizedText; // Direct imperative action (e.g. "Hang up call immediately")
}

export interface ChunkAnalysisRequest {
  audioBase64: string;
  mimeType: string;         // e.g. "audio/wav" or "audio/mp3"
  chunkIndex: number;       // 0-indexed chunk sequence
  totalChunks: number;
  callSessionId: string;
  previousContext?: {
    accumulatedTranscript: string;
    previousRiskScore: number;
    detectedRedFlags: RedFlagType[];
    previousSummary: string;
  };
}

export interface CallSessionState {
  sessionId: string;
  scenarioId: string;
  status: 'idle' | 'playing' | 'analyzing' | 'completed' | 'error';
  currentChunkIndex: number;
  totalChunks: number;
  highestRiskScore: number;
  currentVerdict: Verdict;
  accumulatedRedFlags: RedFlag[];
  latestResult: AnalysisResult | null;
  transcripts: string[];
}
```

---

## 4. The Gemini System Prompt & Scam Taxonomy

The Gemini model is initialized server-side using `@google/genai` with `responseMimeType: "application/json"` and `responseSchema` corresponding to `AnalysisResult`.

### Full System Prompt Text
```text
You are Kavach (કવચ / कवच), an expert real-time scam-call protection engine protecting Indian senior citizens.
Your job is to analyze sequential audio chunks of live incoming phone calls, detect fraudulent patterns targeting Indian citizens, and produce immediate, structured verdicts.

### CORE INDIAN SCAM TAXONOMY & COLD FACTS:
1. DIGITAL ARREST / FAKE POLICE / CBI / ED / COURT:
   - Impersonation of Mumbai/Delhi Police, CBI, NCB, Cyber Crime Branch, ED, Supreme Court, or judges.
   - Claims: "A courier in your name has drugs/fake passports/illegal SIMs", "Your Aadhaar is tied to money laundering", "You are placed under Digital Arrest".
   - Demands: Must stay on continuous video/audio call, do not tell family, transfer funds to "RBI verification escrow account" or "clearing account".
   - ABSOLUTE FACT: Indian law enforcement and judiciary NEVER conduct arrests, court proceedings, or asset verifications over WhatsApp, Skype, or phone calls. "Digital Arrest" DOES NOT EXIST in Indian law.

2. FAKE COURIER / CUSTOMS / NARCOTICS (FEDEX / DHL / INDIA POST):
   - Claims: A parcel sent to Taiwan/Dubai/abroad containing MDMA/passports was intercepted; victim faces immediate arrest unless cleared by "police officer" they transfer the call to.
   - ABSOLUTE FACT: Legitimate courier firms NEVER demand money transfers or threaten police custody to clear intercepted shipments.

3. FAKE BANK / KYC / AADHAAR / PAN UPDATE:
   - Claims: SBI/HDFC/ICICI account or SIM card will be blocked within 2 hours due to pending KYC; demands immediate OTP, UPI PIN, ATM PIN, or card CVV.
   - ABSOLUTE FACT: RBI mandates that NO bank, telecom provider, or government body EVER asks for OTP, UPI PIN, or CVV over a phone call.

4. REMOTE ACCESS SOFTWARE INSTALLATION:
   - Demands to install AnyDesk, TeamViewer, QuickSupport, or download suspicious APKs from WhatsApp.
   - ABSOLUTE FACT: No genuine organization instructs customers to install screen-sharing tools to fix account issues.

5. UTILITY / ELECTRICITY BILL DISCONNECTION:
   - Claims power/gas supply will be disconnected at 9:00 PM tonight unless paid immediately via a personal UPI handle or malicious link.

### CRITICAL INSTRUCTION: DO NOT CRY WOLF (NO FALSE ALARMS)
- You must NOT mark ordinary calls as suspicious or scam.
- Genuine delivery drivers (Swiggy, Zomato, Amazon, Blinkit) asking for apartment gate codes, directions, or landmarks are SAFE (Risk: 0-15%).
- Genuine family members discussing money, medical bills, or personal matters without coercion or secrecy are SAFE (Risk: 0-15%).
- Genuine automated bank reminders informing about a past transaction or EMI due date WITHOUT asking for OTP/PIN/passwords are SAFE (Risk: 0-25%).
- Only trigger 'suspicious' or 'scam' when actionable indicators (coercion, fake authority, OTP/money demand, secrecy, panic) are genuinely present.

### ELDER-FRIENDLY EXPLANATION RULES:
- The explanation must be in extremely simple, reassuring, colloquial Gujarati (gu), Hindi (hi), and English (en).
- STRICT LIMIT: Maximum 2 short sentences.
- Use words an 80-year-old grandfather or grandmother understands. No English technical jargon like "phishing" or "social engineering" in Gujarati/Hindi text.
- Example Gujarati: "આ કૉલ છેતરપિંડી છે. પોલીસ ક્યારેય ફોન પર ધરપકડ નથી કરતી. તરત જ ફોન કાપી નાખો."
- Example Hindi: "यह कॉल पूरी तरह फ़्रॉड है। पुलिस कभी फ़ोन पर अरेस्ट नहीं करती। तुरंत फ़ोन काट दें।"
- Example English: "This call is a scam. Police officers never arrest people over phone calls. Hang up immediately."

### ROLLING CONTEXT RULE:
- You will be given previous chunk summaries and the previous risk score.
- A call that exhibited scam indicators earlier in the call remains a scam. Do not reset risk to safe just because the scammer is speaking quietly or waiting in the current chunk.
```

---

## 5. Streaming & Audio Chunking Logic

1. **Chunk Duration**: ~6 seconds per slice (approx. 96,000 samples at 16kHz mono).
2. **Audio Slicing Method**: Client-side `AudioBuffer` slicing via Web Audio API, exported as Base64 `audio/wav`.
3. **Sequential Pipeline**:
   - Chunk 0 (0:00 - 0:06) -> Sent to `/api/analyze`.
   - Chunk 1 (0:06 - 0:12) -> Sent with `previousContext` containing Chunk 0 transcript and red flags.
   - Chunk 2 (0:12 - 0:18) -> Sent with cumulative rolling context.
4. **Monotonic Risk Score Rule**:
   - Within an ongoing call session:
     $$\text{RiskScore}_{\text{current}} \ge \max(\text{RiskScore}_{\text{previous}}, \text{GeminiEvaluatedRisk})$$
   - Risk score **can only rise or hold** within a call session to prevent scammers from resetting alert states by pausing or switching to calm tones.
5. **Verdict Thresholds**:
   - `0 - 34`: **Safe** (`safe`) -> Green badge, soothing pulse.
   - `35 - 69`: **Suspicious** (`suspicious`) -> Amber alert, cautionary guidance.
   - `70 - 100`: **Scam** (`scam`) -> Crimson alert shield, warning sound, large "HANG UP" button.

---

## 6. UI/UX Rules for Indian Elders

1. **Elder Accessibility & Typography**:
   - Minimum body font size: **18px** (`text-lg`).
   - Card headers & status: **24px - 32px** (`text-2xl` - `text-3xl`), bold, unambiguous.
   - Action buttons: Minimum height **64px** (`h-16`), large touch targets, full width on mobile/tablet.
2. **High-Contrast Calm-but-Urgent Aesthetic**:
   - Dark, high-contrast, distraction-free interface (deep slate / charcoal background `#090D16` to `#0F172A`).
   - High-contrast alert badges:
     - Safe: Emerald `#10B981` / `#059669`
     - Suspicious: Amber `#F59E0B` / `#D97706`
     - Scam: Crimson `#EF4444` / `#DC2626`
   - Never rely on color alone: Every alert status includes a distinct icon (ShieldCheck, AlertTriangle, ShieldAlert), prominent text labels, and textual badge tags.
3. **Multi-Lingual First-Class Citizen**:
   - Persistent, sticky 3-way language toggle at top right:
     - **ગુજરાતી** (Gujarati)
     - **हिन्दी** (Hindi)
     - **English**
   - Font pairings:
     - Gujarati text rendered using `Noto Sans Gujarati` (via Google Fonts).
     - Hindi text rendered using `Noto Sans Devanagari` (via Google Fonts).
     - English rendered with clean modern sans (`Inter`).
4. **No Flashing or Anxiety-Inducing UI**:
   - Do NOT use strobe or high-frequency flashing animations which could trigger medical distress or panic in elderly users.
   - Use soft breathing pulses (`animate-pulse` or Framer Motion smooth scale `1.0` to `1.04`).

---

## 7. Code Quality & Architectural Standards

- **Strict TypeScript**: `strict: true`, `noImplicitAny: true`. Absolutely no `any`.
- **Server/Client Boundary Security**:
  - `GEMINI_API_KEY` and `GEMINI_MODEL` are strictly server-side variables in `.env.local`.
  - Never prefix AI keys with `NEXT_PUBLIC_`.
  - All Gemini API calls happen inside `src/app/api/analyze/route.ts`.
- **Component Modularity**:
  - Keep components atomic and under ~150 lines.
  - Dedicated components for `ShieldStatusCard`, `RedFlagsList`, `ElderExplanation`, `CallSimulator`, and `LanguageToggle`.
- **Resilient Fallbacks**:
  - Catch network errors and Gemini quota exhaustion gracefully.
  - Show friendly fallback status in the UI if an individual chunk request fails, without crashing the call playback.
- **Git Commit Discipline**:
  - Descriptive conventional commit messages: `feat: ...`, `fix: ...`, `refactor: ...`, `docs: ...`.

---

## 8. Definition of Done for Hackathon Demo

- [ ] `npm run dev` boots cleanly with zero TypeScript errors and zero ESLint warnings.
- [ ] 4 audio files present in `public/calls/` (3 scams: Digital Arrest, Courier Customs, Bank KYC; 1 genuine: Delivery Partner).
- [ ] Client splits audio playback into ~6-second chunks and sequentially dispatches them to `/api/analyze`.
- [ ] Gemini API successfully returns validated JSON conforming to the `AnalysisResult` Zod schema.
- [ ] UI dynamically updates mid-call as audio plays (safe -> suspicious -> scam).
- [ ] Detected red flags render with clear evidence tags and icons.
- [ ] Reassuring, colloquial explanations render correctly in Gujarati, Hindi, and English.
- [ ] 1-click language toggle switches all dashboard text and explanations instantly.
- [ ] Genuine delivery call stays green ("Safe Call"), proving no false positive alarm.

---

## 9. Implementation Task List (Priority Order)

### Phase 1: Environment & Foundation Setup
- [ ] Install missing dependencies: `@google/genai`, `zod`, `framer-motion`, `lucide-react`, and required `shadcn/ui` utilities.
- [ ] Configure `next.config.ts`, Tailwind v4 font imports, and Google Fonts (`Noto Sans Gujarati`, `Noto Sans Devanagari`).
- [ ] Setup `.env.local` template with `GEMINI_API_KEY` and `GEMINI_MODEL`.

### Phase 2: Core Types & Schemas
- [ ] Create `src/types/analysis.ts` and `src/types/call.ts`.
- [ ] Create `src/lib/scam-rules.ts` defining constants, red flag taxonomies, and threshold calculations.

### Phase 3: Gemini SDK Route Handler
- [ ] Create `src/lib/gemini.ts` using `@google/genai` with Gemini structured schema.
- [ ] Implement `src/app/api/analyze/route.ts` with error handling, base64 audio decoding, and rolling context support.

### Phase 4: Audio Files & Audio Slicer Utility
- [ ] Place/generate 4 realistic `.wav` scenario files in `public/calls/`.
- [ ] Implement `src/lib/audio-slicer.ts` to slice audio buffers into ~6s chunks in the browser.
- [ ] Implement `src/app/api/demo-calls/route.ts` to provide scenario metadata (title, caller info, duration).

### Phase 5: UI Components
- [ ] Build `src/components/locale/LanguageToggle.tsx` (Gujarati, Hindi, English).
- [ ] Build `src/components/shield/ShieldStatusCard.tsx` (interactive animated visual shield).
- [ ] Build `src/components/shield/RedFlagsList.tsx` (visual badges for detected red flags).
- [ ] Build `src/components/shield/ElderExplanation.tsx` (large high-contrast colloquial advisory).
- [ ] Build `src/components/shield/EmergencyActions.tsx` (Hang up, call family).

### Phase 6: Call Simulator & Orchestration
- [ ] Build `src/components/audio/CallSimulator.tsx` (playback controls, waveform, timer, chunk indicator).
- [ ] Build `src/components/audio/DemoSelector.tsx` (picker for the 4 demo calls).
- [ ] Connect audio playback timeline with `/api/analyze` dispatches in `src/app/page.tsx`.

### Phase 7: Verification & Testing
- [ ] Test Digital Arrest call: Confirm red alert triggers mid-call (chunk 2).
- [ ] Test Genuine Delivery call: Confirm green safe state holds throughout.
- [ ] Verify Gujarati and Hindi font rendering and readability.
- [ ] End-to-end dry run of the 30-second hackathon pitch.
