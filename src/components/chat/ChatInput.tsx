import React, { useState } from 'react';
import { View, TextInput, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as Haptics from 'expo-haptics';

interface ChatInputProps {
  onSend: (text: string) => void;
  onQuickReply: () => void;
}

export function ChatInput({ onSend, onQuickReply }: ChatInputProps) {
  const { colors } = useColorScheme();
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSend(text.trim());
    setText('');
  };

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 12,
        paddingVertical: 10,
        gap: 8,
      }}
    >
      <Pressable onPress={onQuickReply} style={{ padding: 6 }}>
        <Ionicons name="flash" size={22} color={colors.accent} />
      </Pressable>

      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Type a message…"
        placeholderTextColor={colors.textSecondary}
        multiline
        style={{
          flex: 1,
          minHeight: 38,
          maxHeight: 120,
          backgroundColor: colors.background,
          borderRadius: 20,
          paddingHorizontal: 14,
          paddingVertical: 9,
          fontSize: 15,
          color: colors.text,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      />

      <Pressable
        onPress={handleSend}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: text.trim() ? colors.primary : colors.border,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name="send" size={17} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}
