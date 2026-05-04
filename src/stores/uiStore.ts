import { create } from 'zustand';
import type { MessageCategory } from '@/types/firestore';

type FilterKey = MessageCategory | 'all';

interface UIState {
  inboxFilter: FilterKey;
  searchQuery: string;
  themeOverride: 'light' | 'dark' | 'system';
  totalUnread: number;
  setInboxFilter: (filter: FilterKey) => void;
  setSearchQuery: (q: string) => void;
  setThemeOverride: (theme: 'light' | 'dark' | 'system') => void;
  setTotalUnread: (count: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
  inboxFilter: 'all',
  searchQuery: '',
  themeOverride: 'system',
  totalUnread: 0,
  setInboxFilter: (filter) => set({ inboxFilter: filter }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setThemeOverride: (theme) => set({ themeOverride: theme }),
  setTotalUnread: (count) => set({ totalUnread: count }),
}));
