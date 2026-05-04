import React from 'react';
import { View, Text } from 'react-native';
import type { MessageCategory } from '@/types/firestore';
import { CATEGORY_CONFIG } from '@/constants/categories';
import { useColorScheme } from '@/hooks/useColorScheme';

interface CategoryPillProps {
  category: MessageCategory;
  size?: 'sm' | 'md';
}

export function CategoryPill({ category, size = 'sm' }: CategoryPillProps) {
  const { isDark } = useColorScheme();
  const config = CATEGORY_CONFIG[category];
  const isSm = size === 'sm';

  return (
    <View
      style={{
        backgroundColor: isDark ? config.darkBgColor : config.bgColor,
        borderRadius: 99,
        paddingHorizontal: isSm ? 7 : 10,
        paddingVertical: isSm ? 2 : 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        alignSelf: 'flex-start',
      }}
    >
      <Text style={{ fontSize: isSm ? 9 : 11 }}>{config.emoji}</Text>
      <Text
        style={{
          fontSize: isSm ? 10 : 12,
          fontWeight: '700',
          color: isDark ? config.darkColor : config.color,
          letterSpacing: 0.3,
          textTransform: 'uppercase',
        }}
      >
        {config.label}
      </Text>
    </View>
  );
}
