import { onCall, HttpsError, defineSecret } from 'firebase-functions/v2/https';
import axios from 'axios';
import { logError, logInfo } from '../lib/logger';

const waAccessToken = defineSecret('WA_ACCESS_TOKEN');
const waPhoneNumberId = defineSecret('WA_PHONE_NUMBER_ID');

export const sendWhatsappReply = onCall(
  { secrets: [waAccessToken, waPhoneNumberId] },
  async (request) => {
    if (!request.auth) throw new HttpsError('unauthenticated', 'Must be signed in');

    const { to, text } = request.data as { to: string; text: string };
    if (!to || !text) throw new HttpsError('invalid-argument', 'to and text required');

    try {
      await axios.post(
        `https://graph.facebook.com/v20.0/${waPhoneNumberId.value()}/messages`,
        {
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: { body: text },
        },
        {
          headers: {
            Authorization: `Bearer ${waAccessToken.value()}`,
            'Content-Type': 'application/json',
          },
        }
      );

      logInfo('WhatsApp reply sent', { to });
      return { success: true };
    } catch (err) {
      logError('sendWhatsappReply failed', err);
      throw new HttpsError('internal', 'Failed to send message');
    }
  }
);
