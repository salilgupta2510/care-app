import React from 'react';
import { View, Text, Pressable, Switch, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/hooks/useAuth';
import { useUIStore } from '@/stores/uiStore';
import { useSubscription } from '@/hooks/useSubscription';
import { PLANS } from '@/stores/subscriptionStore';

type Section = {
  title: string;
  items: Array<{
    icon: string;
    label: string;
    value?: string;
    toggle?: boolean;
    toggleValue?: boolean;
    onToggle?: (v: boolean) => void;
    onPress?: () => void;
    danger?: boolean;
  }>;
};

export default function SettingsScreen() {
  const { colors, isDark } = useColorScheme();
  const insets = useSafeAreaInsets();
  const { profile, logout } = useAuth();
  const { themeOverride, setThemeOverride } = useUIStore();
  const { plan, showPaywall } = useSubscription();
  const planLabel = PLANS.find((p) => p.key === plan)?.name ?? 'Free';

  const sections: Section[] = [
    {
      title: 'Appearance',
      items: [
        {
          icon: '🌙',
          label: 'Dark Mode',
          toggle: true,
          toggleValue: themeOverride === 'dark',
          onToggle: (v) => setThemeOverride(v ? 'dark' : 'light'),
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        { icon: '🔔', label: 'Push Notifications', toggle: true, toggleValue: true },
        { icon: '🚨', label: 'Urgent Alerts', toggle: true, toggleValue: true },
      ],
    },
    {
      title: 'Security',
      items: [
        { icon: '🔐', label: 'Biometric Lock', toggle: true, toggleValue: false },
        { icon: '🛡️', label: 'HIPAA Compliance', value: 'Active', onPress: () => {} },
        { icon: '📋', label: 'Audit Log', onPress: () => Alert.alert('Audit Log', 'Coming soon') },
      ],
    },
    {
      title: 'Subscription',
      items: [
        {
          icon: '✨',
          label: 'Current Plan',
          value: planLabel,
          onPress: () => showPaywall(),
        },
        ...(plan === 'free'
          ? [{ icon: '⬆️', label: 'Upgrade to Pro', onPress: () => showPaywall('Unlock AI summaries, unlimited chats, and more.') }]
          : []),
      ],
    },
    {
      title: 'Account',
      items: [
        { icon: '📞', label: 'WhatsApp Business', value: 'Connected', onPress: () => {} },
        { icon: '🔑', label: 'Change Password', onPress: () => {} },
        {
          icon: '🚪',
          label: 'Sign Out',
          danger: true,
          onPress: () => {
            Alert.alert('Sign Out', 'Are you sure?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Sign Out', style: 'destructive', onPress: logout },
            ]);
          },
        },
      ],
    },
  ];

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
        <Text style={{ fontSize: 26, fontWeight: '800', color: colors.text }}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 16, gap: 20 }}>
        {/* Profile card */}
        {profile && (
          <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <Avatar name={profile.name} size={56} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>{profile.name}</Text>
              <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2, textTransform: 'capitalize' }}>
                {profile.role} · {profile.phone}
              </Text>
              {profile.licenseId && (
                <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 1 }}>
                  License: {profile.licenseId}
                </Text>
              )}
            </View>
          </Card>
        )}

        {sections.map((section) => (
          <View key={section.title} style={{ gap: 4 }}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: '700',
                color: colors.textSecondary,
                textTransform: 'uppercase',
                letterSpacing: 0.8,
                paddingHorizontal: 4,
                marginBottom: 4,
              }}
            >
              {section.title}
            </Text>
            <Card style={{ padding: 0, overflow: 'hidden' }}>
              {section.items.map((item, i) => (
                <Pressable
                  key={item.label}
                  onPress={item.onPress}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    borderBottomWidth: i < section.items.length - 1 ? 1 : 0,
                    borderBottomColor: colors.border,
                  }}
                >
                  <Text style={{ fontSize: 18, marginRight: 12 }}>{item.icon}</Text>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 15,
                      color: item.danger ? colors.urgent : colors.text,
                      fontWeight: '500',
                    }}
                  >
                    {item.label}
                  </Text>
                  {item.toggle ? (
                    <Switch
                      value={item.toggleValue}
                      onValueChange={item.onToggle}
                      trackColor={{ false: colors.border, true: colors.accent }}
                      thumbColor="#FFFFFF"
                    />
                  ) : item.value ? (
                    <Text style={{ fontSize: 13, color: colors.textSecondary }}>{item.value}</Text>
                  ) : item.onPress ? (
                    <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
                  ) : null}
                </Pressable>
              ))}
            </Card>
          </View>
        ))}

        <Text style={{ textAlign: 'center', fontSize: 12, color: colors.textSecondary }}>
          VedaCare v1.0.0 · HIPAA Compliant
        </Text>
      </ScrollView>
    </View>
  );
}
