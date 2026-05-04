import { Timestamp } from 'firebase/firestore';
import {
  format,
  formatDistanceToNowStrict,
  isToday,
  isYesterday,
  isThisWeek,
} from 'date-fns';

export function toDate(ts: Timestamp | Date | undefined): Date {
  if (!ts) return new Date();
  if (ts instanceof Date) return ts;
  return ts.toDate();
}

export function formatChatTime(ts: Timestamp | Date | undefined): string {
  const date = toDate(ts);
  if (isToday(date)) return format(date, 'h:mm a');
  if (isYesterday(date)) return 'Yesterday';
  if (isThisWeek(date)) return format(date, 'EEE');
  return format(date, 'dd MMM');
}

export function formatMessageTime(ts: Timestamp | Date | undefined): string {
  return format(toDate(ts), 'h:mm a');
}

export function formatRelative(ts: Timestamp | Date | undefined): string {
  return formatDistanceToNowStrict(toDate(ts), { addSuffix: true });
}

export function formatFullDate(ts: Timestamp | Date | undefined): string {
  return format(toDate(ts), 'dd MMMM yyyy, h:mm a');
}
