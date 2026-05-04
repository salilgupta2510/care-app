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
import type { UserRole } from '@/types/firestore';

const schema = z.object({
  name: z.string().min(2, 'Name too short'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Minimum 6 characters'),
  role: z.enum(['doctor', 'assistant']),
  phone: z.string().regex(/^\+\d{7,15}$/, 'Use E.164 format e.g. +911234567890'),
  licenseId: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export default function SignupScreen() {
  const { colors } = useColorScheme();
  const { signup, error } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '', role: 'doctor', phone: '', licenseId: '' },
  });

  const selectedRole = watch('role');

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      await signup({
        email: values.email,
        password: values.password,
        name: values.name,
        role: values.role as UserRole,
        phone: values.phone,
        licenseId: values.licenseId || undefined,
      });
      router.replace('/(app)/(tabs)/inbox');
    } catch {
      /* error shown via useAuth().error */
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = (hasError: boolean) => ({
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1.5,
    borderColor: hasError ? colors.urgent : colors.border,
  });

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
            Create your account
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
          <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text }}>Sign up</Text>

          {/* Full name */}
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textSecondary }}>Full Name</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { value, onChange, onBlur } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Dr. Priya Sharma"
                  placeholderTextColor={colors.textSecondary}
                  autoCapitalize="words"
                  style={inputStyle(!!errors.name)}
                />
              )}
            />
            {errors.name && <Text style={{ fontSize: 12, color: colors.urgent }}>{errors.name.message}</Text>}
          </View>

          {/* Email */}
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textSecondary }}>Work Email</Text>
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
                  style={inputStyle(!!errors.email)}
                />
              )}
            />
            {errors.email && <Text style={{ fontSize: 12, color: colors.urgent }}>{errors.email.message}</Text>}
          </View>

          {/* Password */}
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textSecondary }}>Password</Text>
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
                    style={[inputStyle(!!errors.password), { paddingRight: 44 }]}
                  />
                  <Pressable
                    onPress={() => setShowPass((s) => !s)}
                    style={{ position: 'absolute', right: 12, top: 12 }}
                  >
                    <Ionicons name={showPass ? 'eye-off' : 'eye'} size={20} color={colors.textSecondary} />
                  </Pressable>
                </View>
              )}
            />
            {errors.password && <Text style={{ fontSize: 12, color: colors.urgent }}>{errors.password.message}</Text>}
          </View>

          {/* Role selector */}
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textSecondary }}>Role</Text>
            <Controller
              control={control}
              name="role"
              render={({ field: { onChange } }) => (
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  {(['doctor', 'assistant'] as UserRole[]).map((r) => (
                    <Pressable
                      key={r}
                      onPress={() => onChange(r)}
                      style={{
                        flex: 1,
                        paddingVertical: 12,
                        borderRadius: 10,
                        borderWidth: 1.5,
                        borderColor: selectedRole === r ? colors.primary : colors.border,
                        backgroundColor: selectedRole === r ? `${colors.primary}15` : colors.background,
                        alignItems: 'center',
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: '600',
                          color: selectedRole === r ? colors.primary : colors.textSecondary,
                          textTransform: 'capitalize',
                        }}
                      >
                        {r}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            />
          </View>

          {/* Phone */}
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textSecondary }}>
              Phone <Text style={{ fontWeight: '400' }}>(E.164)</Text>
            </Text>
            <Controller
              control={control}
              name="phone"
              render={({ field: { value, onChange, onBlur } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="+911234567890"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="phone-pad"
                  style={inputStyle(!!errors.phone)}
                />
              )}
            />
            {errors.phone && <Text style={{ fontSize: 12, color: colors.urgent }}>{errors.phone.message}</Text>}
          </View>

          {/* License ID — doctor only */}
          {selectedRole === 'doctor' && (
            <View style={{ gap: 6 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textSecondary }}>
                License ID <Text style={{ fontWeight: '400' }}>(optional)</Text>
              </Text>
              <Controller
                control={control}
                name="licenseId"
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="MCI-2024-001"
                    placeholderTextColor={colors.textSecondary}
                    autoCapitalize="characters"
                    style={inputStyle(false)}
                  />
                )}
              />
            </View>
          )}

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
            label="Create Account"
            onPress={handleSubmit(onSubmit)}
            loading={submitting}
            size="lg"
            style={{ borderRadius: 12 }}
          />

          <Pressable
            onPress={() => router.replace('/(auth)/login')}
            style={{ alignItems: 'center', paddingVertical: 4 }}
          >
            <Text style={{ fontSize: 14, color: colors.textSecondary }}>
              Already have an account?{' '}
              <Text style={{ color: colors.primary, fontWeight: '600' }}>Sign in</Text>
            </Text>
          </Pressable>
        </MotiView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
