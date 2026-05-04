import type { MessageCategory } from '@/types/firestore';

export const CATEGORY_CONFIG: Record<
  MessageCategory,
  { label: string; color: string; bgColor: string; darkColor: string; darkBgColor: string; emoji: string }
> = {
  urgent: {
    label: 'Urgent',
    color: '#DC2626',
    bgColor: '#FEF2F2',
    darkColor: '#EF4444',
    darkBgColor: '#450A0A',
    emoji: '🚨',
  },
  appointment: {
    label: 'Appointment',
    color: '#2563EB',
    bgColor: '#EFF6FF',
    darkColor: '#60A5FA',
    darkBgColor: '#1E3A5F',
    emoji: '📅',
  },
  inquiry: {
    label: 'Inquiry',
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    darkColor: '#A78BFA',
    darkBgColor: '#2E1065',
    emoji: '💬',
  },
  other: {
    label: 'Other',
    color: '#64748B',
    bgColor: '#F1F5F9',
    darkColor: '#94A3B8',
    darkBgColor: '#1E293B',
    emoji: '📝',
  },
};

export const CATEGORY_FILTERS: Array<{ key: MessageCategory | 'all'; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'urgent', label: '🚨 Urgent' },
  { key: 'appointment', label: '📅 Appt' },
  { key: 'inquiry', label: '💬 Inquiry' },
  { key: 'other', label: '📝 Other' },
];
