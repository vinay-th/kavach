// src/lib/mock-data.ts
// Mock analysis results simulating scam calls escalating safe -> suspicious -> scam, plus genuine calls.
import type { AnalysisResult } from '@/types/analysis';
import type { CallScenario, ScenarioId } from '@/types/call';

export const CALL_SCENARIOS: CallScenario[] = [
  {
    id: 'scam-digital-arrest',
    title: 'Digital Arrest Extortion',
    callerName: 'ACP Ramesh Sharma (Fake Crime Branch)',
    callerNumber: '+91 98210 44102',
    duration: '00:24',
    expectedVerdict: 'scam',
    audioFile: '/calls/digital-arrest.wav',
    description: 'Impersonates Mumbai Crime Branch, claims Aadhaar is tied to contraband parcel, threatens arrest, demands money.',
  },
  {
    id: 'scam-courier-customs',
    title: 'Customs / FedEx Parcel Seizure',
    callerName: 'FedEx Customs Officer (Fake)',
    callerNumber: '+91 88001 92834',
    duration: '00:20',
    expectedVerdict: 'scam',
    audioFile: '/calls/courier-customs.wav',
    description: 'Claims an international parcel to Taiwan with passports has been seized in Mumbai and orders an immediate verification fee.',
  },
  {
    id: 'scam-bank-kyc',
    title: 'Fake Electricity / KYC Suspension',
    callerName: 'Electricity Board / Bank Verification',
    callerNumber: '+91 70421 55901',
    duration: '00:20',
    expectedVerdict: 'scam',
    audioFile: '/calls/bank-kyc.wav',
    description: 'Warns electricity will be disconnected tonight unless an unauthorized APK or remote access tool is installed.',
  },
  {
    id: 'genuine-delivery',
    title: 'Genuine Delivery Partner Call',
    callerName: 'Amazon / Blinkit Delivery',
    callerNumber: '+91 91234 56789',
    duration: '00:15',
    expectedVerdict: 'safe',
    audioFile: '/calls/genuine-delivery.wav',
    description: 'Routine call inquiring about apartment building gate passcode and delivery drop location.',
  },
];

