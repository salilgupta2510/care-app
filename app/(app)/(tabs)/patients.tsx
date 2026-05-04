import React, { useState } from 'react';
import { View, TextInput, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { PatientCard } from '@/components/patient/PatientCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { usePatients } from '@/hooks/usePatients';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function PatientsScreen() {
  const { colors } = useColorScheme();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const { patients, loading } = usePatients(search);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: colors.card,
          paddingTop: insets.top + 16,
          paddingBottom: 16,
          paddingHorizontal: 16,
          gap: 12,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <Text style={{ fontSize: 26, fontWeight: '800', color: colors.text }}>Patients</Text>
        <View
          style={{
            backgroundColor: colors.background,
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
            gap: 8,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Ionicons name="search" size={17} color={colors.textSecondary} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search by name or phone…"
            placeholderTextColor={colors.textSecondary}
            style={{ flex: 1, paddingVertical: 10, fontSize: 15, color: colors.text }}
          />
        </View>
      </View>

      {loading ? (
        <View style={{ padding: 16, gap: 12 }}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={{ flexDirection: 'row', gap: 12 }}>
              <Skeleton width={48} height={48} borderRadius={24} />
              <View style={{ flex: 1, gap: 8 }}>
                <Skeleton width="50%" height={14} />
                <Skeleton width="70%" height={12} />
              </View>
            </View>
          ))}
        </View>
      ) : patients.length === 0 ? (
        <EmptyState
          icon="👤"
          title="No patients found"
          subtitle="Patients will appear here when they contact you through WhatsApp"
        />
      ) : (
        <FlashList
          data={patients}
          keyExtractor={(p) => p.id}
          renderItem={({ item }) => <PatientCard patient={item} />}
          estimatedItemSize={90}
          contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 16 }}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      )}
    </View>
  );
}
