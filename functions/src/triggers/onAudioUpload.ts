import { onObjectFinalized } from 'firebase-functions/v2/storage';
import * as admin from 'firebase-admin';
import { transcribeAudio } from '../ai/transcribe';
import { logError, logInfo } from '../lib/logger';

export const onAudioUpload = onObjectFinalized(
  { region: 'us-central1', memory: '512MiB', timeoutSeconds: 180 },
  async (event) => {
    const filePath = event.data.name;
    if (!filePath?.startsWith('audio/chats/')) return;

    // Expected path: audio/chats/{chatId}/{messageId}.ogg
    const parts = filePath.split('/');
    const chatId = parts[2];
    const messageId = parts[3]?.replace(/\.[^.]+$/, '');

    if (!chatId || !messageId) return;

    try {
      const bucket = admin.storage().bucket(event.data.bucket);
      const [url] = await bucket.file(filePath).getSignedUrl({
        action: 'read',
        expires: Date.now() + 10 * 60 * 1000, // 10 min
      });

      const transcription = await transcribeAudio(url);
      if (!transcription) return;

      await admin
        .firestore()
        .collection('chats')
        .doc(chatId)
        .collection('messages')
        .doc(messageId)
        .update({ transcription });

      logInfo('Audio transcribed', { chatId, messageId });
    } catch (err) {
      logError('onAudioUpload failed', err);
    }
  }
);
