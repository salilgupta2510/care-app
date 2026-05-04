import { onRequest, defineSecret } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import type { WhatsAppWebhookBody } from '../types';
import {
  findPatientByPhone,
  createUnknownPatient,
  getOrCreateOpenChat,
  isMessageDuplicate,
} from '../lib/firestore';
import { logInfo, logError, logWarn } from '../lib/logger';
import { anthropicApiKey } from '../ai/client';

const waVerifyToken = defineSecret('WA_VERIFY_TOKEN');

export const whatsappWebhook = onRequest(
  {
    secrets: [anthropicApiKey, waVerifyToken],
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB',
  },
  async (req, res) => {
    // GET: Meta webhook verification handshake
    if (req.method === 'GET') {
      const mode = req.query['hub.mode'] as string;
      const token = req.query['hub.verify_token'] as string;
      const challenge = req.query['hub.challenge'] as string;

      if (mode === 'subscribe' && token === waVerifyToken.value()) {
        logInfo('WhatsApp webhook verified');
        res.status(200).send(challenge);
        return;
      }
      res.sendStatus(403);
      return;
    }

    if (req.method !== 'POST') {
      res.sendStatus(405);
      return;
    }

    // Respond immediately — Meta requires <20s
    res.sendStatus(200);

    try {
      const body = req.body as WhatsAppWebhookBody;
      const messages = body?.entry?.[0]?.changes?.[0]?.value?.messages;
      const contacts = body?.entry?.[0]?.changes?.[0]?.value?.contacts;

      if (!messages?.length) return;

      for (const msg of messages) {
        if (msg.type !== 'text' && msg.type !== 'audio') {
          logWarn('Skipping unsupported message type', { type: msg.type });
          continue;
        }

        // Idempotency
        if (await isMessageDuplicate(msg.id)) {
          logInfo('Duplicate message, skipping', { waMessageId: msg.id });
          continue;
        }

        const fromPhone = msg.from;
        const contactName = contacts?.find((c) => c.wa_id === fromPhone)?.profile?.name;

        // Resolve patient
        let patient = await findPatientByPhone(fromPhone);
        let patientId: string;
        if (patient) {
          patientId = patient.id;
        } else {
          patientId = await createUnknownPatient(fromPhone, contactName);
        }

        const chatId = await getOrCreateOpenChat(patientId);
        const textContent = msg.type === 'text' ? (msg.text?.body ?? '') : '';

        // Persist raw message (Firestore trigger handles AI pipeline)
        await admin
          .firestore()
          .collection('chats')
          .doc(chatId)
          .collection('messages')
          .add({
            waMessageId: msg.id,
            from: fromPhone,
            type: msg.type,
            content: textContent,
            audioMediaId: msg.audio?.id ?? null,
            category: 'other', // updated by AI trigger
            chatId,
            patientId,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });

        // Update chat metadata
        await admin.firestore().collection('chats').doc(chatId).update({
          lastMessage: textContent || '[Audio message]',
          lastMessageAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        logInfo('Message stored', { chatId, patientId, type: msg.type });
      }
    } catch (err) {
      logError('Webhook processing error', err);
    }
  }
);
