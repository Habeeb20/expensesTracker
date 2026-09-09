// src/components/VoiceQuickAdd.jsx
import { useState } from 'react';
import { View, Pressable, Animated } from 'react-native';
import { Mic } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { useTheme } from '../theme/ThemeContext';
import VoiceTransactionRecorder from './VoiceTransactionRecorder';



export default function VoiceQuickAdd() {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const scale = useState(new Animated.Value(1))[0];

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.9, duration: 80, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
    setOpen(true);
  };

  return (
    <>
      <Animated.View
        pointerEvents={open ? 'none' : 'auto'}
        style={{
          position: 'absolute',
          bottom: 156, // sits directly above the AI chat FAB (bottom: 88, height 58 + gap)
          right: 20,
          transform: [{ scale }],
          zIndex: 60,
        }}
      >
        <Pressable onPress={handlePress}>
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: theme.primary,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: theme.primary,
              shadowOpacity: 0.4,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 6 },
              elevation: 8,
              borderWidth: 3,
              borderColor: theme.background,
            }}
          >
            <Mic size={22} color={theme.onPrimary} />
          </View>
        </Pressable>
      </Animated.View>

      <VoiceTransactionRecorder
        visible={open}
        onClose={() => setOpen(false)}
        onSaved={() => setOpen(false)}
      />
    </>
  );
}