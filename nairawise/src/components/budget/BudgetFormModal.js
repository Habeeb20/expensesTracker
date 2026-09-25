import { useEffect, useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { X } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';

export default function BudgetFormModal({ visible, onClose, onSubmit, initialBudget }) {
  const { theme, isDark } = useTheme();
  const isEdit = !!initialBudget;
  const textColor = isDark ? '#fff' : theme.text;

  const [category, setCategory] = useState('');
  const [task, setTask] = useState('');
  const [limit, setLimit] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (visible) {
      setCategory(initialBudget?.category || '');
      setTask(initialBudget?.task || '');
      setLimit(initialBudget?.limit ? String(initialBudget.limit) : '');
      setDueDate(initialBudget?.dueDate ? initialBudget.dueDate.slice(0, 10) : '');
    }
  }, [visible, initialBudget]);

  const handleSubmit = () => {
    if (!category.trim() || !limit) return;
    onSubmit({
      category: category.trim(),
      task: task.trim(),
      limit: Number(limit),
      dueDate: dueDate || undefined,
    });
  };

  const inputStyle = {
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: textColor,
    marginBottom: 12,
    backgroundColor: theme.background,
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={{ backgroundColor: theme.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 32 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 17, fontWeight: '700', color: textColor }}>
                {isEdit ? 'Edit Budget' : 'New Budget'}
              </Text>
              <TouchableOpacity onPress={onClose}>
                <X size={22} color={textColor} />
              </TouchableOpacity>
            </View>

            <Text style={{ color: isDark ? '#ccc' : theme.textMuted, fontSize: 12, marginBottom: 4 }}>Category</Text>
            <TextInput
              value={category}
              onChangeText={setCategory}
              placeholder="e.g. Groceries"
              placeholderTextColor={isDark ? '#999' : theme.textMuted}
              style={inputStyle}
            />

            <Text style={{ color: isDark ? '#ccc' : theme.textMuted, fontSize: 12, marginBottom: 4 }}>Task / note (optional)</Text>
            <TextInput
              value={task}
              onChangeText={setTask}
              placeholder="e.g. Weekly shopping"
              placeholderTextColor={isDark ? '#999' : theme.textMuted}
              style={inputStyle}
            />

            <Text style={{ color: isDark ? '#ccc' : theme.textMuted, fontSize: 12, marginBottom: 4 }}>Limit (₦)</Text>
            <TextInput
              value={limit}
              onChangeText={setLimit}
              placeholder="50000"
              placeholderTextColor={isDark ? '#999' : theme.textMuted}
              keyboardType="numeric"
              style={inputStyle}
            />

            <Text style={{ color: isDark ? '#ccc' : theme.textMuted, fontSize: 12, marginBottom: 4 }}>Due date (optional, YYYY-MM-DD)</Text>
            <TextInput
              value={dueDate}
              onChangeText={setDueDate}
              placeholder="2026-10-01"
              placeholderTextColor={isDark ? '#999' : theme.textMuted}
              style={inputStyle}
            />

            <TouchableOpacity
              onPress={handleSubmit}
              style={{ backgroundColor: theme.primary, borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 8 }}
            >
              <Text style={{ color: theme.onPrimary, fontWeight: '700' }}>{isEdit ? 'Save changes' : 'Create budget'}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}