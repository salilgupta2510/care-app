import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useSubscription } from '@/hooks/useSubscription';
import { PLANS, type Plan } from '@/stores/subscriptionStore';

export function PaywallModal() {
  const { colors } = useColorScheme();
  const insets = useSafeAreaInsets();
  const { paywallVisible, paywallReason, hidePaywall, setPlan, plan: currentPlan } = useSubscription();
  const [selected, setSelected] = useState<Plan>('pro');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    // TODO: integrate RevenueCat / Razorpay
    await new Promise((r) => setTimeout(r, 1200));
    setPlan(selected, new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
    setLoading(false);
    hidePaywall();
    Alert.alert('Subscribed!', `Welcome to VedaCare ${selected.charAt(0).toUpperCase() + selected.slice(1)} 🎉`);
  };

  return (
    <Modal
      visible={paywallVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={hidePaywall}
    >
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Header */}
        <LinearGradient
          colors={['#0F4C81', '#1E6BB8']}
          style={{
            paddingTop: insets.top + 16,
            paddingBottom: 32,
            paddingHorizontal: 24,
            alignItems: 'center',
            gap: 10,
          }}
        >
          <Pressable
            onPress={hidePaywall}
            style={{ position: 'absolute', top: insets.top + 14, right: 20 }}
            hitSlop={12}
          >
            <Ionicons name="close" size={22} color="rgba(255,255,255,0.8)" />
          </Pressable>

          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 18,
              backgroundColor: 'rgba(255,255,255,0.15)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 28 }}>✨</Text>
          </View>

          <Text style={{ fontSize: 22, fontWeight: '800', color: '#FFF', letterSpacing: -0.5 }}>
            Upgrade VedaCare
          </Text>

          {paywallReason ? (
            <View
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                borderRadius: 10,
                paddingHorizontal: 14,
                paddingVertical: 7,
              }}
            >
              <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, textAlign: 'center' }}>
                {paywallReason}
              </Text>
            </View>
          ) : (
            <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, textAlign: 'center' }}>
              Unlock AI-powered patient communication
            </Text>
          )}
        </LinearGradient>

        <ScrollView
          contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: insets.bottom + 100 }}
          showsVerticalScrollIndicator={false}
        >
          {PLANS.map((planItem, i) => {
            const isSelected = selected === planItem.key;
            const isCurrent = currentPlan === planItem.key;

            return (
              <MotiView
                key={planItem.key}
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 300, delay: i * 80 }}
              >
                <Pressable
                  onPress={() => setSelected(planItem.key)}
                  style={{
                    borderRadius: 16,
                    borderWidth: 2,
                    borderColor: isSelected ? planItem.color : colors.border,
                    backgroundColor: isSelected ? `${planItem.color}08` : colors.card,
                    overflow: 'hidden',
                  }}
                >
                  {/* Plan header */}
                  <View
                    style={{
                      backgroundColor: isSelected ? planItem.color : colors.border,
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <View style={{ gap: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Text
                          style={{
                            fontSize: 17,
                            fontWeight: '800',
                            color: isSelected ? '#FFF' : colors.text,
                          }}
                        >
                          {planItem.name}
                        </Text>
                        {'badge' in planItem && planItem.badge && (
                          <View
                            style={{
                              backgroundColor: 'rgba(255,255,255,0.25)',
                              borderRadius: 6,
                              paddingHorizontal: 7,
                              paddingVertical: 2,
                            }}
                          >
                            <Text style={{ fontSize: 10, fontWeight: '700', color: '#FFF' }}>
                              {planItem.badge}
                            </Text>
                          </View>
                        )}
                        {isCurrent && (
                          <View
                            style={{
                              backgroundColor: 'rgba(255,255,255,0.25)',
                              borderRadius: 6,
                              paddingHorizontal: 7,
                              paddingVertical: 2,
                            }}
                          >
                            <Text style={{ fontSize: 10, fontWeight: '700', color: '#FFF' }}>
                              CURRENT
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text
                        style={{
                          fontSize: 13,
                          color: isSelected ? 'rgba(255,255,255,0.8)' : colors.textSecondary,
                        }}
                      >
                        {planItem.description}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: '800',
                          color: isSelected ? '#FFF' : colors.text,
                        }}
                      >
                        {planItem.price === 0 ? 'Free' : `₹${planItem.price}`}
                      </Text>
                      {planItem.price > 0 && (
                        <Text
                          style={{
                            fontSize: 11,
                            color: isSelected ? 'rgba(255,255,255,0.7)' : colors.textSecondary,
                          }}
                        >
                          /month
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* Features */}
                  <View style={{ padding: 14, gap: 8 }}>
                    {planItem.features.map((feature) => (
                      <View
                        key={feature.label}
                        style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
                      >
                        <View
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 10,
                            backgroundColor: feature.included
                              ? `${planItem.color}20`
                              : colors.border,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Ionicons
                            name={feature.included ? 'checkmark' : 'close'}
                            size={12}
                            color={feature.included ? planItem.color : colors.textSecondary}
                          />
                        </View>
                        <Text
                          style={{
                            fontSize: 13,
                            color: feature.included ? colors.text : colors.textSecondary,
                            fontWeight: feature.included ? '500' : '400',
                            flex: 1,
                          }}
                        >
                          {feature.label}
                        </Text>
                      </View>
                    ))}
                  </View>
                </Pressable>
              </MotiView>
            );
          })}

          <Text
            style={{
              fontSize: 11,
              color: colors.textSecondary,
              textAlign: 'center',
              paddingHorizontal: 16,
              lineHeight: 16,
            }}
          >
            Cancel anytime. No refunds for partial months. Billed monthly via Razorpay.
          </Text>
        </ScrollView>

        {/* Sticky CTA */}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: colors.card,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            padding: 16,
            paddingBottom: insets.bottom + 8,
            gap: 10,
          }}
        >
          {selected === 'free' ? (
            <Pressable
              onPress={hidePaywall}
              style={{
                backgroundColor: colors.border,
                borderRadius: 14,
                paddingVertical: 15,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>
                Continue with Free
              </Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={handleSubscribe}
              disabled={loading || currentPlan === selected}
              style={{
                backgroundColor:
                  PLANS.find((p) => p.key === selected)?.color ?? '#0F4C81',
                borderRadius: 14,
                paddingVertical: 15,
                alignItems: 'center',
                opacity: loading || currentPlan === selected ? 0.7 : 1,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#FFF' }}>
                {loading
                  ? 'Processing…'
                  : currentPlan === selected
                  ? 'Current Plan'
                  : `Subscribe to ${PLANS.find((p) => p.key === selected)?.name} — ${PLANS.find((p) => p.key === selected)?.priceLabel}`}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
}
