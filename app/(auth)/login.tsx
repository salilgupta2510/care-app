import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useColorScheme } from '@/hooks/useColorScheme';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Minimum 6 characters'),
});
type FormValues = z.infer<typeof schema>;

export default function LoginScreen() {
  const { colors } = useColorScheme();
  const { login, loading, error } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async ({ email, password }: FormValues) => {
    setSubmitting(true);
    try {
      await login(email, password);
      router.replace('/(app)/(tabs)/inbox');
    } catch {
      /* error shown via useAuth().error */
    } finally {
      setSubmitting(false);
    }
  };

  const useMock = process.env.EXPO_PUBLIC_USE_MOCK === 'true';

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 24 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header gradient */}
        <LinearGradient
          colors={[colors.primary, `${colors.primary}CC`]}
          style={{ paddingTop: insets.top + 32, paddingBottom: 48, paddingHorizontal: 24, alignItems: 'center', gap: 12 }}
        >
          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            style={{
              width: 72,
              height: 72,
              borderRadius: 22,
              backgroundColor: 'rgba(255,255,255,0.15)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 38 }}>🏥</Text>
          </MotiView>
          <Text style={{ fontSize: 28, fontWeight: '800', color: '#FFF', letterSpacing: -0.5 }}>
            VedaCare
          </Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', textAlign: 'center' }}>
            Secure AI communication for healthcare professionals
          </Text>
        </LinearGradient>

        {/* Form card */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 150 }}
          style={{
            backgroundColor: colors.card,
            margin: 20,
            borderRadius: 20,
            padding: 24,
            gap: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 6,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text }}>
            Sign in
          </Text>

          {/* Email */}
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textSecondary }}>
              Work Email
            </Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { value, onChange, onBlur } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="doctor@hospital.com"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={{
                    backgroundColor: colors.background,
                    borderRadius: 10,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    fontSize: 15,
                    color: colors.text,
                    borderWidth: 1.5,
                    borderColor: errors.email ? colors.urgent : colors.border,
                  }}
                />
              )}
            />
            {errors.email && (
              <Text style={{ fontSize: 12, color: colors.urgent }}>{errors.email.message}</Text>
            )}
          </View>

          {/* Password */}
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textSecondary }}>
              Password
            </Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { value, onChange, onBlur } }) => (
                <View style={{ position: 'relative' }}>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="••••••••"
                    placeholderTextColor={colors.textSecondary}
                    secureTextEntry={!showPass}
                    style={{
                      backgroundColor: colors.background,
                      borderRadius: 10,
                      paddingHorizontal: 14,
                      paddingVertical: 12,
                      paddingRight: 44,
                      fontSize: 15,
                      color: colors.text,
                      borderWidth: 1.5,
                      borderColor: errors.password ? colors.urgent : colors.border,
                    }}
                  />
                  <Pressable
                    onPress={() => setShowPass((s) => !s)}
                    style={{ position: 'absolute', right: 12, top: 12 }}
                  >
                    <Ionicons
                      name={showPass ? 'eye-off' : 'eye'}
                      size={20}
                      color={colors.textSecondary}
                    />
                  </Pressable>
                </View>
              )}
            />
            {errors.password && (
              <Text style={{ fontSize: 12, color: colors.urgent }}>{errors.password.message}</Text>
            )}
          </View>

          {error && (
            <View
              style={{
                backgroundColor: `${colors.urgent}15`,
                borderRadius: 8,
                padding: 10,
                borderWidth: 1,
                borderColor: `${colors.urgent}40`,
              }}
            >
              <Text style={{ color: colors.urgent, fontSize: 13 }}>{error}</Text>
            </View>
          )}

          <Button
            label={useMock ? 'Continue (Demo Mode)' : 'Sign In'}
            onPress={handleSubmit(onSubmit)}
            loading={submitting}
            size="lg"
            style={{ borderRadius: 12 }}
          />

          {!useMock && (
            <Pressable
              onPress={() => router.replace('/(auth)/signup')}
              style={{ alignItems: 'center', paddingVertical: 4 }}
            >
              <Text style={{ fontSize: 14, color: colors.textSecondary }}>
                No account?{' '}
                <Text style={{ color: colors.primary, fontWeight: '600' }}>Sign up</Text>
              </Text>
            </Pressable>
          )}
        </MotiView>

        {useMock && (
          <View style={{ paddingHorizontal: 24, alignItems: 'center' }}>
            <View
              style={{
                backgroundColor: `${colors.accent}20`,
                borderRadius: 10,
                padding: 12,
                borderWidth: 1,
                borderColor: `${colors.accent}40`,
              }}
            >
              <Text style={{ color: colors.accent, fontSize: 13, textAlign: 'center', fontWeight: '600' }}>
                Demo mode active — using mock patient data
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
