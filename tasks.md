# Kavach AI Scam Shield — Project Execution Plan & Tasks

> Real-time scam-call interception for Indian elders with native Gemini audio analysis and multilingual Gujarati/Hindi/English guidance.

---

## 1. Setup & Foundations
- [x] Create project specification & architecture documentation (`AGENT.md`)
- [x] Configure TypeScript with strict mode (no `any`)
- [x] Create type contracts for calls, chunks, verdicts, red flags (`src/types/call.ts`, `src/types/analysis.ts`)
- [x] Build scam detection rules, scoring engine, and localized labels (`src/lib/scam-rules.ts`)
- [x] Create mock data simulating escalating calls (safe → suspicious → scam) and genuine calls (`src/lib/mock-data.ts`)
- [x] Create `.env` and `.env.local` with placeholders for `GEMINI_API_KEY` and `GEMINI_MODEL`

## 2. Core State Management & Language Context
- [x] Build `LanguageContext.tsx` supporting Gujarati (`gu`), Hindi (`hi`), English (`en`)
- [x] Build `LanguageToggle.tsx` with animated pill selector and smooth tab switching
- [x] Build `useCallAnalysis.ts` hook with `useReducer`, wall-clock timer, monotonic risk scoring, and mock simulation mode

## 3. Live Call Shield UI Components
- [x] `RiskGauge.tsx`: SVG arc gauge with dynamic color transitions (emerald <35, amber 35–69, crimson 70+)
- [x] `ShieldStatusCard.tsx`: Animated pulsing background and status banner per verdict
- [x] `FlagChip.tsx`: Interactive tooltip-enabled red flag pills with icons and evidence snippets
- [x] `RedFlagsList.tsx`: Staggered animation list showing active red flags
- [x] `ElderExplanation.tsx`: High-contrast, large-type (22px) senior-friendly explanations in Gujarati/Hindi/English
- [x] `EmergencyActions.tsx`: Emergency triggers ("Hang Up" & "Alert Family") with 64px touch target for elders
- [x] `WarningBanner.tsx`: Bottom floating alert with 1930 Cyber Helpline action
- [x] `CallSummary.tsx`: Post-call forensic overview and metrics breakdown
- [x] `CallLibrary.tsx`: Scenario selector (Digital Arrest, Fake KYC, Fake Courier, Genuine Delivery)
- [x] `CallCard.tsx`: Live call panel with animated audio waveform, timer, caller info, and live transcript streaming
- [x] `LiveShieldDemo.tsx`: Comprehensive container coordinating the call library, caller card, and shield cards

## 4. Landing Page (`src/app/page.tsx`) from Reference (`ref/code.html`)
- [x] Integrate Newsreader serif & Inter fonts into Next.js layout and CSS
- [x] Navigation header: Docked sticky header with geometric logo, navigation links, and vermilion CTA
- [x] Hero section: Serif headline ("Hang up on the scam. Before it costs a lifetime."), trust badge, regional reassurance banner, interactive phone visual with live audio waveform
- [x] Interactive Live Demo section: Full integration of `CallLibrary`, `CallCard`, `RiskGauge`, `ElderExplanation`, `RedFlagsList`, `EmergencyActions`, and `CallSummary`
- [x] Problem statement: National crisis statistics (₹1,750+ Cr lost, 74% seniors, 1 victim isolation) with hairline dividers
- [x] Architectural workflow (How it works): 01 It listens, 02 It spots red flags, 03 It warns in their language, plus real-time latency visual monitor
- [x] Bento grid of scam types: 6 asymmetric tiles covering Digital Arrest, Fake KYC, Fake Courier, OTP & Fast RTGS, Remote-Access Apps, Secrecy Mandates
- [x] "Doesn't Cry Wolf" section: Side-by-side comparison of extortion call vs genuine family call
- [x] "For Families" section: Dark ink full-bleed view with instant WhatsApp/SMS alert mockup and 1-tap override
- [x] Trust & Privacy: Surveillance-free ephemeral processing, family data control, direct 1930 / cybercrime.gov.in integration
- [x] Footer: Helplines (1930), cybercrime.gov.in links, language selector, legal links, and copyright

## 5. Gemini Audio Backend Integration (Ready for API Key)
- [ ] Server-side route handler `/api/analyze-chunk` using official `@google/genai` SDK
- [ ] Audio chunking pipeline and PCM/WAV base64 encoding
- [ ] Strict JSON schema prompt for structured scam evaluation
- [ ] Live toggle switch between Mock Simulation and Gemini Real Audio Analysis
