import React from 'react';
import { View, TextInput, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/useColorScheme';

interface InboxHeaderProps {
  search: string;
  onSearch: (q: string) => void;
  urgentCount: number;
  totalUnread: number;
}

export function InboxHeader({ search, onSearch, urgentCount, totalUnread }: InboxHeaderProps) {
  const { colors } = useColorScheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ backgroundColor: colors.card, paddingTop: insets.top + 8, paddingBottom: 4 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingBottom: 12,
        }}
      >
        <View>
          <Text style={{ fontSize: 26, fontWeight: '800', color: colors.text }}>
            Patient Inbox
          </Text>
          {totalUnread > 0 && (
            <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 1 }}>
              {totalUnread} unread · {urgentCount > 0 ? `${urgentCount} urgent` : 'all clear'}
            </Text>
          )}
        </View>
        {urgentCount > 0 && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="alert-circle" size={18} color={colors.urgent} />
            <Text style={{ color: colors.urgent, fontWeight: '700', fontSize: 13 }}>
              {urgentCount} urgent
            </Text>
          </View>
        )}
      </View>

      <View
        style={{
          marginHorizontal: 16,
          marginBottom: 4,
          backgroundColor: colors.background,
          borderRadius: 12,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 12,
          gap: 8,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <Ionicons name="search" size={17} color={colors.textSecondary} />
        <TextInput
          value={search}
          onChangeText={onSearch}
          placeholder="Search patients..."
          placeholderTextColor={colors.textSecondary}
          style={{ flex: 1, paddingVertical: 10, fontSize: 15, color: colors.text }}
        />
        {search.length > 0 && (
          <Pressable onPress={() => onSearch('')}>
            <Ionicons name="close-circle" size={17} color={colors.textSecondary} />
          </Pressable>
        )}
      </View>
    </View>
  );
}
