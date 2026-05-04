import { Timestamp } from 'firebase/firestore';
import type { Chat, Message, Patient, Summary, FirestoreUser } from '@/types/firestore';

const now = Timestamp.now();
const hoursAgo = (h: number) =>
  Timestamp.fromMillis(Date.now() - h * 60 * 60 * 1000);

export const SEED_USERS: FirestoreUser[] = [
  {
    id: 'doctor1',
    uid: 'doctor1',
    name: 'Dr. Priya Sharma',
    role: 'doctor',
    phone: '+919999000001',
    licenseId: 'MCI-2024-001',
    avatarUrl: undefined,
    teamId: 'team1',
    createdAt: now,
  },
  {
    id: 'asst1',
    uid: 'asst1',
    name: 'Anil Kumar',
    role: 'assistant',
    phone: '+919999000002',
    teamId: 'team1',
    createdAt: now,
  },
];

export const SEED_PATIENTS: Patient[] = [
  {
    id: 'patient1',
    name: 'Ravi Menon',
    phone: '+919876543210',
    dob: '1978-03-15',
    assignedTo: 'doctor1',
    tags: ['hypertension', 'follow-up'],
    lastContactAt: hoursAgo(1),
    createdAt: hoursAgo(720),
  },
  {
    id: 'patient2',
    name: 'Sunita Patel',
    phone: '+919876543211',
    dob: '1990-07-22',
    assignedTo: 'doctor1',
    tags: ['diabetes', 'check-in'],
    lastContactAt: hoursAgo(3),
    createdAt: hoursAgo(360),
  },
  {
    id: 'patient3',
    name: 'Arjun Singh',
    phone: '+919876543212',
    dob: '1965-11-08',
    assignedTo: 'asst1',
    tags: ['cardiac', 'urgent'],
    lastContactAt: hoursAgo(0.5),
    createdAt: hoursAgo(1440),
  },
  {
    id: 'patient4',
    name: 'Meera Krishnan',
    phone: '+919876543213',
    dob: '2001-04-30',
    assignedTo: 'doctor1',
    tags: ['new-patient'],
    lastContactAt: hoursAgo(24),
    createdAt: hoursAgo(24),
  },
];

export const SEED_CHATS: Chat[] = [
  {
    id: 'chat1',
    patientId: 'patient1',
    patientName: 'Ravi Menon',
    patientPhone: '+919876543210',
    assignedTo: 'doctor1',
    status: 'open',
    lastMessage: 'Doctor, my BP reading was 145/90 this morning. Should I be concerned?',
    lastMessageAt: hoursAgo(1),
    lastCategory: 'urgent',
    unreadCount: 3,
  },
  {
    id: 'chat2',
    patientId: 'patient2',
    patientName: 'Sunita Patel',
    patientPhone: '+919876543211',
    assignedTo: 'doctor1',
    status: 'open',
    lastMessage: 'Can I schedule my follow-up appointment for next Tuesday?',
    lastMessageAt: hoursAgo(3),
    lastCategory: 'appointment',
    unreadCount: 1,
  },
  {
    id: 'chat3',
    patientId: 'patient3',
    patientName: 'Arjun Singh',
    patientPhone: '+919876543212',
    assignedTo: 'asst1',
    status: 'open',
    lastMessage: 'Experiencing chest tightness and shortness of breath.',
    lastMessageAt: hoursAgo(0.5),
    lastCategory: 'urgent',
    unreadCount: 5,
  },
  {
    id: 'chat4',
    patientId: 'patient4',
    patientName: 'Meera Krishnan',
    patientPhone: '+919876543213',
    assignedTo: 'doctor1',
    status: 'pending',
    lastMessage: 'What are the documents needed for my first appointment?',
    lastMessageAt: hoursAgo(24),
    lastCategory: 'inquiry',
    unreadCount: 0,
  },
];

export const SEED_MESSAGES: Record<string, Message[]> = {
  chat1: [
    {
      id: 'msg1a',
      waMessageId: 'wamid.1a',
      from: '+919876543210',
      type: 'text',
      content: 'Good morning Doctor. I wanted to give you my morning vitals.',
      category: 'other',
      createdAt: hoursAgo(2),
    },
    {
      id: 'msg1b',
      waMessageId: 'wamid.1b',
      from: '+919876543210',
      type: 'audio',
      content: '',
      transcription:
        'I measured my blood pressure this morning and it was 145 over 90. I also have a slight headache on the right side. Should I increase my medication dose or is this within the expected range for today?',
      category: 'urgent',
      createdAt: hoursAgo(1.5),
    },
    {
      id: 'msg1c',
      waMessageId: 'wamid.1c',
      from: '+919876543210',
      type: 'text',
      content: 'Doctor, my BP reading was 145/90 this morning. Should I be concerned?',
      category: 'urgent',
      createdAt: hoursAgo(1),
    },
  ],
  chat2: [
    {
      id: 'msg2a',
      waMessageId: 'wamid.2a',
      from: '+919876543211',
      type: 'text',
      content: 'Hello, I wanted to check if my HbA1c results are ready.',
      category: 'inquiry',
      createdAt: hoursAgo(5),
    },
    {
      id: 'msg2b',
      waMessageId: 'wamid.2b',
      from: '+919876543211',
      type: 'text',
      content: 'Can I schedule my follow-up appointment for next Tuesday?',
      category: 'appointment',
      createdAt: hoursAgo(3),
    },
  ],
  chat3: [
    {
      id: 'msg3a',
      waMessageId: 'wamid.3a',
      from: '+919876543212',
      type: 'text',
      content: 'I have been feeling dizzy since yesterday evening.',
      category: 'urgent',
      createdAt: hoursAgo(2),
    },
    {
      id: 'msg3b',
      waMessageId: 'wamid.3b',
      from: '+919876543212',
      type: 'text',
      content: 'Experiencing chest tightness and shortness of breath.',
      category: 'urgent',
      createdAt: hoursAgo(0.5),
    },
  ],
};

export const SEED_SUMMARIES: Record<string, Summary> = {
  chat1: {
    id: 'sum1',
    chatId: 'chat1',
    patientId: 'patient1',
    generatedAt: hoursAgo(0.8),
    summary:
      'Patient Ravi Menon reports a blood pressure reading of 145/90 mmHg with associated right-sided headache. Patient is concerned about whether to adjust medication. This reading is mildly elevated above target range and warrants clinical review.',
    keyPoints: [
      'BP reading: 145/90 mmHg (mildly elevated)',
      'Symptom: right-sided headache',
      'No mention of other symptoms (chest pain, vision changes)',
      'Patient on antihypertensive medication (existing)',
    ],
    nextActions: [
      'Review current medication dosage',
      'Advise patient on monitoring frequency',
      'Schedule follow-up if readings remain elevated',
    ],
    model: 'claude-sonnet-4-6',
    messageCount: 3,
  },
};
