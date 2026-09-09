// src/components/VoiceTransactionRecorder.jsx
import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  ActivityIndicator,
  Animated,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Mic, X, Check, RotateCcw } from 'lucide-react-native';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';

import { useTheme } from '../theme/ThemeContext';
import { CATEGORIES } from './categories';

import { categoryColors } from '../theme/colors';
import { createTransaction } from '../api/transaction';
import { parseVoiceTransaction } from '../utils/VoiceTransactionPerser';

import { toast } from 'sonner-native';

// 'idle' -> 'listening' -> 'confirming' -> 'saving'
export default function VoiceTransactionRecorder({ visible, onClose, onSaved }) {
  const { theme, isDark } = useTheme();

  const [phase, setPhase] = useState('idle');
  const [transcript, setTranscript] = useState('');
  const [draft, setDraft] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      setPhase('idle');
      setTranscript('');
      setDraft(null);
      startListening();
    } else {
      ExpoSpeechRecognitionModule.stop();
    }
  }, [visible]);

  useEffect(() => {
    if (phase !== 'listening') return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.25, duration: 600, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [phase]);

  useSpeechRecognitionEvent('result', (event) => {
    const text = event.results?.[0]?.transcript ?? '';
    setTranscript(text);
  });

  useSpeechRecognitionEvent('end', () => {
    setPhase((prev) => {
      if (prev !== 'listening') return prev;
      return 'confirming';
    });
  });

  useSpeechRecognitionEvent('error', (event) => {
    console.log('Speech recognition error:', event.error, event.message);
    if (event.error === 'not-allowed' || event.error === 'permissions-missing') {
      setPermissionDenied(true);
    }
    setPhase('idle');
  });

  useEffect(() => {
    if (phase === 'confirming' && transcript) {
      setDraft(parseVoiceTransaction(transcript));
    }
  }, [phase, transcript]);

  const startListening = async () => {
    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!result.granted) {
      setPermissionDenied(true);
      return;
    }
    setPermissionDenied(false);
    setTranscript('');
    setPhase('listening');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    ExpoSpeechRecognitionModule.start({
      lang: 'en-US',
      interimResults: true,
      continuous: false,
    });
  };

  const stopListening = () => {
    ExpoSpeechRecognitionModule.stop();
  };

  const handleRetry = () => {
    setDraft(null);
    startListening();
  };

  const handleSave = async () => {
    if (!draft || !draft.amount) {
      toast.error('Enter a valid amount before saving');
      return;
    }
    setPhase('saving');
    try {
      await createTransaction({
        amount: draft.amount,
        type: draft.type,
        category: draft.category,
        description: draft.description || draft.categoryLabel,
        date: new Date().toISOString(),
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      toast.success('Transaction added');
      onSaved?.();
      onClose();
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to add transaction';
      toast.error(message);
      setPhase('confirming');
    }
  };

  const accent = theme.primary;
  const inputBg = isDark ? '#0F1830' : '#F2F3F7';

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <View
          style={{
            backgroundColor: theme.surface,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 32,
            minHeight: 320,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ color: theme.textPrimary, fontSize: 16, fontWeight: '700' }}>
              {phase === 'confirming' ? 'Confirm transaction' : 'Add by voice'}
            </Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <X size={20} color={theme.textMuted} />
            </Pressable>
          </View>

          {/* Listening state */}
          {phase === 'listening' && (
            <View style={{ alignItems: 'center', paddingVertical: 24, gap: 16 }}>
              <Animated.View
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 36,
                  backgroundColor: accent,
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: [{ scale: pulse }],
                }}
              >
                <Mic size={30} color={theme.onPrimary} />
              </Animated.View>
              <Text style={{ color: theme.textSecondary, fontSize: 13, textAlign: 'center' }}>
                Listening... try "income salary 30000" or "expense food 2500 lunch"
              </Text>
              <Text style={{ color: theme.textPrimary, fontSize: 15, minHeight: 40, textAlign: 'center' }}>
                {transcript}
              </Text>
              <Pressable
                onPress={stopListening}
                style={{
                  paddingHorizontal: 24,
                  paddingVertical: 10,
                  borderRadius: 999,
                  backgroundColor: theme.background === '#FFFFFF' ? '#111827' : theme.background,
                }}
              >
                <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>Done</Text>
              </Pressable>
            </View>
          )}

          {/* Confirmation state */}
          {phase === 'confirming' && draft && (
            <View style={{ gap: 14 }}>
              <View
                style={{
                  backgroundColor: inputBg,
                  borderRadius: 14,
                  padding: 12,
                }}
              >
                <Text style={{ color: theme.textMuted, fontSize: 11, marginBottom: 4 }}>Heard</Text>
                <Text style={{ color: theme.textSecondary, fontSize: 13, fontStyle: 'italic' }}>
                  "{draft.rawTranscript}"
                </Text>
              </View>

              {draft.needsReview && (
                <Text style={{ color: '#B42318', fontSize: 12 }}>
                  Couldn't detect an amount — please enter it below.
                </Text>
              )}

              {/* Type toggle */}
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {['expense', 'income'].map((t) => (
                  <Pressable
                    key={t}
                    onPress={() => setDraft((d) => ({ ...d, type: t }))}
                    style={{
                      flex: 1,
                      paddingVertical: 10,
                      borderRadius: 12,
                      alignItems: 'center',
                      backgroundColor: draft.type === t ? (t === 'income' ? theme.income : theme.expense) : theme.background,
                      borderWidth: 1,
                      borderColor: theme.border,
                    }}
                  >
                    <Text style={{ color: draft.type === t ? '#fff' : theme.textSecondary, fontWeight: '600', fontSize: 13 }}>
                      {t === 'income' ? 'Income' : 'Expense'}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* Amount */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: inputBg,
                  borderRadius: 14,
                  paddingHorizontal: 14,
                  height: 52,
                }}
              >
                <Text style={{ color: theme.textMuted, fontSize: 18, fontWeight: '700', marginRight: 6 }}>₦</Text>
                <TextInput
                  value={draft.amount != null ? String(draft.amount) : ''}
                  onChangeText={(v) => setDraft((d) => ({ ...d, amount: v ? Number(v) : null }))}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor={theme.textMuted}
                  style={{ flex: 1, fontSize: 18, fontWeight: '700', color: theme.textPrimary }}
                />
              </View>

              {/* Category chips */}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {CATEGORIES.map((c) => {
                  const active = draft.category === c.key;
                  const color = categoryColors[c.key];
                  return (
                    <Pressable
                      key={c.key}
                      onPress={() => setDraft((d) => ({ ...d, category: c.key, categoryLabel: c.label }))}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 999,
                        backgroundColor: active ? (isDark ? `${color}33` : `${color}1A`) : theme.background,
                        borderWidth: 1,
                        borderColor: active ? color : theme.border,
                      }}
                    >
                      <Text style={{ fontSize: 12, color: active ? theme.textPrimary : theme.textSecondary, fontWeight: '600' }}>
                        {c.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Description */}
              <TextInput
                value={draft.description}
                onChangeText={(v) => setDraft((d) => ({ ...d, description: v }))}
                placeholder="Description (optional)"
                placeholderTextColor={theme.textMuted}
                style={{
                  backgroundColor: inputBg,
                  borderRadius: 14,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  fontSize: 14,
                  color: theme.textPrimary,
                }}
              />

              {/* Actions */}
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
                <Pressable
                  onPress={handleRetry}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    flex: 1,
                    paddingVertical: 14,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: theme.border,
                  }}
                >
                  <RotateCcw size={16} color={theme.textSecondary} />
                  <Text style={{ color: theme.textSecondary, fontWeight: '600', fontSize: 13 }}>Try again</Text>
                </Pressable>
                <Pressable
                  onPress={handleSave}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    flex: 1.4,
                    paddingVertical: 14,
                    borderRadius: 14,
                    backgroundColor: theme.primary,
                  }}
                >
                  <Check size={16} color={theme.onPrimary} />
                  <Text style={{ color: theme.onPrimary, fontWeight: '700', fontSize: 13 }}>
                    Save transaction
                  </Text>
                </Pressable>
              </View>
            </View>
          )}

          {phase === 'saving' && (
            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
              <ActivityIndicator color={accent} size="large" />
            </View>
          )}

          {permissionDenied && phase === 'idle' && (
            <View style={{ alignItems: 'center', gap: 10, paddingVertical: 20 }}>
              <Text style={{ color: theme.textSecondary, fontSize: 13, textAlign: 'center' }}>
                Microphone or speech recognition permission was denied. Enable it in your device settings to use voice entry.
              </Text>
              <Pressable onPress={startListening} style={{ paddingHorizontal: 20, paddingVertical: 10, borderRadius: 999, backgroundColor: accent }}>
                <Text style={{ color: theme.onPrimary, fontWeight: '600' }}>Try again</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}