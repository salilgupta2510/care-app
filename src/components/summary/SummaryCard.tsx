import React from 'react';
import { View, Text } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { useColorScheme } from '@/hooks/useColorScheme';
import type { Summary } from '@/types/firestore';
import { formatRelative } from '@/utils/date';

interface SummaryCardProps {
  summary: Summary;
  compact?: boolean;
}

export function SummaryCard({ summary, compact = false }: SummaryCardProps) {
  const { colors } = useColorScheme();

  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 350 }}
    >
      <Card variant="elevated" style={{ gap: 12 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              backgroundColor: `${colors.accent}20`,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="sparkles" size={16} color={colors.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text }}>
              AI Summary
            </Text>
            <Text style={{ fontSize: 11, color: colors.textSecondary }}>
              {formatRelative(summary.generatedAt)} · {summary.messageCount} messages
            </Text>
          </View>
        </View>

        {/* Summary text */}
        <Text
          style={{ fontSize: 14, color: colors.text, lineHeight: 20 }}
          numberOfLines={compact ? 3 : undefined}
        >
          {summary.summary}
        </Text>

        {!compact && (
          <>
            <KeyPointsList points={summary.keyPoints} colors={colors} />
            <NextActionsList actions={summary.nextActions} colors={colors} />
          </>
        )}
      </Card>
    </MotiView>
  );
}

function KeyPointsList({ points, colors }: { points: string[]; colors: any }) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ fontSize: 12, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8 }}>
        Key Points
      </Text>
      {points.map((point, i) => (
        <View key={i} style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
          <View
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: colors.accent,
              marginTop: 6,
              flexShrink: 0,
            }}
          />
          <Text style={{ flex: 1, fontSize: 13, color: colors.text, lineHeight: 19 }}>{point}</Text>
        </View>
      ))}
    </View>
  );
}

function NextActionsList({ actions, colors }: { actions: string[]; colors: any }) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ fontSize: 12, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8 }}>
        Next Actions
      </Text>
      {actions.map((action, i) => (
        <View key={i} style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
          <View
            style={{
              width: 18,
              height: 18,
              borderRadius: 5,
              borderWidth: 1.5,
              borderColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 1,
              flexShrink: 0,
            }}
          >
            <Text style={{ fontSize: 10, color: colors.primary, fontWeight: '700' }}>{i + 1}</Text>
          </View>
          <Text style={{ flex: 1, fontSize: 13, color: colors.text, lineHeight: 19 }}>{action}</Text>
        </View>
      ))}
    </View>
  );
}
