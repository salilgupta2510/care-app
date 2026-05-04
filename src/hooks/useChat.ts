import { useState, useEffect } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { chatMessagesQuery, chatsCol } from '@/lib/firestore';
import { db } from '@/lib/firebase';
import type { Chat, Message } from '@/types/firestore';
import { SEED_CHATS, SEED_MESSAGES } from '@/utils/seed';

const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK === 'true';

export function useChat(chatId: string) {
  const [chat, setChat] = useState<Chat | null>(
    USE_MOCK ? (SEED_CHATS.find((c) => c.id === chatId) ?? null) : null
  );
  const [messages, setMessages] = useState<Message[]>(
    USE_MOCK ? (SEED_MESSAGES[chatId] ?? []) : []
  );
  const [loading, setLoading] = useState(!USE_MOCK);

  useEffect(() => {
    if (USE_MOCK) return;

    const chatUnsub = onSnapshot(doc(db, 'chats', chatId), (snap) => {
      if (snap.exists()) setChat({ id: snap.id, ...snap.data() } as Chat);
    });

    const msgsUnsub = onSnapshot(chatMessagesQuery(chatId), (snap) => {
      setMessages(snap.docs.map((d) => d.data()));
      setLoading(false);
    });

    return () => {
      chatUnsub();
      msgsUnsub();
    };
  }, [chatId]);

  return { chat, messages, loading };
}
