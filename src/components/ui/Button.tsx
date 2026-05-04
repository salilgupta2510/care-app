import React from 'react';
import {
  Text,
  ActivityIndicator,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { PressableScale } from './PressableScale';
import { useColorScheme } from '@/hooks/useColorScheme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const SIZE = {
  sm: { paddingHorizontal: 12, paddingVertical: 8, fontSize: 13, borderRadius: 8 },
  md: { paddingHorizontal: 16, paddingVertical: 11, fontSize: 15, borderRadius: 10 },
  lg: { paddingHorizontal: 20, paddingVertical: 14, fontSize: 17, borderRadius: 12 },
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}: ButtonProps) {
  const { colors } = useColorScheme();

  const bg =
    variant === 'primary'
      ? colors.primary
      : variant === 'destructive'
      ? colors.urgent
      : variant === 'secondary'
      ? colors.card
      : 'transparent';

  const textColor =
    variant === 'primary' || variant === 'destructive'
      ? '#FFFFFF'
      : colors.primary;

  const s = SIZE[size];

  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        {
          backgroundColor: disabled ? colors.border : bg,
          borderRadius: s.borderRadius,
          paddingHorizontal: s.paddingHorizontal,
          paddingVertical: s.paddingVertical,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          ...(variant === 'secondary'
            ? { borderWidth: 1.5, borderColor: colors.primary }
            : {}),
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <>
          {icon}
          <Text
            style={[
              {
                color: disabled ? colors.textSecondary : textColor,
                fontSize: s.fontSize,
                fontWeight: '600',
              },
              textStyle,
            ]}
          >
            {label}
          </Text>
        </>
      )}
    </PressableScale>
  );
}
