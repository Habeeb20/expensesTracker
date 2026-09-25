import { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { X } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';

export default function DeductBudgetModal({ visible, budget, onClose, onSubmit }) {
  const { theme } = useTheme();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const remaining = budget ? budget.limit - budget.spent : 0;

  const handleSubmit = () => {
    if (!amount || Number(amount) <= 0) return;
    onSubmit({ amount: Number(amount), description: description.trim() || undefined });
    setAmount('');
    setDescription('');
  };

  if (!budget) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={{ backgroundColor: theme.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 32 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <Text style={{ fontSize: 17, fontWeight: '700', color: theme.text }}>Log spend</Text>
              <TouchableOpacity onPress={onClose}>
                <X size={22} color={theme.textMuted} />
              </TouchableOpacity>
            </View>
            <Text style={{ color: theme.textMuted, fontSize: 13, marginBottom: 16 }}>
              Against "{budget.category}" · ₦{remaining.toLocaleString()} remaining
            </Text>

            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="Amount spent"
              placeholderTextColor={theme.textMuted}
              keyboardType="numeric"
              style={{ borderWidth: 1, borderColor: theme.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, color: theme.text, marginBottom: 12, backgroundColor: theme.background }}
            />
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="What was it for? (optional)"
              placeholderTextColor={theme.textMuted}
              style={{ borderWidth: 1, borderColor: theme.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, color: theme.text, marginBottom: 12, backgroundColor: theme.background }}
            />

            <TouchableOpacity
              onPress={handleSubmit}
              style={{ backgroundColor: theme.primary, borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 8 }}
            >
              <Text style={{ color: theme.onPrimary, fontWeight: '700' }}>Confirm spend</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}