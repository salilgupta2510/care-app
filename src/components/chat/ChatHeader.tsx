import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '@/components/ui/Avatar';
import { CategoryPill } from '@/components/inbox/CategoryPill';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useSubscription } from '@/hooks/useSubscription';
import type { Chat } from '@/types/firestore';

interface ChatHeaderProps {
  chat: Chat;
}

export function ChatHeader({ chat }: ChatHeaderProps) {
  const { colors } = useColorScheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { requirePro, canUseAiSummaries } = useSubscription();

  return (
    <View
      style={{
        backgroundColor: colors.card,
        paddingTop: insets.top + 8,
        paddingBottom: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <Pressable onPress={() => router.back()} hitSlop={12}>
        <Ionicons name="chevron-back" size={24} color={colors.primary} />
      </Pressable>

      <Avatar name={chat.patientName ?? 'Unknown'} size={40} />

      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>
          {chat.patientName ?? 'Unknown Patient'}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
          <View
            style={{
              width: 7,
              height: 7,
              borderRadius: 4,
              backgroundColor: chat.status === 'open' ? colors.success : colors.textSecondary,
            }}
          />
          <Text style={{ fontSize: 12, color: colors.textSecondary, textTransform: 'capitalize' }}>
            {chat.status}
          </Text>
          {chat.lastCategory && chat.lastCategory !== 'other' && (
            <CategoryPill category={chat.lastCategory} size="sm" />
          )}
        </View>
      </View>

      <Pressable
        onPress={() => {
          if (!requirePro('AI Summaries require VedaCare Pro. Upgrade to get instant clinical summaries of every patient conversation.')) return;
          router.push(`/(app)/summary/${chat.id}`);
        }}
        style={{
          backgroundColor: colors.background,
          borderRadius: 10,
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderWidth: 1,
          borderColor: colors.border,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <Ionicons
          name={canUseAiSummaries ? 'sparkles' : 'lock-closed'}
          size={13}
          color={canUseAiSummaries ? colors.accent : colors.textSecondary}
        />
        <Text style={{ fontSize: 12, fontWeight: '600', color: canUseAiSummaries ? colors.accent : colors.textSecondary }}>
          Summary
        </Text>
      </Pressable>
    </View>
  );
}
