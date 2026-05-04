import type { MessageCategory } from '../types';
import { getAnthropicClient } from './client';
import { logError } from '../lib/logger';

const VALID_CATEGORIES: MessageCategory[] = ['urgent', 'appointment', 'inquiry', 'other'];

export async function categorizeMessage(text: string): Promise<MessageCategory> {
  try {
    const client = getAnthropicClient();
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 20,
      system: `You are a medical triage classifier. Classify the patient message into exactly one category:
- urgent: medical emergency, severe symptoms, chest pain, difficulty breathing, or anything requiring immediate attention
- appointment: scheduling, canceling, rescheduling appointments, or inquiring about visit times
- inquiry: general health questions, prescription questions, test results, non-urgent information requests
- other: everything else, greetings, unrelated content

Reply with ONLY the category word. Nothing else.`,
      messages: [{ role: 'user', content: text }],
    });

    const raw = (response.content[0] as { text: string }).text.trim().toLowerCase();
    const category = raw as MessageCategory;

    return VALID_CATEGORIES.includes(category) ? category : 'other';
  } catch (err) {
    logError('categorizeMessage failed', err);
    return 'other';
  }
}
