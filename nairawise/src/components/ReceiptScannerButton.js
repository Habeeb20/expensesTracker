// src/components/ReceiptScanButton.js
import { useRef, useEffect } from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme/ThemeContext';

export default function ReceiptScanButton() {
  const { theme } = useTheme();
  const router = useRouter();
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.4, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/scan-receipt');
  };

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        bottom: 88,
        left: 20,
        zIndex: 60,
      }}
    >
      <TouchableOpacity onPress={handlePress} activeOpacity={0.85}>
        <View
          style={{
            width: 58,
            height: 58,
            borderRadius: 29,
            backgroundColor: theme.primary,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: theme.primary,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.4,
            shadowRadius: 14,
            elevation: 8,
          }}
        >
          <Animated.View
            style={{
              position: 'absolute',
              top: 6,
              right: 6,
              width: 9,
              height: 9,
              borderRadius: 5,
              backgroundColor: theme.onPrimary,
              opacity: 0.85,
              transform: [{ scale: pulse }],
            }}
          />
          <Camera size={24} color={theme.onPrimary} />
        </View>
      </TouchableOpacity>
    </View>
  );
}