import React from 'react';
import { View, Text } from 'react-native';
import { MotiView } from 'moti';
import type { Message } from '@/types/firestore';
import { useColorScheme } from '@/hooks/useColorScheme';
import { formatMessageTime } from '@/utils/date';
import { CategoryPill } from '@/components/inbox/CategoryPill';
import { AudioPlayer } from './AudioPlayer';

interface MessageBubbleProps {
  message: Message;
  isFromPatient: boolean;
  index: number;
}

export function MessageBubble({ message, isFromPatient, index }: MessageBubbleProps) {
  const { colors, isDark } = useColorScheme();

  const bubbleBg = isFromPatient
    ? isDark ? '#1E293B' : '#F1F5F9'
    : colors.primary;
  const textColor = isFromPatient ? colors.text : '#FFFFFF';
  const align = isFromPatient ? 'flex-start' : 'flex-end';

  return (
    <MotiView
      from={{ opacity: 0, translateY: 12 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 250, delay: Math.min(index * 40, 300) }}
      style={{ alignItems: align, paddingHorizontal: 16, marginBottom: 6 }}
    >
      <View style={{ maxWidth: '80%', gap: 4 }}>
        {message.type === 'audio' ? (
          <AudioPlayer message={message} isFromPatient={isFromPatient} />
        ) : (
          <View
            style={{
              backgroundColor: bubbleBg,
              borderRadius: 18,
              borderBottomLeftRadius: isFromPatient ? 4 : 18,
              borderBottomRightRadius: isFromPatient ? 18 : 4,
              paddingHorizontal: 14,
              paddingVertical: 10,
            }}
          >
            <Text style={{ color: textColor, fontSize: 15, lineHeight: 21 }}>
              {message.content}
            </Text>
          </View>
        )}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            paddingHorizontal: 4,
            justifyContent: isFromPatient ? 'flex-start' : 'flex-end',
          }}
        >
          <Text style={{ fontSize: 11, color: colors.textSecondary }}>
            {formatMessageTime(message.createdAt)}
          </Text>
          {isFromPatient && message.category !== 'other' && (
            <CategoryPill category={message.category} size="sm" />
          )}
        </View>
      </View>
    </MotiView>
  );
}
