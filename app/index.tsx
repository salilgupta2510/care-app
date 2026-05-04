import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { View, ActivityIndicator } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function Index() {
  const { isAuthenticated, loading } = useAuth();
  const { colors } = useColorScheme();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return isAuthenticated ? (
    <Redirect href="/(app)/(tabs)/inbox" />
  ) : (
    <Redirect href="/(auth)/onboarding" />
  );
}
