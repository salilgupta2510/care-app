import * as admin from 'firebase-admin';

// Initialize Firebase Admin once
if (!admin.apps.length) {
  admin.initializeApp();
}

// HTTPS Functions
export { whatsappWebhook } from './whatsapp/webhook';
export { sendWhatsappReply } from './whatsapp/send';

// Firestore Triggers
export { onMessageCreate } from './triggers/onMessageCreate';

// Storage Triggers
export { onAudioUpload } from './triggers/onAudioUpload';
