import type { QuickReplyTemplate } from '@/types/firestore';

export const QUICK_REPLIES: QuickReplyTemplate[] = [
  {
    id: 'qr1',
    label: 'Appointment Confirmed',
    text: 'Your appointment has been confirmed. Please arrive 10 minutes early.',
    category: 'appointment',
  },
  {
    id: 'qr2',
    label: 'Reschedule',
    text: 'We need to reschedule your appointment. Please let us know your availability.',
    category: 'appointment',
  },
  {
    id: 'qr3',
    label: 'Prescription Ready',
    text: 'Your prescription is ready for pickup at the pharmacy.',
    category: 'inquiry',
  },
  {
    id: 'qr4',
    label: 'Call Back',
    text: 'A member of our team will call you back shortly to discuss your concern.',
    category: 'urgent',
  },
  {
    id: 'qr5',
    label: 'Lab Results',
    text: 'Your lab results are in. The doctor will review them and reach out to you.',
    category: 'inquiry',
  },
  {
    id: 'qr6',
    label: 'Emergency',
    text: 'If this is a medical emergency, please call 911 immediately.',
    category: 'urgent',
  },
];
