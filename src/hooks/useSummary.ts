import { useState, useEffect } from 'react';
import { onSnapshot } from 'firebase/firestore';
import { latestSummaryQuery } from '@/lib/firestore';
import type { Summary } from '@/types/firestore';
import { SEED_SUMMARIES } from '@/utils/seed';

const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK === 'true';

export function useSummary(chatId: string) {
  const [summary, setSummary] = useState<Summary | null>(
    USE_MOCK ? (SEED_SUMMARIES[chatId] ?? null) : null
  );
  const [loading, setLoading] = useState(!USE_MOCK);

  useEffect(() => {
    if (USE_MOCK) return;

    const q = latestSummaryQuery(chatId);
    const unsub = onSnapshot(q, (snap) => {
      setSummary(snap.docs[0]?.data() ?? null);
      setLoading(false);
    });
    return unsub;
  }, [chatId]);

  return { summary, loading };
}
