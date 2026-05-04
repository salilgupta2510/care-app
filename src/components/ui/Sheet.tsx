import React, { useCallback, useRef } from 'react';
import { View, Text, type ViewStyle } from 'react-native';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { useColorScheme } from '@/hooks/useColorScheme';

interface SheetProps {
  sheetRef: React.RefObject<BottomSheet>;
  snapPoints?: string[];
  title?: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Sheet({
  sheetRef,
  snapPoints = ['40%', '70%'],
  title,
  children,
  style,
}: SheetProps) {
  const { colors, isDark } = useColorScheme();

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
      />
    ),
    []
  );

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.card }}
      handleIndicatorStyle={{ backgroundColor: colors.border, width: 36, height: 4 }}
    >
      <BottomSheetView style={[{ padding: 20, gap: 16 }, style]}>
        {title && (
          <Text style={{ fontSize: 17, fontWeight: '700', color: colors.text }}>
            {title}
          </Text>
        )}
        {children}
      </BottomSheetView>
    </BottomSheet>
  );
}
