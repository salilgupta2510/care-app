import React from 'react';
import { Pressable, type PressableProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PressableScaleProps extends PressableProps {
  scale?: number;
  haptic?: boolean;
}

export function PressableScale({
  children,
  scale = 0.97,
  haptic = true,
  onPress,
  style,
  ...props
}: PressableScaleProps) {
  const scaleValue = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  return (
    <AnimatedPressable
      style={[animatedStyle, style]}
      onPressIn={() => {
        scaleValue.value = withSpring(scale, { damping: 15, stiffness: 400 });
        if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }}
      onPressOut={() => {
        scaleValue.value = withSpring(1, { damping: 15, stiffness: 400 });
      }}
      onPress={onPress}
      {...props}
    >
      {children}
    </AnimatedPressable>
  );
}
