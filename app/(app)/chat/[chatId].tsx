import React, { useState, useRef } from 'react';
import { View, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { ChatInput } from '@/components/chat/ChatInput';
import { QuickReplyBar } from '@/components/chat/QuickReplyBar';
import { SummaryCard } from '@/components/summary/SummaryCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { useChat } from '@/hooks/useChat';
import { useSummary } from '@/hooks/useSummary';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/hooks/useAuth';

export default function ChatScreen() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const { colors } = useColorScheme();
  const insets = useSafeAreaInsets();
  const { profile } = useAuth();
  const { chat, messages, loading } = useChat(chatId);
  const { summary } = useSummary(chatId);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const flatRef = useRef<FlatList>(null);

  if (!chat) return null;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <ChatHeader chat={chat} />

      {/* AI Summary strip */}
      {summary && (
        <View style={{ padding: 12, paddingBottom: 0 }}>
          <SummaryCard summary={summary} compact />
        </View>
      )}

      {loading ? (
        <View style={{ padding: 16, gap: 12 }}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={{ alignItems: i % 2 === 0 ? 'flex-end' : 'flex-start' }}>
              <Skeleton width={220} height={50} borderRadius={16} />
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          ref={flatRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={({ item, index }) => (
            <MessageBubble
              message={item}
              isFromPatient={item.from === chat.patientPhone}
              index={index}
            />
          )}
          contentContainerStyle={{ paddingVertical: 12 }}
          onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: true })}
        />
      )}

      {showQuickReplies && (
        <QuickReplyBar
          onSelect={(text) => {
            setShowQuickReplies(false);
          }}
        />
      )}

      <ChatInput
        onSend={(text) => {
          // TODO: send message via Firebase / WhatsApp API
        }}
        onQuickReply={() => setShowQuickReplies((s) => !s)}
      />

      <View style={{ height: insets.bottom }} />
    </KeyboardAvoidingView>
  );
}