export const MOCK_CHUNKS: AnalysisResult[] = [
  // Chunk 0 (0–6s): Safe opening — caller introduces themselves
  {
    transcript:
      'Hello, this is ACP Sharma calling from Mumbai Crime Branch. We have received a complaint regarding a courier parcel.',
    languageDetected: 'en-IN',
    riskScore: 18,
    verdict: 'safe',
    redFlags: [],
    explanation: {
      gu: 'હાલ કૉલ સામાન્ય લાગે છે. ધ્યાનથી સાંભળો.',
      hi: 'अभी कॉल सामान्य लग रही है। ध्यान से सुनें।',
      en: 'Call appears normal so far. Listen carefully.',
    },
    recommendedAction: {
      gu: 'ધ્યાનથી સાંભળો, ગભરાટ ન અનુભવો.',
      hi: 'ध्यान से सुनें, घबराएं नहीं।',
      en: 'Listen carefully, do not panic.',
    },
  },
  // Chunk 1 (6–12s): Suspicious — fake authority claim
  {
    transcript:
      'A parcel registered to your Aadhaar card has been intercepted at Mumbai airport containing illegal documents and narcotics. You are named as the primary suspect.',
    languageDetected: 'en-IN',
    riskScore: 52,
    verdict: 'suspicious',
    redFlags: [
      { type: 'fake_authority', evidence: 'Claims to be ACP from Crime Branch' },
      { type: 'urgency', evidence: 'Named as primary suspect in narcotics case' },
    ],
    explanation: {
      gu: 'સાવધાન! પોલીસ ક્યારેય ફોન પર આ રીતે સંપર્ક નથી કરતી. આ છેતરપિંડી હોઈ શકે.',
      hi: 'सावधान! पुलिस कभी इस तरह फ़ोन नहीं करती। यह धोखाधड़ी हो सकती है।',
      en: 'Warning! Police never contact suspects this way. This may be a scam.',
    },
    recommendedAction: {
      gu: 'ફોન ન કાપો, પણ કોઈ માહિતી ન આપો.',
      hi: 'फ़ोन मत काटें, लेकिन कोई जानकारी न दें।',
      en: 'Do not hang up, but do not share any information.',
    },
  },
  // Chunk 2 (12–18s): Scam — digital arrest + money demand
  {
    transcript:
      'You are hereby placed under Digital Arrest! Do not disconnect this call or contact anyone. To avoid immediate arrest you must transfer ₹50,000 to the CBI verification escrow account right now. If you tell anyone, you will be arrested within the hour!',
    languageDetected: 'en-IN',
    riskScore: 94,
    verdict: 'scam',
    redFlags: [
      { type: 'fake_authority', evidence: 'Claims to be CBI officer placing "Digital Arrest"' },
      { type: 'threat', evidence: 'Threatened with immediate physical arrest' },
      { type: 'money_request', evidence: 'Demands ₹50,000 transfer to "CBI escrow account"' },
      { type: 'secrecy', evidence: 'Ordered not to tell anyone or disconnect' },
    ],
    explanation: {
      gu: 'આ ૧૦૦% છેતરપિંડી છે! "ડિજિટલ અરેસ્ટ" ભારતીય કાયદામાં અસ્તિત્વ ધરાવતો નથી. પોલીસ ક્યારેય ફોન પર ધરપકડ નથી કરતી.',
      hi: 'यह 100% फ्रॉड है! "डिजिटल अरेस्ट" भारतीय कानून में मौजूद नहीं है। पुलिस कभी फ़ोन पर गिरफ़्तार नहीं करती।',
      en: 'This is 100% a scam! "Digital Arrest" does not exist in Indian law. Police never arrest over phone calls.',
    },
    recommendedAction: {
      gu: 'તરત જ ફોન કાપી નાખો! પૈસા ક્યારેય ટ્રાન્સફર ન કરો. સાયબર ક્રાઇમ હેલ્પલાઇન 1930 પર ફોન કરો.',
      hi: 'तुरंत फ़ोन काट दें! कभी पैसे ट्रांसफर न करें। साइबर क्राइम हेल्पलाइन 1930 पर कॉल करें।',
      en: 'Hang up immediately! Never transfer money. Call Cyber Crime Helpline 1930.',
    },
  },
  // Chunk 3 (18–24s): Still scam — caller softens tone
  {
    transcript:
      'Are you there? I understand you are scared. This is for your own protection. The transfer is mandatory to prove your innocence.',
    languageDetected: 'en-IN',
    riskScore: 94, // Can only hold or rise
    verdict: 'scam',
    redFlags: [
      { type: 'fake_authority', evidence: 'Still posing as police officer' },
      { type: 'money_request', evidence: 'Repeats transfer demand framed as "proving innocence"' },
      { type: 'urgency', evidence: 'Pressure tactics continuing' },
    ],
    explanation: {
      gu: 'છેતરપિંડી ચાલુ છે. ગળ ઊતરી ગઈ હોય એ ટ્રિક છે. ફોન તરત કાપો!',
      hi: 'धोखाधड़ी जारी है। नरम बात करना भी एक चाल है। तुरंत फ़ोन काटें!',
      en: 'Scam is ongoing. The softer tone is another manipulation tactic. Hang up now!',
    },
    recommendedAction: {
      gu: 'ફોન કાપો! 1930 પર ફોન કરો.',
      hi: 'फ़ोन काटें! 1930 पर कॉल करें।',
      en: 'Hang up! Call 1930.',
    },
  },
];

