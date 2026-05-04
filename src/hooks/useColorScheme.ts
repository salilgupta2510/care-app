import { useColorScheme as useRNColorScheme } from 'react-native';
import { useUIStore } from '@/stores/uiStore';
import { Colors } from '@/constants/theme';

export function useColorScheme() {
  const systemScheme = useRNColorScheme() ?? 'light';
  const { themeOverride } = useUIStore();
  const scheme = themeOverride === 'system' ? systemScheme : themeOverride;
  const colors = Colors[scheme];
  return { scheme, colors, isDark: scheme === 'dark' };
}
