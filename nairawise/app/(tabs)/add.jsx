import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { toast } from 'sonner-native';
import {
  UtensilsCrossed,
  Car,
  Receipt,
  ShoppingBag,
  Film,
  HeartPulse,
  GraduationCap,
  MoreHorizontal,
  ArrowUpCircle,
  ArrowDownCircle,
  MonitorCloud,
} from 'lucide-react-native';

import { useTheme } from '../../src/theme/ThemeContext';
import { categoryColors } from '../../src/theme/colors';
import { createTransaction } from '../../src/api/transaction';


const CATEGORIES = [
  { key: 'food', label: 'Food', icon: UtensilsCrossed },
  { key: 'allowance', label: 'Allowance', icon: UtensilsCrossed },
  { key: 'salary', label: 'Salary', icon: MonitorCloud },
  { key: 'transport', label: 'Transport', icon: Car },
  { key: 'bills', label: 'Bills', icon: Receipt },
  { key: 'shopping', label: 'Shopping', icon: ShoppingBag },
  { key: 'entertainment', label: 'Entertainment', icon: Film },
  { key: 'health', label: 'Health', icon: HeartPulse },
  { key: 'education', label: 'Education', icon: GraduationCap },
  { key: 'other', label: 'Other', icon: MoreHorizontal },
];

export default function AddTransaction() {
  const { theme, isDark } = useTheme();
  const router = useRouter();

  const [type, setType] = useState('expense'); // 'expense' | 'income'
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const numericAmount = Number(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      toast.error('Enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      await createTransaction({
        amount: numericAmount,
        type,
        category,
        description: description.trim(),
        date: new Date().toISOString(),
      });
      toast.success('Transaction added');
      setAmount('');
      setDescription('');
      router.push('/(tabs)');
    } catch (err) {
      console.log(err)
      const message = err?.response?.data?.message || 'Failed to add transaction';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-16 pb-10">
          <Text style={{ color: theme.textPrimary }} className="text-2xl font-bold mb-1">
            Add Transaction
          </Text>
          <Text style={{ color: theme.textSecondary }} className="text-sm mb-8">
            Log a new expense or income entry.
          </Text>

          {/* Type toggle */}
          <View
            className="flex-row rounded-2xl p-1 mb-6"
            style={{ backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border }}
          >
            <TouchableOpacity
              onPress={() => setType('expense')}
              className="flex-1 flex-row items-center justify-center py-3 rounded-xl gap-2"
              style={{ backgroundColor: type === 'expense' ? theme.expense : 'transparent' }}
            >
              <ArrowDownCircle
                size={16}
                color={type === 'expense' ? '#FFFFFF' : theme.textSecondary}
              />
              <Text
                className="text-sm font-bold"
                style={{ color: type === 'expense' ? '#FFFFFF' : theme.textSecondary }}
              >
                Expense
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setType('income')}
              className="flex-1 flex-row items-center justify-center py-3 rounded-xl gap-2"
              style={{ backgroundColor: type === 'income' ? theme.income : 'transparent' }}
            >
              <ArrowUpCircle
                size={16}
                color={type === 'income' ? theme.onPrimary : theme.textSecondary}
              />
              <Text
                className="text-sm font-bold"
                style={{ color: type === 'income' ? theme.onPrimary : theme.textSecondary }}
              >
                Income
              </Text>
            </TouchableOpacity>
          </View>

          {/* Amount */}
          <Text style={{ color: theme.textSecondary }} className="text-sm font-medium mb-2">
            Amount
          </Text>
          <View
            className="flex-row items-center rounded-2xl px-4 mb-6 border"
            style={{ backgroundColor: theme.surface, borderColor: theme.border, height: 64 }}
          >
            <Text style={{ color: theme.textMuted }} className="text-2xl font-bold mr-2">
              ₦
            </Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={theme.textMuted}
              keyboardType="decimal-pad"
              className="flex-1 text-2xl font-bold"
              style={{ color: theme.textPrimary }}
            />
          </View>

          {/* Category grid */}
          <Text style={{ color: theme.textSecondary }} className="text-sm font-medium mb-3">
            Category
          </Text>
          <View className="flex-row flex-wrap gap-3 mb-6">
            {CATEGORIES.map(({ key, label, icon: Icon }) => {
              const active = category === key;
              const color = categoryColors[key];
              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => setCategory(key)}
                  className="items-center rounded-2xl py-3 px-4 border"
                  style={{
                    width: '30%',
                    backgroundColor: active
                      ? (isDark ? `${color}26` : `${color}1A`)
                      : theme.surface,
                    borderColor: active ? color : theme.border,
                    borderWidth: active ? 1.5 : 1,
                  }}
                >
                  <Icon size={20} color={active ? color : theme.textMuted} />
                  <Text
                    className="text-xs font-semibold mt-1.5"
                    style={{ color: active ? theme.textPrimary : theme.textSecondary }}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Description */}
          <Text style={{ color: theme.textSecondary }} className="text-sm font-medium mb-2">
            Description (optional)
          </Text>
          <View
            className="rounded-2xl px-4 mb-8 border"
            style={{ backgroundColor: theme.surface, borderColor: theme.border }}
          >
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="e.g. Lunch with a friend"
              placeholderTextColor={theme.textMuted}
              multiline
              className="text-[15px] py-3.5"
              style={{ color: theme.textPrimary, minHeight: 50 }}
            />
          </View>

          {/* Submit */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className="rounded-2xl py-4 items-center"
            style={{ backgroundColor: theme.primary, opacity: loading ? 0.7 : 1 }}
          >
            <Text style={{ color: theme.onPrimary }} className="text-base font-bold">
              {loading ? 'Saving...' : 'Save Transaction'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}