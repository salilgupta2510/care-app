import { create } from 'zustand';

export type Plan = 'free' | 'pro' | 'practice';

export const PLAN_LIMITS = {
  free: { maxActiveChats: 3, aiSummaries: false, teamMembers: 1 },
  pro: { maxActiveChats: Infinity, aiSummaries: true, teamMembers: 1 },
  practice: { maxActiveChats: Infinity, aiSummaries: true, teamMembers: 5 },
} as const;

export const PLANS = [
  {
    key: 'free' as Plan,
    name: 'Free',
    price: 0,
    priceLabel: 'Free forever',
    description: 'Get started with basic patient messaging',
    color: '#64748B',
    features: [
      { label: '3 active patient chats', included: true },
      { label: 'Message categorization', included: true },
      { label: 'Quick replies', included: false },
      { label: 'AI summaries', included: false },
      { label: 'Team members', included: false },
      { label: 'Priority support', included: false },
    ],
  },
  {
    key: 'pro' as Plan,
    name: 'Pro',
    price: 999,
    priceLabel: '₹999 / month',
    description: 'For individual doctors who need full power',
    color: '#0F4C81',
    badge: 'Most Popular',
    features: [
      { label: 'Unlimited patient chats', included: true },
      { label: 'Message categorization', included: true },
      { label: 'Quick replies', included: true },
      { label: 'AI summaries (Claude)', included: true },
      { label: '1 doctor account', included: true },
      { label: 'Email support', included: true },
    ],
  },
  {
    key: 'practice' as Plan,
    name: 'Practice',
    price: 2999,
    priceLabel: '₹2,999 / month',
    description: 'For clinics and multi-doctor practices',
    color: '#7C3AED',
    features: [
      { label: 'Everything in Pro', included: true },
      { label: 'Up to 5 team members', included: true },
      { label: 'Chat assignment & handoff', included: true },
      { label: 'Analytics dashboard', included: true },
      { label: 'WhatsApp API included', included: true },
      { label: 'Priority + phone support', included: true },
    ],
  },
] as const;

interface SubscriptionState {
  plan: Plan;
  expiresAt: Date | null;
  paywallVisible: boolean;
  paywallReason: string | null;
  setPlan: (plan: Plan, expiresAt?: Date) => void;
  showPaywall: (reason?: string) => void;
  hidePaywall: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  plan: 'free',
  expiresAt: null,
  paywallVisible: false,
  paywallReason: null,
  setPlan: (plan, expiresAt) => set({ plan, expiresAt: expiresAt ?? null }),
  showPaywall: (reason) => set({ paywallVisible: true, paywallReason: reason ?? null }),
  hidePaywall: () => set({ paywallVisible: false, paywallReason: null }),
}));