export const MOCK_COURIER_CHUNKS: AnalysisResult[] = [
  {
    transcript:
      'Sir, this is FedEx India Customs Department. A parcel sent with your Aadhaar ID to Taiwan was detained at cargo terminal.',
    languageDetected: 'en-IN',
    riskScore: 25,
    verdict: 'safe',
    redFlags: [],
    explanation: {
      gu: 'ફેડેક્સ કસ્ટમ્સ તરફથી કૉલ હોવાનો દાવો કરે છે. સાંભળો પરંતુ અંગત વિગતો ન આપો.',
      hi: 'कस्टम्स विभाग से कॉल होने का दावा कर रहे हैं। सुनें पर व्यक्तिगत जानकारी न दें।',
      en: 'Caller claims to be from FedEx Customs. Listen but do not share private info.',
    },
    recommendedAction: {
      gu: 'કોઈ OTP કે બેંક વિગત આપશો નહીં.',
      hi: 'कोई OTP या बैंक जानकारी न दें।',
      en: 'Do not share OTP or bank details.',
    },
  },
  {
    transcript:
      '5 expired passports and synthetic narcotics were found inside. Mumbai Customs officer has issued a criminal memo in your name.',
    languageDetected: 'en-IN',
    riskScore: 65,
    verdict: 'suspicious',
    redFlags: [
      { type: 'fake_authority', evidence: 'Customs impersonation and fabricated narcotics memo' },
      { type: 'threat', evidence: 'Threatened with criminal charge over intercept' },
    ],
    explanation: {
      gu: 'શંકાસ્પદ! કસ્ટમ્સ ક્યારેય ફોન પર ગુનાહિત કાર્યવાહીની ધમકી આપતી નથી.',
      hi: 'संदिग्ध! कस्टम्स कभी फ़ोन पर आपराधिक कार्रवाई की धमकी नहीं देता।',
      en: 'Suspicious! Customs officers never threaten prosecution over phone.',
    },
    recommendedAction: {
      gu: 'કૉલ કાપી દો અથવા પરિવારને જણાવો.',
      hi: 'कॉल काट दें या परिवार को बताएं।',
      en: 'Hang up or alert family.',
    },
  },
  {
    transcript:
      'To clear this notice immediately before CBI raid, pay ₹25,000 customs inspection clearance via RTGS right now.',
    languageDetected: 'en-IN',
    riskScore: 92,
    verdict: 'scam',
    redFlags: [
      { type: 'fake_authority', evidence: 'Posing as customs officer' },
      { type: 'money_request', evidence: 'Demand of ₹25,000 clearance via RTGS' },
      { type: 'urgency', evidence: 'Immediate clearance required before raid' },
    ],
    explanation: {
      gu: '૧૦૦% છેતરપિંડી! કસ્ટમ્સ કે પોલીસ ક્યારેય ફોન પર તાત્કાલિક પૈસા નથી માંગતી.',
      hi: '100% फ्रॉड! कस्टम्स या पुलिस कभी फ़ोन पर पैसे नहीं मांगती।',
      en: '100% scam! Customs or police never demand money transfers over phone.',
    },
    recommendedAction: {
      gu: 'તરત જ કૉલ કાપી 1930 પર જાણ કરો.',
      hi: 'तुरंत कॉल काट कर 1930 पर रिपोर्ट करें।',
      en: 'Hang up immediately and report to 1930.',
    },
  },
];

