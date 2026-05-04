import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    emoji: '💬',
    title: 'Unified Patient Inbox',
    subtitle: 'All your patient WhatsApp messages in one secure, organized place — separate from personal chats.',
    accent: '#0F4C81',
  },
  {
    id: '2',
    emoji: '✨',
    title: 'AI-Powered Summaries',
    subtitle: 'Every conversation is automatically summarized so you get the clinical picture at a glance.',
    accent: '#00A8A8',
  },
  {
    id: '3',
    emoji: '🏥',
    title: 'HIPAA Compliant',
    subtitle: 'End-to-end encrypted. Role-based access. Built for modern healthcare teams.',
    accent: '#7C3AED',
  },
];

export default function OnboardingScreen() {
  const { colors, isDark } = useColorScheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const flatRef = useRef<FlatList>(null);
  const [current, setCurrent] = useState(0);

  const next = () => {
    Haptics.selectionAsync();
    if (current < SLIDES.length - 1) {
      flatRef.current?.scrollToIndex({ index: current + 1, animated: true });
    } else {
      router.replace('/(auth)/login');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        ref={flatRef}
        data={SLIDES}
        keyExtractor={(s) => s.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        onMomentumScrollEnd={(e) => {
          setCurrent(Math.round(e.nativeEvent.contentOffset.x / width));
        }}
        renderItem={({ item }) => (
          <View style={{ width, flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 24 }}>
            <LinearGradient
              colors={[`${item.accent}20`, `${item.accent}05`]}
              style={{
                width: 130,
                height: 130,
                borderRadius: 40,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 60 }}>{item.emoji}</Text>
            </LinearGradient>

            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 400 }}
              style={{ alignItems: 'center', gap: 12 }}
            >
              <Text
                style={{
                  fontSize: 26,
                  fontWeight: '800',
                  color: colors.text,
                  textAlign: 'center',
                  letterSpacing: -0.5,
                }}
              >
                {item.title}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: colors.textSecondary,
                  textAlign: 'center',
                  lineHeight: 24,
                }}
              >
                {item.subtitle}
              </Text>
            </MotiView>
          </View>
        )}
      />

      {/* Dots */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={{
              width: i === current ? 22 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: i === current ? colors.primary : colors.border,
            }}
          />
        ))}
      </View>

      {/* CTA */}
      <View style={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 24, gap: 12 }}>
        <Button
          label={current === SLIDES.length - 1 ? 'Get Started' : 'Continue'}
          onPress={next}
          size="lg"
          style={{ borderRadius: 14 }}
        />
        {current < SLIDES.length - 1 && (
          <Pressable
            onPress={() => router.replace('/(auth)/login')}
            style={{ alignItems: 'center', padding: 8 }}
          >
            <Text style={{ color: colors.textSecondary, fontSize: 14 }}>Skip</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
