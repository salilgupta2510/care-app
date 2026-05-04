import { Timestamp } from 'firebase/firestore';

export type UserRole = 'doctor' | 'assistant';

export interface FirestoreUser {
  id: string;
  uid: string;
  name: string;
  role: UserRole;
  phone: string;
  licenseId?: string;
  avatarUrl?: string;
  teamId?: string;
  createdAt: Timestamp;
}

export interface Patient {
  id: string;
  name: string;
  phone: string; // E.164
  dob?: string;
  assignedTo: string; // userId
  tags: string[];
  notes?: string;
  lastContactAt: Timestamp;
  createdAt: Timestamp;
}

export type ChatStatus = 'open' | 'resolved' | 'pending';
export type MessageCategory = 'urgent' | 'appointment' | 'inquiry' | 'other';
export type MessageType = 'text' | 'audio' | 'image' | 'document';

export interface Chat {
  id: string;
  patientId: string;
  patientName?: string; // denormalized
  patientPhone?: string; // denormalized
  assignedTo: string; // userId
  status: ChatStatus;
  lastMessage?: string;
  lastMessageAt: Timestamp;
  lastCategory?: MessageCategory;
  unreadCount: number;
  teamId?: string;
}

export interface Message {
  id: string;
  waMessageId: string;
  from: string; // phone number
  type: MessageType;
  content: string;
  transcription?: string;
  category: MessageCategory;
  storageRef?: string; // for audio/image/document
  createdAt: Timestamp;
}

export interface Summary {
  id: string;
  chatId: string;
  patientId: string;
  generatedAt: Timestamp;
  summary: string;
  keyPoints: string[];
  nextActions: string[];
  model: string;
  messageCount: number;
}

export interface AuditLog {
  id: string;
  actorId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  timestamp: Timestamp;
  metadata?: Record<string, unknown>;
}

export interface QuickReplyTemplate {
  id: string;
  label: string;
  text: string;
  category: MessageCategory;
}