export const MOCK_KYC_CHUNKS: AnalysisResult[] = [
  {
    transcript:
      'Dear consumer, your electricity connection or bank KYC will be disconnected tonight at 9:30 PM due to pending document update.',
    languageDetected: 'en-IN',
    riskScore: 40,
    verdict: 'suspicious',
    redFlags: [
      { type: 'urgency', evidence: 'Disconnection deadline threatened tonight at 9:30 PM' },
    ],
    explanation: {
      gu: 'વીજળી અથવા બેંક KYC બંધ થવાની ચેતવણી છે. તાકીદનો દાવો સામાન્ય રીતે છેતરપિંડી હોય છે.',
      hi: 'बिजली या बैंक KYC बंद होने की धमकी दी जा रही है। यह अक्सर फ्रॉड होता है।',
      en: 'Disconnection threat detected. Artificial urgency is a standard scam tactic.',
    },
    recommendedAction: {
      gu: 'કોઈ લિંક ક્લિક ન કરો.',
      hi: 'कोई लिंक क्लिक न करें।',
      en: 'Do not click links or download apps.',
    },
  },
  {
    transcript:
      'Download this QuickSupport or AnyDesk app from this link immediately, open it and give me the 9-digit code to update your meter.',
    languageDetected: 'en-IN',
    riskScore: 95,
    verdict: 'scam',
    redFlags: [
      { type: 'remote_access', evidence: 'Instructing to install QuickSupport/AnyDesk remote tool' },
      { type: 'urgency', evidence: 'Urgent compliance to avoid power cutoff' },
    ],
    explanation: {
      gu: 'ખતરો! AnyDesk અથવા QuickSupport ઇન્સ્ટોલ કરાવવાનો પ્રયાસ છેતરપિંડી છે. ફોન તરત કાપો!',
      hi: 'खतरा! AnyDesk या QuickSupport इनस्टॉल करवाना फ्रॉड है। तुरंत फ़ोन काटें!',
      en: 'Extreme danger! Remote access app installation will drain your bank accounts. Hang up now!',
    },
    recommendedAction: {
      gu: 'તરત ફોન કાપો! કોઈપણ એપ ઇન્સ્ટોલ ન કરો.',
      hi: 'तुरंत फ़ोन काटें! कोई ऐप इनस्टॉल न करें।',
      en: 'Hang up immediately! Never install screen-sharing apps.',
    },
  },
];

// Genuine call mock (stays safe throughout)
export const MOCK_GENUINE_CHUNKS: AnalysisResult[] = [
  {
    transcript:
      'Hello, I am calling from Amazon delivery. I am outside your building gate. What is the gate code please? I have a package for you.',
    languageDetected: 'hi-IN',
    riskScore: 5,
    verdict: 'safe',
    redFlags: [],
    explanation: {
      gu: 'આ ડિલિવરી પાર્ટનરનો સામાન્ય ફોન છે. સુરક્ષિત છે.',
      hi: 'यह डिलीवरी पार्टनर का सामान्य कॉल है। सुरक्षित है।',
      en: 'This is a routine delivery partner call. Safe.',
    },
    recommendedAction: {
      gu: 'ગેટ કોડ શેર કરો.',
      hi: 'गेट कोड શેર करें।',
      en: 'Share gate code.',
    },
  },
  {
    transcript:
      'Okay sir, thank you. I am leaving the grocery package at your doorstep as requested. Have a good day.',
    languageDetected: 'hi-IN',
    riskScore: 4,
    verdict: 'safe',
    redFlags: [],
    explanation: {
      gu: 'કૉલ સુરક્ષિત રીતે પૂર્ણ થયો છે.',
      hi: 'कॉल सुरक्षित रूप से समाप्त हुआ।',
      en: 'Call ended normally with no red flags.',
    },
    recommendedAction: {
      gu: 'કોઈ કાર્યવાહીની જરૂર નથી.',
      hi: 'किसी कार्रवाई की आवश्यकता नहीं है।',
      en: 'No action needed.',
    },
  },
];

export function getMockChunksForScenario(id: ScenarioId): AnalysisResult[] {
  switch (id) {
    case 'genuine-delivery':
      return MOCK_GENUINE_CHUNKS;
    case 'scam-courier-customs':
      return MOCK_COURIER_CHUNKS;
    case 'scam-bank-kyc':
      return MOCK_KYC_CHUNKS;
    case 'scam-digital-arrest':
    default:
      return MOCK_CHUNKS;
  }
}
