export type MessageCategory = 'urgent' | 'appointment' | 'inquiry' | 'other';
export type MessageType = 'text' | 'audio' | 'image' | 'document';

export interface WhatsAppWebhookBody {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        metadata: { display_phone_number: string; phone_number_id: string };
        contacts?: Array<{ profile: { name: string }; wa_id: string }>;
        messages?: WhatsAppMessage[];
      };
      field: string;
    }>;
  }>;
}

export interface WhatsAppMessage {
  id: string;
  from: string;
  timestamp: string;
  type: MessageType;
  text?: { body: string };
  audio?: { id: string; mime_type: string };
  image?: { id: string; caption?: string; mime_type: string };
}

export interface FirestoreMessage {
  waMessageId: string;
  from: string;
  type: MessageType;
  content: string;
  transcription?: string;
  category: MessageCategory;
  createdAt: FirebaseFirestore.FieldValue;
  chatId: string;
  patientId: string;
}
