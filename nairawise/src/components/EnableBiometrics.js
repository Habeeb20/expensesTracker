// src/components/EnableBiometricSheet.js
import { forwardRef, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Fingerprint } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';

const EnableBiometricSheet = forwardRef(function EnableBiometricSheet(
  { onEnable, onDismiss },
  ref
) {
  const { theme } = useTheme();
  const snapPoints = useMemo(() => ['32%'], []);

  const renderBackdrop = (props) => (
    <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.5} />
  );

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      onDismiss={onDismiss}
      backgroundStyle={{ backgroundColor: theme.surface }}
      handleIndicatorStyle={{ backgroundColor: theme.border }}
    >
      <View style={{ padding: 24, flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <View
            style={{
              width: 40, height: 40, borderRadius: 20,
              alignItems: 'center', justifyContent: 'center',
              backgroundColor: theme.primaryMuted, marginRight: 12,
            }}
          >
            <Fingerprint size={20} color={theme.onPrimary} />
          </View>
          <Text style={{ color: theme.textPrimary, fontSize: 18, fontWeight: '700', flex: 1 }}>
            Enable fingerprint login?
          </Text>
        </View>

        <Text style={{ color: theme.textSecondary, fontSize: 14, marginBottom: 24 }}>
          Log in faster next time using your fingerprint instead of your password.
        </Text>

        <TouchableOpacity
          onPress={onEnable}
          style={{
            backgroundColor: theme.primary, borderRadius: 16,
            paddingVertical: 16, alignItems: 'center', marginBottom: 10,
          }}
        >
          <Text style={{ color: theme.onPrimary, fontWeight: '700', fontSize: 15 }}>Enable</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onDismiss} style={{ paddingVertical: 14, alignItems: 'center' }}>
          <Text style={{ color: theme.textSecondary, fontWeight: '600', fontSize: 15 }}>Not now</Text>
        </TouchableOpacity>
      </View>
    </BottomSheetModal>
  );
});

export default EnableBiometricSheet;