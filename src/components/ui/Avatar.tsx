import React from 'react';
import { View, Text, type ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { getInitials } from '@/utils/format';
import { useColorScheme } from '@/hooks/useColorScheme';

interface AvatarProps {
  name: string;
  uri?: string;
  size?: number;
  style?: ViewStyle;
}

export function Avatar({ name, uri, size = 44, style }: AvatarProps) {
  const { colors } = useColorScheme();
  const initials = getInitials(name);
  const fontSize = size * 0.38;

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[{ width: size, height: size, borderRadius: size / 2 }, style] as any}
        contentFit="cover"
      />
    );
  }

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <Text
        style={{ color: '#FFFFFF', fontSize, fontWeight: '600', letterSpacing: 0.5 }}
      >
        {initials}
      </Text>
    </View>
  );
}
