import { logError } from '../lib/logger';

export async function transcribeAudio(audioUrl: string): Promise<string | null> {
  // Anthropic does not yet offer a transcription endpoint.
  // Wire in OpenAI Whisper or Google STT here.
  // Example with OpenAI (add openai to functions/package.json):
  //
  // import OpenAI from 'openai';
  // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  // const transcription = await openai.audio.transcriptions.create({
  //   file: await fetch(audioUrl).then(r => r.blob()),
  //   model: 'whisper-1',
  //   language: 'en',
  // });
  // return transcription.text;

  logError('transcribeAudio: no transcription provider configured', { audioUrl });
  return null;
}
