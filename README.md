# VedaCare

AI-powered WhatsApp communication assistant for healthcare providers.

## Quick Start (Demo Mode)

```bash
cd VedaCare
cp .env.example .env
# .env already has EXPO_PUBLIC_USE_MOCK=true — no Firebase needed
npm install
npx expo start
```

Scan the QR with Expo Go or press `i` for iOS simulator.

## Stack

- **Expo SDK 52** + Expo Router v4 (file-based routing)
- **NativeWind v4** — Tailwind CSS for React Native
- **Firebase v11** — Auth, Firestore, Storage
- **TanStack Query v5** — Server state caching
- **Zustand** — UI state (theme, filters)
- **Reanimated 3 + Moti** — 60fps animations
- **Claude Sonnet 4.6** — AI categorization + summaries

## Environment Setup

Copy `.env.example` → `.env` and fill in your Firebase config:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
EXPO_PUBLIC_USE_MOCK=false   # set to true for UI dev without Firebase
```

## Firebase Setup

1. Create project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore, Storage, and Authentication (Email/Password)
3. Pin Firestore to `us-central1` for HIPAA data residency
4. Sign a **BAA** with Google Cloud (required for PHI)

```bash
npm install -g firebase-tools
firebase login
firebase use --add YOUR_PROJECT_ID
firebase deploy --only firestore:rules,storage
```

## Cloud Functions

```bash
cd functions
npm install
npm run build

# Set secrets (run once per project)
firebase functions:secrets:set ANTHROPIC_API_KEY
firebase functions:secrets:set WA_VERIFY_TOKEN
firebase functions:secrets:set WA_ACCESS_TOKEN
firebase functions:secrets:set WA_PHONE_NUMBER_ID

# Deploy
firebase deploy --only functions
```

## WhatsApp Business API

1. Create app at [developers.facebook.com](https://developers.facebook.com)
2. Add "WhatsApp Business" product
3. Register phone number
4. Set webhook URL → `https://us-central1-YOUR_PROJECT.cloudfunctions.net/whatsappWebhook`
5. Subscribe to `messages` field

## HIPAA Compliance Checklist

- [ ] Firebase BAA signed
- [ ] Anthropic Enterprise BAA signed (required for PHI in AI prompts)
- [ ] Firestore Security Rules deployed (`firebase deploy --only firestore:rules`)
- [ ] Storage Rules deployed
- [ ] Data residency pinned to `us-central1`
- [ ] Audit logging enabled in Firebase Console
- [ ] Penetration test completed before patient data goes live

## Project Structure

```
VedaCare/
├── app/                    # Expo Router screens
│   ├── (auth)/            # Login, onboarding
│   └── (app)/             # Authenticated: tabs, chat, patient, summary
├── src/
│   ├── components/        # UI + feature components
│   ├── hooks/             # Firebase real-time hooks
│   ├── lib/               # Firebase init, Firestore helpers
│   ├── stores/            # Zustand stores
│   ├── types/             # TypeScript types
│   ├── constants/         # Theme, categories, quick replies
│   └── utils/             # Seed data, date/format helpers
└── functions/             # Firebase Cloud Functions
    └── src/
        ├── whatsapp/      # Webhook + outbound send
        ├── ai/            # Claude categorize + summarize
        ├── triggers/      # Firestore + Storage triggers
        └── lib/           # Shared Firestore helpers
```
