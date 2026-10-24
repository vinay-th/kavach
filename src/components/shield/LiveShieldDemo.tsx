'use client';

// src/components/shield/LiveShieldDemo.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, AlertCircle, Volume2, PhoneForwarded } from 'lucide-react';
import { useCallAnalysis } from '@/hooks/useCallAnalysis';
import { CALL_SCENARIOS } from '@/lib/mock-data';
import type { ScenarioId } from '@/types/call';
import { CallLibrary } from './CallLibrary';
import { CallCard } from './CallCard';
import { RiskGauge } from './RiskGauge';
import { ShieldStatusCard } from './ShieldStatusCard';
import { ElderExplanation } from './ElderExplanation';
import { RedFlagsList } from './RedFlagsList';
import { EmergencyActions } from './EmergencyActions';
import { WarningBanner } from './WarningBanner';
import { CallSummary } from './CallSummary';
import { LanguageToggle } from '@/components/locale/LanguageToggle';
import { useLanguage } from '@/context/LanguageContext';

export function LiveShieldDemo() {
  const { sessionState, selectScenario, startCall, stopCall, resetCall } =
    useCallAnalysis({ mockMode: true, mockChunkInterval: 5 });
  const { language } = useLanguage();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize with the digital arrest scenario on first render
  useEffect(() => {
    if (!sessionState.scenarioId) {
      selectScenario('scam-digital-arrest');
    }
  }, [selectScenario, sessionState.scenarioId]);

  const activeScenario =
    CALL_SCENARIOS.find((s) => s.id === sessionState.scenarioId) ??
    CALL_SCENARIOS[0];

  const handleHangUp = () => {
    stopCall();
    setToastMessage(
      language === 'gu'
        ? 'કૉલ કાપી નાખવામાં આવ્યો છે! તમે સુરક્ષિત છો.'
        : language === 'hi'
        ? 'कॉल काट दिया गया है! आप सुरक्षित हैं।'
        : 'Call disconnected successfully! You are safe.'
    );
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleAlertFamily = () => {
    setToastMessage(
      language === 'gu'
        ? 'તમારા પરિવારને WhatsApp & SMS દ્વારા સૂચના મોકલી દેવામાં આવી છે!'
        : language === 'hi'
        ? 'आपके परिवार को WhatsApp और SMS अलर्ट भेजा गया है!'
        : 'Family guardian alert dispatched via WhatsApp & SMS with live transcript context!'
    );
    setTimeout(() => setToastMessage(null), 5000);
  };

  return (
    <section className="w-full py-16 md:py-24 bg-[#FAF8F4] relative" id="live-demo">
      {/* Toast popup */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-4 z-50 max-w-md bg-stone-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-stone-700 flex items-center gap-3 text-sm"
          >
            <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="flex-1 font-medium">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold uppercase tracking-wider mb-3">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              Interactive Simulation
            </div>
            <h2 className="text-3xl md:text-5xl font-serif text-stone-900 font-normal tracking-tight">
              Live Call Interception Demo
            </h2>
            <p className="text-stone-600 mt-2 text-base md:text-lg max-w-2xl">
              Experience how Kavach analyses speech in short chunks, flags extortion formulas,
              and protects parents with native audio intelligence.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2">
            <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
              Elder Language Display
            </span>
            <LanguageToggle />
          </div>
        </div>

        {/* Scenario Selection Library */}
        <div className="mb-8">
          <CallLibrary
            selectedScenarioId={sessionState.scenarioId as ScenarioId}
            onSelectScenario={selectScenario}
            disabled={sessionState.status === 'playing' || sessionState.status === 'analyzing'}
          />
        </div>

        {/* Main Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Phone Call Monitor & Waveform */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <CallCard
              scenario={activeScenario}
              sessionState={sessionState}
              onStartCall={startCall}
              onStopCall={stopCall}
              onResetCall={resetCall}
            />

            {/* Quick Helper Note */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200/80 text-xs text-stone-500 space-y-1">
              <p className="font-semibold text-stone-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-red-600" />
                How to test this demo:
              </p>
              <p>
                1. Click &quot;Start Call Simulation&quot; to begin the 20-second incoming call.
              </p>
              <p>
                2. Watch the threat gauge escalate as scam claims are intercepted.
              </p>
              <p>
                3. Switch languages anytime using the toggle above to test Gujarati and Hindi advice.
              </p>
            </div>
          </div>

          {/* Right Column: AI Shield Analysis & Warnings */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Status Card & Risk Gauge */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
              <div className="md:col-span-7">
                <ShieldStatusCard
                  verdict={sessionState.currentVerdict}
                  score={sessionState.highestRiskScore}
                />
              </div>
              <div className="md:col-span-5 bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm flex flex-col items-center justify-center">
                <RiskGauge
                  score={sessionState.highestRiskScore}
                  verdict={sessionState.currentVerdict}
                />
              </div>
            </div>

            {/* Senior-Friendly Explanation Card (22px text) */}
            <ElderExplanation
              explanation={
                sessionState.latestResult?.explanation ?? {
                  gu: 'કૉલ શરૂ કરવા "Start Call Simulation" પર ક્લિક કરો. કવચ આપમેળે સ્કેમ ઓળખશે.',
                  hi: 'कॉल शुरू करने के लिए "Start Call Simulation" पर क्लिक करें। कवच अपने-आप फ्रॉड पहचानेगा।',
                  en: 'Click "Start Call Simulation" to test. Kavach will analyze the call stream in real time.',
                }
              }
              recommendedAction={
                sessionState.latestResult?.recommendedAction ?? {
                  gu: 'ધ્યાનથી સાંભળો.',
                  hi: 'ध्यान से सुनें।',
                  en: 'Listen carefully.',
                }
              }
              verdict={sessionState.currentVerdict}
            />

            {/* Red Flags Stagger List */}
            <RedFlagsList flags={sessionState.accumulatedRedFlags} />

            {/* Emergency Action Buttons (Hang up / Alert Child) */}
            <EmergencyActions
              verdict={sessionState.currentVerdict}
              isActive={sessionState.status === 'playing'}
              onHangUp={handleHangUp}
              onAlertFamily={handleAlertFamily}
            />

            {/* Post-Call Summary (Appears once completed) */}
            {sessionState.status === 'completed' && (
              <CallSummary state={sessionState} />
            )}
          </div>
        </div>
      </div>

      {/* Floating Bottom Warning Banner for Suspicious / Scam */}
      <WarningBanner verdict={sessionState.currentVerdict} />
    </section>
  );
}
