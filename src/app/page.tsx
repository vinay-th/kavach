'use client';

// src/app/page.tsx
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Shield,
  Play,
  ArrowRight,
  PhoneCall,
  CheckCircle,
  AlertTriangle,
  Lock,
  MessageSquare,
  PhoneOff,
  UserCheck,
  FileText,
  Clock,
  ExternalLink,
  ChevronRight,
  Radio,
  Sparkles,
} from 'lucide-react';
import { LiveShieldDemo } from '@/components/shield/LiveShieldDemo';
import { LanguageToggle } from '@/components/locale/LanguageToggle';
import { useLanguage } from '@/context/LanguageContext';

export default function HomePage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-[#FAF8F4] text-[#0E1116] flex flex-col font-sans selection:bg-[#E5392B] selection:text-white">
      {/* ========================================================================= */}
      {/* 1. NAVIGATION HEADER (Docked sticky header, translucent blur, 72px)       */}
      {/* ========================================================================= */}
      <header className="bg-[#FAF8F4]/90 backdrop-blur-md sticky top-0 z-40 h-[72px] border-b border-[#E7E2D9] shadow-[0_1px_3px_rgba(14,17,22,0.02),0_4px_12px_rgba(14,17,22,0.03)]">
        <div className="flex justify-between items-center w-full px-4 sm:px-6 md:px-12 max-w-[1240px] mx-auto h-full">
          {/* Left: Geometric Shield + Wordmark */}
          <Link
            href="#"
            className="flex items-center gap-3 active:scale-[0.98] transition-transform duration-150"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0E1116] text-[#FAF8F4] flex items-center justify-center shadow-sm">
              <svg className="w-4 h-4 fill-current text-[#FAF8F4]" viewBox="0 0 24 24">
                <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm0 2.18l6 2.25v4.66c0 4.14-2.73 8.02-6 9.07-3.27-1.05-6-4.93-6-9.07V6.43l6-2.25z" />
              </svg>
            </div>
            <span className="font-serif text-2xl font-medium tracking-tight text-[#0E1116]">
              Kavach
            </span>
          </Link>

          {/* Center: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-[#595c62]">
            <a
              href="#how-it-works"
              className="text-[#0E1116] font-semibold border-b-2 border-[#b7140f] py-1 transition-colors"
            >
              How it works
            </a>
            <a
              href="#scam-types"
              className="hover:text-[#0E1116] transition-colors py-1"
            >
              Scam types
            </a>
            <a
              href="#for-families"
              className="hover:text-[#0E1116] transition-colors py-1"
            >
              For families
            </a>
            <a
              href="#live-demo"
              className="hover:text-[#0E1116] transition-colors py-1"
            >
              Live Demo
            </a>
          </nav>

          {/* Right: Language Switch & Vermilion CTA */}
          <div className="flex items-center gap-3 sm:gap-5">
            <LanguageToggle />
            <a
              href="#live-demo"
              className="inline-flex items-center justify-center px-4 sm:px-5 py-2.5 rounded-xl bg-[#E5392B] hover:bg-[#b7140f] text-white font-medium text-xs sm:text-sm transition-colors active:scale-[0.98] shadow-sm shadow-red-900/20"
            >
              Try the live demo
            </a>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION (Split composition, Newsreader typography, Vermilion CTA) */}
      {/* ========================================================================= */}
      <section className="min-h-[90vh] flex items-center pt-8 pb-16 md:py-24 border-b border-hairline overflow-hidden relative">
        <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Trust Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF8F4] border border-[#E7E2D9] text-xs sm:text-[13px] font-medium text-[#595c62] mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#006c4c] animate-pulse" />
              <span>Real-time protection for your parents</span>
            </div>

            {/* Giant Serif Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#0E1116] mb-6 leading-[1.1] tracking-tight font-normal">
              Hang up on the scam. <br />
              <em className="italic text-[#5c403c]">Before it costs a lifetime.</em>
            </h1>

            {/* Subhead */}
            <p className="text-base sm:text-xl text-[#0E1116]/80 max-w-xl mb-6 font-normal leading-relaxed">
              Kavach listens to suspicious calls as they happen, tells your parent exactly why it&apos;s a scam, in Gujarati or Hindi, while the scammer is still talking.
            </p>

            {/* Regional Reassurance Copy */}
            <div className="p-3.5 rounded-xl bg-[#f5f3ef] border border-hairline/80 text-[#595c62] mb-8 font-normal text-xs sm:text-sm tracking-wide">
              પોલીસ કે સીબીઆઇ ક્યારેય ફોન પર ધરપકડ કરતી નથી • पुलिस कभी फोन पर गिरफ़्तारी नहीं करती
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-8">
              <a
                href="#live-demo"
                className="h-14 px-8 rounded-full bg-[#E5392B] hover:bg-[#b7140f] text-white font-medium text-[15px] flex items-center justify-center gap-3 transition-colors active:scale-[0.98] shadow-md shadow-red-500/20"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Try the live demo</span>
              </a>
              <a
                href="#how-it-works"
                className="h-14 px-6 rounded-full bg-transparent text-[#0E1116] hover:text-[#b7140f] transition-colors flex items-center justify-center gap-2 font-medium text-[15px]"
              >
                <span>Watch how it works</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Footnote anchor */}
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#595c62]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#72747b]" />
              <span>Built for India. Gujarati · Hindi · English.</span>
            </div>
          </div>

          {/* Right Column: Layered Phone Mockup Visual */}
          <div className="lg:col-span-5 relative flex justify-center items-center py-6">
            {/* Floating Backdrop Card: Live Transcript */}
            <div className="absolute -top-4 -right-2 md:-right-6 w-80 bg-white border border-hairline rounded-2xl p-4 shadow-[0_12px_32px_-4px_rgba(14,17,22,0.08)] z-0 hidden sm:block transform rotate-2">
              <div className="flex items-center justify-between pb-3 border-b border-hairline">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#595c62]">
                  Live Audio Parser
                </span>
                <span className="text-xs text-[#b7140f] font-semibold flex items-center gap-1 font-mono">
                  <span className="w-2 h-2 rounded-full bg-[#b7140f] animate-ping" />
                  92/100 Threat Index
                </span>
              </div>
              <div className="pt-3 text-[13px] leading-relaxed text-[#2C2E33] space-y-1.5">
                <p>
                  “...your{' '}
                  <span className="border-b-2 border-[#b7140f] font-medium text-[#b7140f]">
                    Aadhaar linked to 14 illegal accounts
                  </span>{' '}
                  in Mumbai branch...”
                </p>
                <p>
                  “...DCP Bansal issued a{' '}
                  <span className="border-b-2 border-[#b7140f] font-medium text-[#b7140f]">
                    non-bailable warrant
                  </span>{' '}
                  under Section 420...”
                </p>
              </div>
            </div>

            {/* Phone Device Frame (#0E1116) */}
            <div className="w-full max-w-[340px] bg-[#0E1116] rounded-[40px] p-4 border-[6px] border-[#2C2D30] shadow-[0_24px_50px_rgba(14,17,22,0.25)] relative z-10 flex flex-col justify-between overflow-hidden min-h-[580px]">
              {/* Phone Bar */}
              <div className="w-full flex items-center justify-between px-3 pt-2 text-[#FAF8F4]/60 text-xs font-mono">
                <span>11:42 AM</span>
                <div className="w-16 h-4 bg-black rounded-full mx-auto" />
                <div className="flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Active Call Info */}
              <div className="text-center mt-6">
                <div className="w-16 h-16 rounded-full bg-white/10 text-white/80 mx-auto flex items-center justify-center mb-3">
                  <PhoneCall className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-[#FAF8F4] font-medium text-lg tracking-tight">
                  Unknown caller
                </h2>
                <p className="text-[#FAF8F4]/60 text-xs font-mono mt-0.5">+91 98210 44102</p>
                <p className="text-[#FAF8F4]/40 text-xs mt-1">Ongoing call • 01:24</p>

                {/* Live Pulsing Waveform */}
                <div className="flex items-center justify-center gap-1.5 h-8 mt-5">
                  <span className="w-1 bg-[#E5392B] wave-bar rounded-full" />
                  <span className="w-1 bg-[#E5392B] wave-bar rounded-full" />
                  <span className="w-1 bg-[#E5392B] wave-bar rounded-full" />
                  <span className="w-1 bg-[#E5392B] wave-bar rounded-full" />
                  <span className="w-1 bg-[#E5392B] wave-bar rounded-full" />
                  <span className="w-1 bg-[#E5392B] wave-bar rounded-full" />
                  <span className="w-1 bg-[#E5392B] wave-bar rounded-full" />
                  <span className="w-1 bg-[#E5392B] wave-bar rounded-full" />
                </div>
              </div>

              {/* Bottom Warning Sheet (Sliding up from bottom, Vermilion theme) */}
              <div className="bg-[#E5392B] text-white rounded-3xl p-5 shadow-2xl mt-4 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wider uppercase bg-black/20 px-2 py-0.5 rounded-full">
                    <AlertTriangle className="w-3 h-3 text-white" />
                    Immediate Threat
                  </span>
                  <span className="text-xs font-mono bg-white text-[#b7140f] font-bold px-2 py-0.5 rounded">
                    94/100
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold leading-tight mt-1 text-white">
                  Stop. This is a scam.
                </h3>
                <p className="text-sm font-medium text-white/95 mt-1 leading-snug">
                  पुलिस कभी वीडियो कॉल पर गिरफ्तार नहीं करती
                </p>

                {/* Threat Category Chips */}
                <div className="grid grid-cols-2 gap-1.5 mt-3 pt-3 border-t border-white/15">
                  <span className="text-[11px] bg-black/20 px-2 py-1 rounded text-center font-medium">
                    🚨 Fake police
                  </span>
                  <span className="text-[11px] bg-black/20 px-2 py-1 rounded text-center font-medium">
                    ⏱️ Urgency coercion
                  </span>
                  <span className="text-[11px] bg-black/20 px-2 py-1 rounded text-center font-medium">
                    ⚠️ Threat
                  </span>
                  <span className="text-[11px] bg-black/20 px-2 py-1 rounded text-center font-medium">
                    💸 Money request
                  </span>
                </div>

                {/* Intercept Action Button */}
                <a
                  href="#live-demo"
                  className="w-full mt-4 py-2.5 rounded-xl bg-white text-[#b7140f] font-semibold text-xs tracking-wide uppercase transition hover:bg-[#FAF8F4] active:scale-[0.98] flex items-center justify-center gap-1.5"
                >
                  End Call &amp; Alert Child
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. PROBLEM SECTION (Dramatic typographic crisis assessment)              */}
      {/* ========================================================================= */}
      <section className="py-24 md:py-32 border-b border-hairline">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 md:px-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#b7140f] mb-4">
            National Crisis Assessment
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl max-w-4xl mx-auto leading-tight text-[#0E1116] mb-16 font-normal">
            Every day, someone’s parents are told they’re under{' '}
            <em className="italic text-[#b7140f] font-normal">digital arrest</em>.
          </h2>

          {/* 3 Oversized Stat Numerals with Hairline Dividers */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-hairline border-y border-hairline py-12">
            <div className="flex flex-col items-center px-6 py-6 md:py-0">
              <span className="font-serif text-5xl md:text-6xl font-light text-[#0E1116] mb-3 tracking-tight">
                ₹1,750+ Cr
              </span>
              <p className="text-sm text-[#595c62] max-w-[240px] text-center leading-relaxed">
                Lost to cyber fraud across India (I4C / NCRB 2024 report)
              </p>
            </div>
            <div className="flex flex-col items-center px-6 py-6 md:py-0">
              <span className="font-serif text-5xl md:text-6xl font-light text-[#0E1116] mb-3 tracking-tight">
                74%
              </span>
              <p className="text-sm text-[#595c62] max-w-[240px] text-center leading-relaxed">
                Of major digital arrest victims are seniors over 50 years old
              </p>
            </div>
            <div className="flex flex-col items-center px-6 py-6 md:py-0">
              <span className="font-serif text-5xl md:text-6xl font-light text-[#0E1116] mb-3 tracking-tight">
                1 Victim
              </span>
              <p className="text-sm text-[#595c62] max-w-[260px] text-center leading-relaxed">
                The scam succeeds because parents are isolated and alone on the call
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. INTERACTIVE LIVE CALL SHIELD DEMO (Fully integrated playground)        */}
      {/* ========================================================================= */}
      <LiveShieldDemo />

      {/* ========================================================================= */}
      {/* 5. HOW IT WORKS (Architectural workflow / 3 numbered stages)              */}
      {/* ========================================================================= */}
      <section className="py-24 md:py-32 border-b border-hairline bg-[#FAF8F4]" id="how-it-works">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 md:px-12">
          <div className="max-w-2xl mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#595c62] block mb-3">
              Architectural Workflow
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#0E1116] leading-tight font-normal">
              How Kavach protects in real time.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: 3 Clear Numbered Rows */}
            <div className="lg:col-span-7 flex flex-col space-y-8">
              {/* Stage 01 */}
              <div className="flex gap-6 items-start p-8 rounded-2xl bg-white border border-hairline shadow-sm hover:border-stone-300 transition-all">
                <span className="font-serif text-4xl text-[#b7140f] font-medium leading-none">
                  01
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-[#0E1116] mb-2">It listens</h3>
                  <p className="text-sm sm:text-base text-[#595c62] leading-relaxed">
                    Audio is analyzed directly on the incoming call stream in short chunks, generating live waveforms and streaming speech transcript in real time without human ears.
                  </p>
                </div>
              </div>

              {/* Stage 02 */}
              <div className="flex gap-6 items-start p-8 rounded-2xl bg-white border border-hairline shadow-sm hover:border-stone-300 transition-all">
                <span className="font-serif text-4xl text-[#b7140f] font-medium leading-none">
                  02
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-[#0E1116] mb-2">
                    It spots the red flags
                  </h3>
                  <p className="text-sm sm:text-base text-[#595c62] leading-relaxed">
                    Our semantic threat engine pinpoints coercion formulas: synthetic police authority, urgent demands for RTGS transfers, and intimidation to keep doors closed.
                  </p>
                </div>
              </div>

              {/* Stage 03 */}
              <div className="flex gap-6 items-start p-8 rounded-2xl bg-white border border-hairline shadow-sm hover:border-stone-300 transition-all">
                <span className="font-serif text-4xl text-[#b7140f] font-medium leading-none">
                  03
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-[#0E1116] mb-2">
                    It warns, in their language
                  </h3>
                  <p className="text-sm sm:text-base text-[#595c62] leading-relaxed">
                    A full-screen vermilion alert sheet speaks audibly in Gujarati or Hindi, delivering calm authoritative counter-counsel with instantaneous &ldquo;Hang up&rdquo; and &ldquo;Call my child&rdquo; triggers.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Real-Time Engine Stream Visual Panel */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <div className="bg-white rounded-2xl border border-hairline p-7 shadow-[0_12px_32px_-4px_rgba(14,17,22,0.08)]">
                <div className="flex items-center justify-between pb-4 border-b border-hairline">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#b7140f] animate-pulse" />
                    <span className="text-xs uppercase font-semibold text-[#595c62]">
                      Real-Time Engine Stream
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#595c62]">LATENCY: 410ms</span>
                </div>

                {/* Feed */}
                <div className="my-6 space-y-4">
                  <div className="p-3.5 bg-[#f5f3ef] rounded-xl text-xs font-mono text-[#595c62] leading-relaxed">
                    [PARSING]: &ldquo;Don&apos;t disconnect video or we notify local police chowki...&rdquo;
                  </div>

                  <div className="p-5 bg-[#FEF5F4] border-2 border-[#E5392B] rounded-2xl">
                    <div className="flex items-center gap-2 text-[#b7140f] font-semibold text-sm mb-2">
                      <Shield className="w-4 h-4 text-[#b7140f]" />
                      <span>Coercion Signature Identified</span>
                    </div>
                    <p className="font-serif text-base text-[#0E1116] font-medium leading-snug">
                      &ldquo;CBI never requests funds to clear court warrants.&rdquo;
                    </p>
                    <p className="text-sm text-[#b7140f] font-medium mt-2">
                      &ldquo;સીબીઆઈ ક્યારેય બેંક ખાતું ચકાસવા માટે પૈસા માંગતી નથી.&rdquo;
                    </p>
                  </div>
                </div>

                {/* Auto Action Trigger */}
                <div className="pt-2 flex items-center justify-between text-xs text-[#595c62]">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-[#006c4c]" />
                    Active Family Notification Ready
                  </span>
                  <span className="font-semibold text-[#0E1116]">Auto-Armed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. THE FLAGS / BENTO GRID (Extortion Taxonomy)                           */}
      {/* ========================================================================= */}
      <section className="py-24 md:py-32 border-b border-hairline" id="scam-types">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 md:px-12">
          <div className="max-w-2xl mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#595c62] block mb-3">
              Extortion Taxonomy
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#0E1116] leading-tight font-normal">
              The anatomy of coercion.
            </h2>
            <p className="text-sm sm:text-base text-[#595c62] mt-3">
              Trained on tens of thousands of Indian cybercrime patterns and police logs.
            </p>
          </div>

          {/* Bento Grid (6 Asymmetric Tiles) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tile 1: Digital Arrest (Dark Ink / Large) */}
            <div className="md:col-span-2 bg-[#0E1116] text-[#FAF8F4] rounded-2xl p-8 border border-hairline shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E5392B] text-white">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    Primary Threat Vector
                  </span>
                  <span className="text-stone-400 text-xs font-mono">CODE: PATTERN-01</span>
                </div>
                <h3 className="font-serif text-2xl md:text-3xl font-medium text-white mb-3">
                  Digital arrest
                </h3>
                <p className="text-stone-300 text-sm sm:text-base leading-relaxed mb-6">
                  Scammers pose as CBI, Delhi Police, or Telecom Enforcement on video calls, ordering victims to stay confined to their room under legal threat.
                </p>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 font-mono text-xs sm:text-sm text-[#FFB4A9] leading-relaxed">
                  “Aadhaar linked to narcotics syndicate. Stay on camera.” <br />
                  <span className="text-stone-400 text-xs">
                    તમારું આધાર કાર્ડ મુંબઈ પાર્સલમાં મળેલા માદક દ્રવ્યો સાથે જોડાયેલું છે. કેમેરા ચાલુ રાખો.
                  </span>
                </div>
              </div>
              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-stone-400">
                <span>Average financial damage: ₹18.4 Lakhs</span>
                <span className="text-white font-medium">Auto-Intercepted</span>
              </div>
            </div>

            {/* Tile 2: Fake KYC Update */}
            <div className="bg-white rounded-2xl p-8 border border-hairline shadow-sm flex flex-col justify-between hover:border-stone-300 transition-colors">
              <div>
                <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-[#b7140f] mb-3">
                  Threat 02
                </span>
                <h3 className="text-xl text-[#0E1116] mb-2 font-semibold">Fake KYC Update</h3>
                <p className="text-xs sm:text-sm text-[#595c62] leading-relaxed mb-4">
                  Fraudulent utility cut-off warnings prompting urgent downloads of malicious configuration software.
                </p>
                <div className="p-3 bg-[#f5f3ef] rounded-lg text-xs italic text-[#0E1116]/90 border border-hairline">
                  &ldquo;Electricity bill unpaid. Power disconnected tonight unless you download this APK.&rdquo;
                </div>
              </div>
              <div className="mt-6 pt-3 border-t border-hairline flex items-center gap-1.5 text-xs text-[#b7140f] font-medium">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Malicious APK detected</span>
              </div>
            </div>

            {/* Tile 3: Fake Courier / Customs */}
            <div className="bg-white rounded-2xl p-8 border border-hairline shadow-sm flex flex-col justify-between hover:border-stone-300 transition-colors">
              <div>
                <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-[#b7140f] mb-3">
                  Threat 03
                </span>
                <h3 className="text-xl text-[#0E1116] mb-2 font-semibold">Fake Courier / Customs</h3>
                <p className="text-xs sm:text-sm text-[#595c62] leading-relaxed mb-4">
                  Fabricated international parcel notifications claiming intercepted passports or illicit contraband.
                </p>
                <div className="p-3 bg-[#f5f3ef] rounded-lg text-xs italic text-[#0E1116]/90 border border-hairline">
                  &ldquo;FedEx parcel to Taiwan containing contraband seized in Mumbai.&rdquo;
                </div>
              </div>
              <div className="mt-6 pt-3 border-t border-hairline flex items-center gap-1.5 text-xs text-[#b7140f] font-medium">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Customs impersonation</span>
              </div>
            </div>

            {/* Tile 4: OTP & Fast RTGS */}
            <div className="bg-white rounded-2xl p-8 border border-hairline shadow-sm flex flex-col justify-between hover:border-stone-300 transition-colors">
              <div>
                <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-[#b7140f] mb-3">
                  Threat 04
                </span>
                <h3 className="text-xl text-[#0E1116] mb-2 font-semibold">OTP &amp; Fast RTGS</h3>
                <p className="text-xs sm:text-sm text-[#595c62] leading-relaxed mb-4">
                  Pressure to transfer life savings into so-called &quot;RBI Secure Safekeeping&quot; verification accounts.
                </p>
                <div className="p-3 bg-[#f5f3ef] rounded-lg text-xs italic text-[#0E1116]/90 border border-hairline">
                  &ldquo;Move ₹4,50,000 to RBI verification account immediately for audit.&rdquo;
                </div>
              </div>
              <div className="mt-6 pt-3 border-t border-hairline flex items-center gap-1.5 text-xs text-[#b7140f] font-medium">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Unregulated transfer flag</span>
              </div>
            </div>

            {/* Tile 5: Remote-Access Apps */}
            <div className="bg-white rounded-2xl p-8 border border-hairline shadow-sm flex flex-col justify-between hover:border-stone-300 transition-colors">
              <div>
                <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-[#b7140f] mb-3">
                  Threat 05
                </span>
                <h3 className="text-xl text-[#0E1116] mb-2 font-semibold">Remote-Access Apps</h3>
                <p className="text-xs sm:text-sm text-[#595c62] leading-relaxed mb-4">
                  Guiding elderly parents step-by-step to install desktop mirrors to hijack their bank screens.
                </p>
                <div className="p-3 bg-[#f5f3ef] rounded-lg text-xs italic text-[#0E1116]/90 border border-hairline">
                  &ldquo;Install AnyDesk or TeamViewer to verify your bank KYC live.&rdquo;
                </div>
              </div>
              <div className="mt-6 pt-3 border-t border-hairline flex items-center gap-1.5 text-xs text-[#b7140f] font-medium">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Device takeover signature</span>
              </div>
            </div>

            {/* Tile 6: Secrecy Mandate */}
            <div className="bg-white rounded-2xl p-8 border border-hairline shadow-sm flex flex-col justify-between hover:border-stone-300 transition-colors md:col-span-3 lg:col-span-1">
              <div>
                <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-[#b7140f] mb-3">
                  Threat 06
                </span>
                <h3 className="text-xl text-[#0E1116] mb-2 font-semibold">Secrecy Mandate</h3>
                <p className="text-xs sm:text-sm text-[#595c62] leading-relaxed mb-4">
                  Psychological coercion designed to separate parents from family members or children.
                </p>
                <div className="p-3 bg-[#f5f3ef] rounded-lg text-xs italic text-[#0E1116]/90 border border-hairline">
                  &ldquo;Do not disconnect or tell family under the Official Secrets Act.&rdquo;
                </div>
              </div>
              <div className="mt-6 pt-3 border-t border-hairline flex items-center gap-1.5 text-xs text-[#b7140f] font-medium">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Isolation psychological trigger</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. DOESN'T CRY WOLF (Side-by-side comparison)                             */}
      {/* ========================================================================= */}
      <section className="py-24 md:py-32 border-b border-hairline bg-[#FAF8F4]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#006c4c] block mb-3">
              Zero False-Alarm Rigor
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#0E1116] leading-tight font-normal">
              It knows the difference between a scammer and your son.
            </h2>
            <p className="text-base sm:text-xl text-[#595c62] mt-4 max-w-2xl mx-auto">
              Protection that never disrupts genuine family conversations, bank confirmations, or doctor calls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Left Card: Scam Call */}
            <div className="bg-white rounded-2xl p-8 border-2 border-[#E5392B] shadow-[0_4px_16px_rgba(229,57,43,0.06)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-hairline mb-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FEF5F4] text-[#b7140f] border border-[#b7140f]/20">
                    <span className="w-2 h-2 rounded-full bg-[#b7140f]" />
                    Threat Detected
                  </span>
                  <span className="font-mono text-sm font-bold text-[#b7140f]">RISK: 94 / 100</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#595c62] font-semibold mb-1">
                      Incoming Caller
                    </p>
                    <p className="font-medium text-[#0E1116] text-base">
                      +91 98210 44102 (Spoofed Identity)
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#595c62] font-semibold mb-1">
                      Extracted Transcript
                    </p>
                    <div className="p-3.5 bg-[#f5f3ef] rounded-xl text-sm leading-relaxed text-[#0E1116]">
                      &ldquo;I am Inspector Sharma from Crime Branch. We have your{' '}
                      <span className="bg-red-100 text-[#b7140f] font-semibold px-1 rounded">
                        arrest warrant
                      </span>
                      . You need an{' '}
                      <span className="bg-red-100 text-[#b7140f] font-semibold px-1 rounded">
                        urgent transfer
                      </span>{' '}
                      before 4 PM or van arrives.&rdquo;
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-4 border-t border-hairline flex items-center justify-between text-xs">
                <span className="text-[#b7140f] font-semibold flex items-center gap-1">
                  <PhoneOff className="w-3.5 h-3.5" />
                  Full Audio Shield Triggered
                </span>
                <span className="text-[#595c62]">Alert dispatched to family</span>
              </div>
            </div>

            {/* Right Card: Genuine Family Call */}
            <div className="bg-white rounded-2xl p-8 border-2 border-[#006c4c] shadow-[0_4px_16px_rgba(0,108,76,0.06)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-hairline mb-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-[#006c4c] border border-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-[#006c4c]" />
                    Safe Call Verified
                  </span>
                  <span className="font-mono text-sm font-bold text-[#006c4c]">RISK: 0 / 100</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#595c62] font-semibold mb-1">
                      Known Contact
                    </p>
                    <p className="font-medium text-[#0E1116] text-base">Rajesh (Son)</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#595c62] font-semibold mb-1">
                      Extracted Transcript
                    </p>
                    <div className="p-3.5 bg-[#f5f3ef] rounded-xl text-sm leading-relaxed text-[#0E1116]">
                      &ldquo;Papa, did you take your blood pressure medication? Also I ordered the groceries on Blinkit, they will arrive in 10 minutes.&rdquo;
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-4 border-t border-hairline flex items-center justify-between text-xs">
                <span className="text-[#006c4c] font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  No Red Flags Detected
                </span>
                <span className="text-[#595c62]">Silent monitoring • Zero interruption</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. FOR FAMILIES (Full-bleed dark ink section with WhatsApp alert mockup)  */}
      {/* ========================================================================= */}
      <section className="py-24 md:py-32 bg-[#0E1116] text-white relative overflow-hidden" id="for-families">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Left: Alerts information */}
            <div className="lg:col-span-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#ffb4a9] block mb-3">
                Family Network Sync
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white leading-tight font-normal mb-6">
                You’ll know the moment they’re in danger.
              </h2>
              <p className="text-stone-300 text-base sm:text-xl font-normal mb-10 leading-relaxed">
                When cybercriminals attempt to isolate your parents, Kavach bridges the gap immediately.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center shrink-0 mt-1">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-base sm:text-lg">
                      Instant WhatsApp &amp; SMS ping
                    </h3>
                    <p className="text-stone-400 text-xs sm:text-sm mt-1 leading-relaxed">
                      Dispatched to designated adult children within 3 seconds of high threat detection, complete with call context.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center shrink-0 mt-1">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-base sm:text-lg">
                      1-Tap emergency override
                    </h3>
                    <p className="text-stone-400 text-xs sm:text-sm mt-1 leading-relaxed">
                      Connect immediately to de-escalate fear, comfort your parent, and force the fraudulent call to drop.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center shrink-0 mt-1">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-base sm:text-lg">
                      Forensic evidence transcript
                    </h3>
                    <p className="text-stone-400 text-xs sm:text-sm mt-1 leading-relaxed">
                      Structured call logs preserved automatically to submit directly to 1930 and state cyber cell investigators.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: WhatsApp Alert Mockup */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-[380px] bg-[#121B22] rounded-3xl p-5 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs text-white/60 mb-4">
                  <span className="flex items-center gap-1 font-medium">
                    <span className="w-2 h-2 rounded-full bg-[#25D366]" />
                    WhatsApp Family Notification
                  </span>
                  <span>Just now</span>
                </div>

                <div className="bg-[#1F2C34] rounded-2xl p-4 border border-white/10 text-white">
                  <div className="flex items-center gap-2 mb-2 text-[#E5392B] font-semibold text-xs tracking-wide uppercase">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Critical Kavach Guardian Alert</span>
                  </div>
                  <p className="text-sm text-white/95 leading-relaxed mb-3">
                    ⚠️ <strong className="text-white font-semibold">Harishchandra (Father)</strong> is currently on a suspected{' '}
                    <strong className="text-[#ffb4a9]">Digital Arrest</strong> call from +91 98210 44102. Audio intercepted.
                  </p>
                  <div className="bg-black/30 p-2.5 rounded-lg text-xs font-mono text-white/80 mb-4 border border-white/5">
                    &ldquo;Suspect claiming to be CBI Officer demanding Aadhaar verification under Section 144.&rdquo;
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                    <button
                      type="button"
                      className="py-2 px-3 rounded-lg bg-[#E5392B] text-white font-medium text-xs text-center hover:bg-[#b7140f] transition active:scale-[0.98]"
                    >
                      Call Father Now
                    </button>
                    <button
                      type="button"
                      className="py-2 px-3 rounded-lg bg-white/10 text-white font-medium text-xs text-center hover:bg-white/20 transition active:scale-[0.98]"
                    >
                      View Transcript
                    </button>
                  </div>
                </div>

                <div className="text-center mt-3 text-[11px] text-white/40">
                  Encrypted channel • Incident reference #KV-9921
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. TRUST & PRIVACY (Quiet, factual, honest)                               */}
      {/* ========================================================================= */}
      <section className="py-24 md:py-32 border-b border-hairline bg-[#FAF8F4]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#595c62] block mb-3">
              Integrity Architecture
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#0E1116] leading-tight font-normal">
              Dignified privacy, absolute clarity.
            </h2>
            <p className="text-sm text-[#595c62] mt-3">
              Constructed with strict boundaries. We safeguard elderly autonomy without overreach.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-hairline shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#f5f3ef] border border-hairline flex items-center justify-center text-[#0E1116] mb-6">
                <Clock className="w-6 h-6 text-[#595c62]" />
              </div>
              <h3 className="text-lg text-[#0E1116] mb-2 font-semibold">
                Audio is analysed only during the call
              </h3>
              <p className="text-sm text-[#595c62] leading-relaxed">
                Ephemeral session processing streams convert speech to semantic signals. Zero raw audio recordings are archived permanently to our servers.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-hairline shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#f5f3ef] border border-hairline flex items-center justify-center text-[#0E1116] mb-6">
                <Lock className="w-6 h-6 text-[#595c62]" />
              </div>
              <h3 className="text-lg text-[#0E1116] mb-2 font-semibold">
                You control what is saved
              </h3>
              <p className="text-sm text-[#595c62] leading-relaxed">
                Families decide whether flagged forensic transcripts are retained for police reference or instantly purged after the threat is dismissed.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-hairline shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#f5f3ef] border border-hairline flex items-center justify-center text-[#0E1116] mb-6">
                <Shield className="w-6 h-6 text-[#595c62]" />
              </div>
              <h3 className="text-lg text-[#0E1116] mb-2 font-semibold">
                Direct integration with 1930 &amp; cybercrime.gov.in
              </h3>
              <p className="text-sm text-[#595c62] leading-relaxed">
                Standardized evidence dossiers formatted specifically to meet Indian Cyber Crime Coordination Centre (I4C) official filing requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. FINAL CTA SECTION                                                     */}
      {/* ========================================================================= */}
      <section className="py-24 md:py-32 border-b border-hairline bg-[#f5f3ef]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 md:px-12 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#0E1116] mb-5 leading-tight font-normal">
              Protect them before the phone rings.
            </h2>
            <p className="text-base sm:text-xl text-[#595c62] mb-10 max-w-xl mx-auto">
              Set up Kavach on your parents’ phones in under 90 seconds. Simple remote pairing.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#live-demo"
                className="w-full sm:w-auto h-14 px-8 rounded-full bg-[#E5392B] hover:bg-[#b7140f] text-white font-medium text-base flex items-center justify-center gap-2 transition-colors active:scale-[0.98] shadow-md shadow-red-500/20"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Try the live demo</span>
              </a>
              <a
                href="#for-families"
                className="w-full sm:w-auto h-14 px-8 rounded-full bg-[#0E1116] hover:bg-black text-[#FAF8F4] font-medium text-base flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
              >
                <span>Set up for my parents</span>
              </a>
            </div>

            <p className="text-xs text-[#595c62] mt-8">
              Compatible with all Android devices running Android 10+. iOS support launching Q2 2025.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. FOOTER (Helplines, Resources, Regional Languages, Legal)              */}
      {/* ========================================================================= */}
      <footer className="bg-[#FAF8F4] border-t border-[#E7E2D9]">
        <div className="w-full py-16 px-4 sm:px-6 md:px-12 max-w-[1240px] mx-auto flex flex-col gap-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Column 1: Product */}
            <div>
              <div className="text-base font-semibold text-[#0E1116] mb-4">Kavach</div>
              <ul className="space-y-2 text-xs sm:text-[13px] text-[#595c62]">
                <li>
                  <a href="#how-it-works" className="hover:text-[#b7140f] transition-colors">
                    How it works
                  </a>
                </li>
                <li>
                  <a href="#scam-types" className="hover:text-[#b7140f] transition-colors">
                    Scam types
                  </a>
                </li>
                <li>
                  <a href="#for-families" className="hover:text-[#b7140f] transition-colors">
                    For families
                  </a>
                </li>
                <li>
                  <a href="#live-demo" className="hover:text-[#b7140f] transition-colors">
                    Live Demo
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2: Resources & Helplines */}
            <div>
              <div className="text-xs uppercase tracking-wider text-[#0E1116] font-semibold mb-4">
                Helplines
              </div>
              <ul className="space-y-2 text-xs sm:text-[13px] text-[#595c62]">
                <li>
                  <a
                    href="tel:1930"
                    className="hover:text-[#b7140f] font-semibold text-[#b7140f] flex items-center gap-1"
                  >
                    National Cyber Helpline: 1930
                  </a>
                </li>
                <li>
                  <a
                    href="https://cybercrime.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#b7140f] transition-colors flex items-center gap-1"
                  >
                    cybercrime.gov.in
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-[#b7140f] transition-colors">
                    Senior Safety Protocol
                  </a>
                </li>
                <li>
                  <a href="#for-families" className="hover:text-[#b7140f] transition-colors">
                    Family Charter
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Languages */}
            <div>
              <div className="text-xs uppercase tracking-wider text-[#0E1116] font-semibold mb-4">
                Languages
              </div>
              <ul className="space-y-2 text-xs sm:text-[13px] text-[#595c62]">
                <li className="font-semibold text-[#0E1116]">English (IN)</li>
                <li>हिन्दी (Hindi)</li>
                <li>ગુજરાતી (Gujarati)</li>
                <li>मराठी (Marathi)</li>
                <li>தமிழ் (Tamil)</li>
              </ul>
            </div>

            {/* Column 4: Legal */}
            <div>
              <div className="text-xs uppercase tracking-wider text-[#0E1116] font-semibold mb-4">
                Governance
              </div>
              <ul className="space-y-2 text-xs sm:text-[13px] text-[#595c62]">
                <li>
                  <a href="#" className="hover:text-[#b7140f] transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#b7140f] transition-colors">
                    Security Architecture
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#b7140f] transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#b7140f] transition-colors">
                    Contact Grievance Officer
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright Text */}
          <div className="pt-8 border-t border-hairline flex flex-col md:flex-row items-center justify-between text-xs text-[#595c62] gap-4 text-center md:text-left">
            <p>
              © 2025 Kavach Digital Guardianship. In alignment with Indian Cyber Crime Coordination Centre (I4C). National Cyber Helpline: 1930 | cybercrime.gov.in
            </p>
            <div className="flex items-center gap-2 shrink-0 text-[#006c4c] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#006c4c]" />
              <span>Surveillance-free architecture</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
