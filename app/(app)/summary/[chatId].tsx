import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useSummary } from '@/hooks/useSummary';
import { useColorScheme } from '@/hooks/useColorScheme';
import { formatFullDate } from '@/utils/date';

export default function SummaryScreen() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const { colors } = useColorScheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { summary, loading } = useSummary(chatId);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: colors.card,
          paddingTop: insets.top + 8,
          paddingBottom: 16,
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
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>
            AI Summary
          </Text>
          {summary && (
            <Text style={{ fontSize: 12, color: colors.textSecondary }}>
              {formatFullDate(summary.generatedAt)}
            </Text>
          )}
        </View>
        <View style={{ backgroundColor: `${colors.accent}20`, borderRadius: 8, padding: 6 }}>
          <Ionicons name="sparkles" size={18} color={colors.accent} />
        </View>
      </View>

      {loading ? (
        <View style={{ padding: 16, gap: 12 }}>
          <Skeleton height={80} />
          <Skeleton height={14} />
          <Skeleton width="80%" height={14} />
          <Skeleton height={14} />
        </View>
      ) : !summary ? (
        <EmptyState
          icon="✨"
          title="No summary yet"
          subtitle="A summary will be generated after the patient sends a few messages"
        />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: insets.bottom + 16 }}>
          {/* Overview */}
          <MotiView
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 350 }}
          >
            <Card variant="elevated" style={{ gap: 10 }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                Summary
              </Text>
              <Text style={{ fontSize: 15, color: colors.text, lineHeight: 22 }}>{summary.summary}</Text>
              <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                Based on {summary.messageCount} messages · {summary.model}
              </Text>
            </Card>
          </MotiView>

          {/* Key Points */}
          <MotiView
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 350, delay: 80 }}
          >
            <Card style={{ gap: 10 }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                Key Clinical Points
              </Text>
              {summary.keyPoints.map((point, i) => (
                <View key={i} style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
                  <View
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 11,
                      backgroundColor: `${colors.accent}20`,
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    <Ionicons name="checkmark" size={12} color={colors.accent} />
                  </View>
                  <Text style={{ flex: 1, fontSize: 14, color: colors.text, lineHeight: 20 }}>{point}</Text>
                </View>
              ))}
            </Card>
          </MotiView>

          {/* Next Actions */}
          <MotiView
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 350, delay: 160 }}
          >
            <Card style={{ gap: 10 }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                Recommended Actions
              </Text>
              {summary.nextActions.map((action, i) => (
                <View key={i} style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
                  <View
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 6,
                      borderWidth: 2,
                      borderColor: colors.primary,
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    <Text style={{ fontSize: 10, fontWeight: '800', color: colors.primary }}>{i + 1}</Text>
                  </View>
                  <Text style={{ flex: 1, fontSize: 14, color: colors.text, lineHeight: 20 }}>{action}</Text>
                </View>
              ))}
            </Card>
          </MotiView>
        </ScrollView>
      )}
    </View>
  );
}
