import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';
import { anthropicApiKey } from '../ai/client';
import { categorizeMessage } from '../ai/categorize';
import { summarizeThread } from '../ai/summarize';
import { getRecentMessages } from '../lib/firestore';
import { logError, logInfo } from '../lib/logger';

export const onMessageCreate = onDocumentCreated(
  {
    document: 'chats/{chatId}/messages/{messageId}',
    secrets: [anthropicApiKey],
    region: 'us-central1',
    memory: '512MiB',
    timeoutSeconds: 120,
  },
  async (event) => {
    const message = event.data?.data();
    if (!message) return;

    const { chatId } = event.params;
    const messageRef = event.data!.ref;

    if (message.type !== 'text' || !message.content) return;

    try {
      // Run categorization and context fetch in parallel
      const [category, recentMessages] = await Promise.all([
        categorizeMessage(message.content as string),
        getRecentMessages(chatId, 20),
      ]);

      // Update message category
      await messageRef.update({ category });

      // Update chat last category
      await admin.firestore().collection('chats').doc(chatId).update({
        lastCategory: category,
      });

      logInfo('Message categorized', { chatId, category });

      // Generate/update summary if enough context
      if (recentMessages.length >= 2) {
        const result = await summarizeThread(recentMessages);
        if (result) {
          await admin.firestore().collection('summaries').add({
            chatId,
            patientId: message.patientId,
            generatedAt: admin.firestore.FieldValue.serverTimestamp(),
            model: 'claude-sonnet-4-6',
            messageCount: recentMessages.length,
            ...result,
          });
          logInfo('Summary generated', { chatId });
        }
      }
    } catch (err) {
      logError('onMessageCreate trigger failed', err);
    }
  }
);
