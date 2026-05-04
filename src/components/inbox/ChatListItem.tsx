import React, { useRef } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { CategoryPill } from './CategoryPill';
import { useColorScheme } from '@/hooks/useColorScheme';
import type { Chat } from '@/types/firestore';
import { formatChatTime } from '@/utils/date';
import * as Haptics from 'expo-haptics';

const SWIPE_THRESHOLD = -80;
const ACTION_WIDTH = 220;

interface ChatListItemProps {
  chat: Chat;
  index: number;
}

export function ChatListItem({ chat, index }: ChatListItemProps) {
  const { colors } = useColorScheme();
  const router = useRouter();
  const translateX = useSharedValue(0);
  const isOpen = useSharedValue(false);

  const pan = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((e) => {
      if (e.translationX < 0) {
        translateX.value = Math.max(e.translationX, -ACTION_WIDTH);
      } else if (isOpen.value) {
        translateX.value = Math.min(0, -ACTION_WIDTH + e.translationX);
      }
    })
    .onEnd((e) => {
      if (e.translationX < SWIPE_THRESHOLD) {
        translateX.value = withSpring(-ACTION_WIDTH, { damping: 20 });
        isOpen.value = true;
        runOnJS(Haptics.selectionAsync)();
      } else {
        translateX.value = withSpring(0, { damping: 20 });
        isOpen.value = false;
      }
    });

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const closeSwipe = () => {
    translateX.value = withSpring(0, { damping: 20 });
    isOpen.value = false;
  };

  return (
    <View style={{ overflow: 'hidden' }}>
      {/* Action buttons revealed by swipe */}
      <View
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: ACTION_WIDTH,
          flexDirection: 'row',
        }}
      >
        <Pressable
          onPress={() => { closeSwipe(); Alert.alert('Assign', 'Assign chat feature coming soon'); }}
          style={{ flex: 1, backgroundColor: colors.appointment, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>ASSIGN</Text>
        </Pressable>
        <Pressable
          onPress={() => { closeSwipe(); Alert.alert('Urgent', 'Marked as urgent'); }}
          style={{ flex: 1, backgroundColor: colors.urgent, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>URGENT</Text>
        </Pressable>
        <Pressable
          onPress={() => { closeSwipe(); Alert.alert('Archive', 'Archive feature coming soon'); }}
          style={{ flex: 1, backgroundColor: colors.textSecondary, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>ARCHIVE</Text>
        </Pressable>
      </View>

      <GestureDetector gesture={pan}>
        <Animated.View style={rowStyle}>
          <Pressable
            onPress={() => router.push(`/(app)/chat/${chat.id}`)}
            style={{
              backgroundColor: colors.card,
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 16,
              paddingVertical: 12,
              gap: 12,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}
          >
            <View style={{ position: 'relative' }}>
              <Avatar name={chat.patientName ?? 'Unknown'} size={50} />
              {chat.status === 'open' && chat.unreadCount > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: 14,
                    height: 14,
                    borderRadius: 7,
                    backgroundColor: colors.accent,
                    borderWidth: 2,
                    borderColor: colors.card,
                  }}
                />
              )}
            </View>

            <View style={{ flex: 1, gap: 3 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: chat.unreadCount > 0 ? '700' : '500',
                    color: colors.text,
                    flex: 1,
                  }}
                  numberOfLines={1}
                >
                  {chat.patientName ?? 'Unknown Patient'}
                </Text>
                <Text style={{ fontSize: 12, color: colors.textSecondary, marginLeft: 8 }}>
                  {formatChatTime(chat.lastMessageAt)}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <Text
                  style={{
                    fontSize: 13,
                    color: chat.unreadCount > 0 ? colors.text : colors.textSecondary,
                    fontWeight: chat.unreadCount > 0 ? '500' : '400',
                    flex: 1,
                  }}
                  numberOfLines={1}
                >
                  {chat.lastMessage ?? '…'}
                </Text>
                {chat.unreadCount > 0 && <Badge count={chat.unreadCount} />}
              </View>

              {chat.lastCategory && chat.lastCategory !== 'other' && (
                <CategoryPill category={chat.lastCategory} size="sm" />
              )}
            </View>
          </Pressable>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
