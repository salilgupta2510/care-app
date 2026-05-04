import React from 'react';
import { View, type ViewProps } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Shadow } from '@/constants/theme';

interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'outlined';
}

export function Card({ children, style, variant = 'default', ...props }: CardProps) {
  const { colors } = useColorScheme();

  const variantStyle =
    variant === 'elevated'
      ? Shadow.md
      : variant === 'outlined'
      ? { borderWidth: 1, borderColor: colors.border }
      : Shadow.sm;

  return (
    <View
      style={[
        {
          backgroundColor: colors.card,
          borderRadius: 14,
          padding: 16,
          ...variantStyle,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
