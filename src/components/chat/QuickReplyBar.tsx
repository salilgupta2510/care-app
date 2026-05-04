import React from 'react';
import { ScrollView, Pressable, Text, View } from 'react-native';
import { QUICK_REPLIES } from '@/constants/quickReplies';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as Haptics from 'expo-haptics';

interface QuickReplyBarProps {
  onSelect: (text: string) => void;
}

export function QuickReplyBar({ onSelect }: QuickReplyBarProps) {
  const { colors } = useColorScheme();

  return (
    <View
      style={{
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingVertical: 10,
        backgroundColor: colors.card,
      }}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      >
        {QUICK_REPLIES.map((reply) => (
          <Pressable
            key={reply.id}
            onPress={() => {
              Haptics.selectionAsync();
              onSelect(reply.text);
            }}
            style={{
              backgroundColor: colors.background,
              borderRadius: 20,
              paddingHorizontal: 14,
              paddingVertical: 7,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text style={{ fontSize: 13, color: colors.primary, fontWeight: '500' }}>
              {reply.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
