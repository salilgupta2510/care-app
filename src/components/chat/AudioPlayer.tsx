import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import type { Message } from '@/types/firestore';

interface AudioPlayerProps {
  message: Message;
  isFromPatient: boolean;
}

export function AudioPlayer({ message, isFromPatient }: AudioPlayerProps) {
  const { colors, isDark } = useColorScheme();
  const [showTranscript, setShowTranscript] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const bubbleBg = isFromPatient
    ? isDark ? '#1E293B' : '#F1F5F9'
    : colors.primary;

  const textColor = isFromPatient ? colors.text : '#FFFFFF';
  const mutedColor = isFromPatient ? colors.textSecondary : 'rgba(255,255,255,0.7)';

  return (
    <View
      style={{
        backgroundColor: bubbleBg,
        borderRadius: 18,
        borderBottomLeftRadius: isFromPatient ? 4 : 18,
        borderBottomRightRadius: isFromPatient ? 18 : 4,
        padding: 12,
        gap: 10,
        minWidth: 200,
      }}
    >
      {/* Player Row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Pressable
          onPress={() => setIsPlaying((p) => !p)}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: isFromPatient ? colors.primary : 'rgba(255,255,255,0.2)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={16}
            color={isFromPatient ? '#FFF' : '#FFF'}
          />
        </Pressable>

        {/* Waveform visualization */}
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 2 }}>
          {[6, 10, 15, 8, 14, 10, 6, 12, 9, 14, 7, 11, 8, 13, 6].map((h, i) => (
            <View
              key={i}
              style={{
                width: 3,
                height: h,
                borderRadius: 2,
                backgroundColor: isFromPatient
                  ? colors.primary
                  : 'rgba(255,255,255,0.6)',
                opacity: isPlaying && i < 7 ? 1 : 0.5,
              }}
            />
          ))}
        </View>

        <Text style={{ fontSize: 12, color: mutedColor }}>0:42</Text>
      </View>

      {/* Transcript toggle */}
      {message.transcription && (
        <View style={{ gap: 6 }}>
          <Pressable
            onPress={() => setShowTranscript((s) => !s)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
          >
            <Ionicons
              name={showTranscript ? 'chevron-up' : 'chevron-down'}
              size={13}
              color={mutedColor}
            />
            <Text style={{ fontSize: 12, color: mutedColor, fontWeight: '600' }}>
              {showTranscript ? 'Hide transcript' : 'View transcript'}
            </Text>
          </Pressable>

          {showTranscript && (
            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: isFromPatient ? colors.border : 'rgba(255,255,255,0.2)',
                paddingTop: 8,
              }}
            >
              <Text style={{ fontSize: 13, color: textColor, lineHeight: 19, fontStyle: 'italic' }}>
                {message.transcription}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
