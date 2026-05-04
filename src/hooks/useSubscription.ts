import { useSubscriptionStore, PLAN_LIMITS } from '@/stores/subscriptionStore';

export function useSubscription() {
  const { plan, expiresAt, paywallVisible, paywallReason, showPaywall, hidePaywall, setPlan } =
    useSubscriptionStore();

  const limits = PLAN_LIMITS[plan];
  const isActive = plan === 'free' || !expiresAt || expiresAt > new Date();

  const canUseAiSummaries = isActive && limits.aiSummaries;
  const canAddTeamMembers = isActive && limits.teamMembers > 1;
  const maxActiveChats = isActive ? limits.maxActiveChats : PLAN_LIMITS.free.maxActiveChats;

  const requirePro = (reason: string) => {
    if (!canUseAiSummaries) {
      showPaywall(reason);
      return false;
    }
    return true;
  };

  const requirePractice = (reason: string) => {
    if (!canAddTeamMembers) {
      showPaywall(reason);
      return false;
    }
    return true;
  };

  return {
    plan,
    limits,
    canUseAiSummaries,
    canAddTeamMembers,
    maxActiveChats,
    paywallVisible,
    paywallReason,
    showPaywall,
    hidePaywall,
    setPlan,
    requirePro,
    requirePractice,
  };
}
