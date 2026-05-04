import {
  collection,
  doc,
  query,
  where,
  orderBy,
  limit,
  FirestoreDataConverter,
  DocumentData,
  QueryDocumentSnapshot,
  WithFieldValue,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Chat, Message, Patient, Summary, FirestoreUser } from '@/types/firestore';

function makeConverter<T extends { id: string }>(): FirestoreDataConverter<T> {
  return {
    toFirestore(data: WithFieldValue<T>): DocumentData {
      const { id: _id, ...rest } = data as Record<string, unknown>;
      return rest as DocumentData;
    },
    fromFirestore(snap: QueryDocumentSnapshot): T {
      return { id: snap.id, ...snap.data() } as T;
    },
  };
}

export const userConverter = makeConverter<FirestoreUser>();
export const patientConverter = makeConverter<Patient>();
export const chatConverter = makeConverter<Chat>();
export const messageConverter = makeConverter<Message>();
export const summaryConverter = makeConverter<Summary>();

// Collection refs
export const usersCol = () => collection(db, 'users').withConverter(userConverter);
export const patientsCol = () => collection(db, 'patients').withConverter(patientConverter);
export const chatsCol = () => collection(db, 'chats').withConverter(chatConverter);
export const messagesCol = (chatId: string) =>
  collection(db, 'chats', chatId, 'messages').withConverter(messageConverter);
export const summariesCol = () => collection(db, 'summaries').withConverter(summaryConverter);

// Common queries
export const openChatsQuery = (assignedTo: string) =>
  query(chatsCol(), where('assignedTo', '==', assignedTo), orderBy('lastMessageAt', 'desc'));

export const allOpenChatsQuery = () =>
  query(chatsCol(), where('status', '==', 'open'), orderBy('lastMessageAt', 'desc'));

export const chatMessagesQuery = (chatId: string) =>
  query(messagesCol(chatId), orderBy('createdAt', 'asc'));

export const latestSummaryQuery = (chatId: string) =>
  query(summariesCol(), where('chatId', '==', chatId), orderBy('generatedAt', 'desc'), limit(1));
