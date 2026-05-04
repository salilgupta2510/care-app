import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { usePatient } from '@/hooks/usePatients';
import { useColorScheme } from '@/hooks/useColorScheme';
import { formatPhone } from '@/utils/format';
import { formatRelative } from '@/utils/date';

export default function PatientDetailScreen() {
  const { patientId } = useLocalSearchParams<{ patientId: string }>();
  const { colors } = useColorScheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { patient, loading } = usePatient(patientId);

  if (!patient) return null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Hero */}
      <LinearGradient
        colors={[colors.primary, `${colors.primary}CC`]}
        style={{ paddingTop: insets.top + 8, paddingBottom: 24, paddingHorizontal: 16 }}
      >
        <Pressable onPress={() => router.back()} style={{ marginBottom: 16 }} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </Pressable>

        <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
          <Avatar name={patient.name} size={68} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 22, fontWeight: '800', color: '#FFF' }}>{patient.name}</Text>
            <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 3 }}>
              {formatPhone(patient.phone)}
            </Text>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
              Last contact {formatRelative(patient.lastContactAt)}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: insets.bottom + 16 }}>
        {/* Tags */}
        <Card>
          <Text style={{ fontSize: 12, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>
            Conditions & Tags
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {patient.tags.map((tag) => (
              <View
                key={tag}
                style={{
                  backgroundColor: `${colors.primary}15`,
                  borderRadius: 99,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderWidth: 1,
                  borderColor: `${colors.primary}30`,
                }}
              >
                <Text style={{ fontSize: 13, color: colors.primary, fontWeight: '600' }}>{tag}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Details */}
        <Card style={{ gap: 14 }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8 }}>
            Patient Info
          </Text>
          {[
            { label: 'Date of Birth', value: patient.dob ?? 'Not recorded' },
            { label: 'Phone', value: formatPhone(patient.phone) },
          ].map(({ label, value }) => (
            <View key={label} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14, color: colors.textSecondary }}>{label}</Text>
              <Text style={{ fontSize: 14, color: colors.text, fontWeight: '500' }}>{value}</Text>
            </View>
          ))}
        </Card>

        <Button
          label="View Conversations"
          icon={<Ionicons name="chatbubbles" size={16} color="#FFF" />}
          onPress={() => router.push('/(app)/(tabs)/inbox')}
          size="lg"
          style={{ borderRadius: 14 }}
        />
      </ScrollView>
    </View>
  );
}
