import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useSubscription } from '@/hooks/useSubscription';
import { SEED_USERS } from '@/utils/seed';

export default function TeamScreen() {
  const { colors } = useColorScheme();
  const insets = useSafeAreaInsets();
  const { requirePractice, canAddTeamMembers } = useSubscription();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={{
          backgroundColor: colors.card,
          paddingTop: insets.top + 16,
          paddingBottom: 16,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <Text style={{ fontSize: 26, fontWeight: '800', color: colors.text }}>Team</Text>
        <Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: 4 }}>
          Manage team members and chat assignments
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 16, gap: 12 }}>
        {SEED_USERS.map((user, i) => (
          <MotiView
            key={user.uid}
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 300, delay: i * 80 }}
          >
            <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <Avatar name={user.name} size={52} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text }}>{user.name}</Text>
                <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2, textTransform: 'capitalize' }}>
                  {user.role}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: user.role === 'doctor' ? `${colors.primary}15` : `${colors.accent}15`,
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderWidth: 1,
                  borderColor: user.role === 'doctor' ? `${colors.primary}40` : `${colors.accent}40`,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '700',
                    color: user.role === 'doctor' ? colors.primary : colors.accent,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  {user.role}
                </Text>
              </View>
            </Card>
          </MotiView>
        ))}

        <Pressable
          onPress={() =>
            requirePractice('Team members require VedaCare Practice. Upgrade to add doctors, nurses, and assistants to your practice.')
          }
        >
          <Card
            variant="outlined"
            style={{ alignItems: 'center', gap: 8, paddingVertical: 20 }}
          >
            <View style={{ position: 'relative' }}>
              <Text style={{ fontSize: 28 }}>➕</Text>
              {!canAddTeamMembers && (
                <View
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -12,
                    backgroundColor: colors.primary,
                    borderRadius: 8,
                    padding: 3,
                  }}
                >
                  <Ionicons name="lock-closed" size={10} color="#FFF" />
                </View>
              )}
            </View>
            <Text style={{ fontSize: 15, fontWeight: '600', color: colors.primary }}>
              Invite Team Member
            </Text>
            <Text style={{ fontSize: 13, color: colors.textSecondary, textAlign: 'center' }}>
              {canAddTeamMembers
                ? 'Add doctors, nurses, or assistants to your practice'
                : 'Requires Practice plan'}
            </Text>
          </Card>
        </Pressable>
      </ScrollView>
    </View>
  );
}
