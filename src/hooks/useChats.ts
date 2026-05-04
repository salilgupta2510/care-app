import { useState, useEffect, useRef } from 'react';
import { onSnapshot } from 'firebase/firestore';
import { allOpenChatsQuery } from '@/lib/firestore';
import type { Chat, MessageCategory } from '@/types/firestore';
import { SEED_CHATS } from '@/utils/seed';
import { useUIStore } from '@/stores/uiStore';

const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK === 'true';

export function useChats(filter: MessageCategory | 'all' = 'all', search = '') {
  const [chats, setChats] = useState<Chat[]>(USE_MOCK ? SEED_CHATS : []);
  const [loading, setLoading] = useState(!USE_MOCK);
  const [error, setError] = useState<string | null>(null);
  const setTotalUnread = useUIStore((s) => s.setTotalUnread);
  const synced = useRef(false);

  useEffect(() => {
    if (USE_MOCK) {
      if (!synced.current) {
        const unread = SEED_CHATS.reduce((acc, c) => acc + c.unreadCount, 0);
        setTotalUnread(unread);
        synced.current = true;
      }
      return;
    }

    const q = allOpenChatsQuery();
    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => d.data() as Chat);
        setChats(data);
        setTotalUnread(data.reduce((acc, c) => acc + c.unreadCount, 0));
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  const filtered = chats.filter((c) => {
    const matchFilter = filter === 'all' || c.lastCategory === filter;
    const matchSearch =
      !search ||
      c.patientName?.toLowerCase().includes(search.toLowerCase()) ||
      c.lastMessage?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const urgentCount = chats.filter((c) => c.lastCategory === 'urgent' && c.unreadCount > 0).length;
  const totalUnread = chats.reduce((acc, c) => acc + c.unreadCount, 0);

  const categoryCounts: Record<string, number> = {
    all: chats.length,
    urgent: chats.filter((c) => c.lastCategory === 'urgent').length,
    appointment: chats.filter((c) => c.lastCategory === 'appointment').length,
    inquiry: chats.filter((c) => c.lastCategory === 'inquiry').length,
    other: chats.filter((c) => c.lastCategory === 'other').length,
  };

  return { chats: filtered, loading, error, urgentCount, totalUnread, categoryCounts };
}
