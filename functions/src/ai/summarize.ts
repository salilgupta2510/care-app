import { getAnthropicClient } from './client';
import { logError } from '../lib/logger';

export interface SummaryResult {
  summary: string;
  keyPoints: string[];
  nextActions: string[];
}

export async function summarizeThread(messages: string[]): Promise<SummaryResult | null> {
  if (messages.length < 2) return null;

  const thread = messages.join('\n---\n');

  try {
    const client = getAnthropicClient();
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 600,
      system: `You are a clinical medical assistant summarizing a patient-doctor WhatsApp conversation.

Extract:
1. A concise one-paragraph clinical summary (2-4 sentences)
2. Key clinical points as a bullet list (3-6 points)
3. Recommended next actions (2-4 actions)

Output ONLY valid JSON in this exact format:
{
  "summary": "string",
  "keyPoints": ["string", ...],
  "nextActions": ["string", ...]
}

HIPAA: Do not include raw phone numbers or unnecessary PII beyond what is in the thread.`,
      messages: [
        {
          role: 'user',
          content: `Patient-doctor message thread:\n\n${thread}`,
        },
      ],
    });

    const raw = (response.content[0] as { text: string }).text.trim();
    const parsed = JSON.parse(raw) as SummaryResult;
    return parsed;
  } catch (err) {
    logError('summarizeThread failed', err);
    return null;
  }
}
