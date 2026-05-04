import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { InboxHeader } from '@/components/inbox/InboxHeader';
import { FilterChips } from '@/components/inbox/FilterChips';
import { ChatListItem } from '@/components/inbox/ChatListItem';
import { ChatListSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useChats } from '@/hooks/useChats';
import { useUIStore } from '@/stores/uiStore';
import { useColorScheme } from '@/hooks/useColorScheme';
import type { MessageCategory } from '@/types/firestore';

export default function InboxScreen() {
  const { colors } = useColorScheme();
  const insets = useSafeAreaInsets();
  const { inboxFilter, setInboxFilter, searchQuery, setSearchQuery } = useUIStore();
  const { chats, loading, urgentCount, totalUnread, categoryCounts } = useChats(
    inboxFilter,
    searchQuery
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <InboxHeader
        search={searchQuery}
        onSearch={setSearchQuery}
        urgentCount={urgentCount}
        totalUnread={totalUnread}
      />
      <FilterChips
        active={inboxFilter}
        onChange={(f) => setInboxFilter(f as MessageCategory | 'all')}
        counts={categoryCounts}
      />

      {loading ? (
        <ChatListSkeleton />
      ) : chats.length === 0 ? (
        <EmptyState
          icon="📭"
          title="No conversations"
          subtitle={
            searchQuery
              ? 'Try a different search term'
              : inboxFilter !== 'all'
              ? 'No messages in this category'
              : 'Patient messages will appear here when they WhatsApp you'
          }
        />
      ) : (
        <FlashList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => <ChatListItem chat={item} index={index} />}
          estimatedItemSize={85}
          contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        />
      )}
    </View>
  );
}
