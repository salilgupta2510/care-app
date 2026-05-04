import React, { useEffect } from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { CATEGORY_FILTERS } from '@/constants/categories';
import type { MessageCategory } from '@/types/firestore';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as Haptics from 'expo-haptics';

type FilterKey = MessageCategory | 'all';

const ACTIVE_COLORS: Record<FilterKey, string | undefined> = {
  all: undefined, // uses primary
  urgent: '#DC2626',
  appointment: '#2563EB',
  inquiry: '#7C3AED',
  other: '#64748B',
};

interface FilterChipsProps {
  active: FilterKey;
  onChange: (filter: FilterKey) => void;
  counts?: Record<string, number>;
}

const TAB_WIDTH = Dimensions.get('window').width / CATEGORY_FILTERS.length;

export function FilterChips({ active, onChange, counts }: FilterChipsProps) {
  const { colors } = useColorScheme();
  const activeIndex = CATEGORY_FILTERS.findIndex((f) => f.key === active);
  const indicatorX = useSharedValue(activeIndex * TAB_WIDTH);

  useEffect(() => {
    indicatorX.value = withTiming(activeIndex * TAB_WIDTH, { duration: 220 });
  }, [activeIndex]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  const activeColor = ACTIVE_COLORS[active] ?? colors.primary;

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <View style={{ flexDirection: 'row' }}>
        {CATEGORY_FILTERS.map(({ key, label }) => {
          const isActive = active === key;
          const count = counts?.[key];
          const tabColor = isActive ? (ACTIVE_COLORS[key] ?? colors.primary) : colors.textSecondary;

          return (
            <Pressable
              key={key}
              onPress={() => {
                Haptics.selectionAsync();
                onChange(key);
              }}
              style={{
                flex: 1,
                alignItems: 'center',
                paddingVertical: 10,
                paddingHorizontal: 2,
                gap: 2,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: isActive ? '700' : '500',
                    color: tabColor,
                  }}
                  numberOfLines={1}
                >
                  {label}
                </Text>
                {(count ?? 0) > 0 && (
                  <View
                    style={{
                      backgroundColor: isActive ? tabColor : colors.border,
                      borderRadius: 8,
                      minWidth: 16,
                      height: 16,
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingHorizontal: 4,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 9,
                        fontWeight: '800',
                        color: isActive ? '#FFF' : colors.textSecondary,
                      }}
                    >
                      {count! > 99 ? '99+' : count}
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Animated underline indicator */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: TAB_WIDTH,
            height: 2.5,
            borderRadius: 2,
            backgroundColor: activeColor,
          },
          indicatorStyle,
        ]}
      />
    </View>
  );
}
