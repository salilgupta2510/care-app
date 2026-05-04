import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Avatar } from '@/components/ui/Avatar';
import { PressableScale } from '@/components/ui/PressableScale';
import { useColorScheme } from '@/hooks/useColorScheme';
import type { Patient } from '@/types/firestore';
import { formatPhone } from '@/utils/format';
import { formatRelative } from '@/utils/date';

interface PatientCardProps {
  patient: Patient;
}

export function PatientCard({ patient }: PatientCardProps) {
  const { colors } = useColorScheme();
  const router = useRouter();

  return (
    <PressableScale
      onPress={() => router.push(`/(app)/patient/${patient.id}`)}
      style={{
        backgroundColor: colors.card,
        borderRadius: 14,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <Avatar name={patient.name} size={48} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text }}>{patient.name}</Text>
        <Text style={{ fontSize: 12, color: colors.textSecondary }}>{formatPhone(patient.phone)}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
          {patient.tags.slice(0, 3).map((tag) => (
            <View
              key={tag}
              style={{
                backgroundColor: colors.background,
                borderRadius: 99,
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Text style={{ fontSize: 11, color: colors.textSecondary }}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
      <Text style={{ fontSize: 11, color: colors.textSecondary }}>
        {formatRelative(patient.lastContactAt)}
      </Text>
    </PressableScale>
  );
}
