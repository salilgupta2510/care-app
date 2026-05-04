import React from 'react';
import { View, Text, type ViewStyle } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

interface BadgeProps {
  count: number;
  style?: ViewStyle;
}

export function Badge({ count, style }: BadgeProps) {
  if (count === 0) return null;

  return (
    <View
      className="min-w-5 h-5 rounded-full bg-urgent items-center justify-center px-1"
      style={style}
    >
      <Text className="text-white text-xs font-bold leading-none">
        {count > 99 ? '99+' : count}
      </Text>
    </View>
  );
}
