import { useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useFocusEffect } from 'expo-router';
import {
  UtensilsCrossed,
  Car,
  Receipt,
  ShoppingBag,
  Film,
  HeartPulse,
  GraduationCap,
  MoreHorizontal,
  Banknote,
  Gift,
  TrendingUp,
  TrendingDown,
  Wallet,
} from 'lucide-react-native';
import { useTheme } from '../../src/theme/ThemeContext';
import { categoryColors } from '../../src/theme/colors';
import { getTransaction } from '../../src/api/transaction';

const CATEGORY_ICONS = {
  food: UtensilsCrossed,
  transport: Car,
  bills: Receipt,
  shopping: ShoppingBag,
  entertainment: Film,
  health: HeartPulse,
  education: GraduationCap,
  salary: Banknote,
  allowance: Gift,
  other: MoreHorizontal,
};

const EXTRA_COLORS = {
  salary: '#34D399',
  allowance: '#F472B6',
};

function getCategoryColor(key) {
  return categoryColors[key] || EXTRA_COLORS[key] || '#8395A7';
}

function normalizeCategory(cat) {
  if (!cat) return 'other';
  if (typeof cat === 'string') return cat.toLowerCase();
  if (cat.name) return cat.name.toLowerCase();
  return 'other';
}

function formatCurrency(amount, currency = 'NGN') {
  const symbols = { NGN: '₦', USD: '$', GBP: '£', EUR: '€' };
  const symbol = symbols[currency] || currency + ' ';
  return `${symbol}${Number(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) return 'Today';
  if (isYesterday) return 'Yesterday';
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}

function aggregateByCategory(transactions, type) {
  const totals = {};
  let total = 0;
  transactions
    .filter((t) => t.type === type)
    .forEach((t) => {
      const cat = normalizeCategory(t.category);
      totals[cat] = (totals[cat] || 0) + t.amount;
      total += t.amount;
    });
  return Object.entries(totals)
    .map(([category, amount]) => ({
      category,
      amount,
      pct: total > 0 ? (amount / total) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
}

export default function Transactions() {
  const { theme, isDark } = useTheme();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all' | 'income' | 'expense'

  const fetchTransactions = async () => {
    try {
      const res = await getTransaction();
      const list = Array.isArray(res) ? res : res?.transactions || res?.data || [];
      setTransactions(list);
    } catch (e) {
      console.log('Failed to load transactions', e?.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        setLoading(true);
        await fetchTransactions();
        if (active) setLoading(false);
      })();
      return () => { active = false; };
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  };

  const expenseBreakdown = useMemo(() => aggregateByCategory(transactions, 'expense'), [transactions]);
  const incomeBreakdown = useMemo(() => aggregateByCategory(transactions, 'income'), [transactions]);
  const topExpense = expenseBreakdown[0];
  const topIncome = incomeBreakdown[0];

  const filteredList = useMemo(() => {
    const list = filter === 'all' ? transactions : transactions.filter((t) => t.type === filter);
    return [...list].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, filter]);

  // Group filtered list by date label for section headers
  const grouped = useMemo(() => {
    const groups = [];
    let currentLabel = null;
    filteredList.forEach((t) => {
      const label = formatDate(t.date);
      if (label !== currentLabel) {
        groups.push({ label, items: [t] });
        currentLabel = label;
      } else {
        groups[groups.length - 1].items.push(t);
      }
    });
    return groups;
  }, [filteredList]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
        }
      >
        <View className="px-6 pt-16 pb-6">
          <Text style={{ color: theme.textPrimary }} className="text-2xl font-bold mb-1">
            Transactions
          </Text>
          <Text style={{ color: theme.textSecondary }} className="text-sm mb-6">
            Track where your money comes from and where it goes.
          </Text>

          {/* Insight cards: top expense + top income */}
          {(topExpense || topIncome) && (
            <View className="flex-row mb-6" style={{ gap: 12 }}>
              {topExpense && (
                <View
                  className="flex-1 rounded-2xl p-4"
                  style={{ backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border }}
                >
                  <View className="flex-row items-center mb-2">
                    <View
                      className="w-7 h-7 rounded-full items-center justify-center mr-2"
                      style={{ backgroundColor: isDark ? 'rgba(255,107,107,0.14)' : 'rgba(220,38,38,0.1)' }}
                    >
                      <TrendingDown size={14} color={theme.expense} />
                    </View>
                    <Text style={{ color: theme.textSecondary }} className="text-xs font-medium">
                      Top Expense
                    </Text>
                  </View>
                  <Text style={{ color: theme.textPrimary }} className="text-sm font-bold capitalize mb-0.5">
                    {topExpense.category}
                  </Text>
                  <Text style={{ color: theme.expense }} className="text-xs font-semibold">
                    {formatCurrency(topExpense.amount)} · {Math.round(topExpense.pct)}%
                  </Text>
                </View>
              )}

              {topIncome && (
                <View
                  className="flex-1 rounded-2xl p-4"
                  style={{ backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border }}
                >
                  <View className="flex-row items-center mb-2">
                    <View
                      className="w-7 h-7 rounded-full items-center justify-center mr-2"
                      style={{ backgroundColor: isDark ? 'rgba(16,230,143,0.14)' : 'rgba(5,150,105,0.1)' }}
                    >
                      <TrendingUp size={14} color={theme.income} />
                    </View>
                    <Text style={{ color: theme.textSecondary }} className="text-xs font-medium">
                      Top Income
                    </Text>
                  </View>
                  <Text style={{ color: theme.textPrimary }} className="text-sm font-bold capitalize mb-0.5">
                    {topIncome.category}
                  </Text>
                  <Text style={{ color: theme.income }} className="text-xs font-semibold">
                    {formatCurrency(topIncome.amount)} · {Math.round(topIncome.pct)}%
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Where your money goes — expense breakdown */}
          {expenseBreakdown.length > 0 && (
            <View
              className="rounded-2xl p-4 mb-6"
              style={{ backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border }}
            >
              <Text style={{ color: theme.textPrimary }} className="text-sm font-bold mb-4">
                Where your money goes
              </Text>
              {expenseBreakdown.slice(0, 5).map((item) => {
                const Icon = CATEGORY_ICONS[item.category] || MoreHorizontal;
                const color = getCategoryColor(item.category);
                return (
                  <View key={item.category} className="mb-3.5">
                    <View className="flex-row items-center justify-between mb-1.5">
                      <View className="flex-row items-center">
                        <View
                          className="w-6 h-6 rounded-full items-center justify-center mr-2"
                          style={{ backgroundColor: isDark ? `${color}26` : `${color}1A` }}
                        >
                          <Icon size={12} color={color} />
                        </View>
                        <Text style={{ color: theme.textPrimary }} className="text-xs font-semibold capitalize">
                          {item.category}
                        </Text>
                      </View>
                      <Text style={{ color: theme.textSecondary }} className="text-xs font-medium">
                        {formatCurrency(item.amount)}
                      </Text>
                    </View>
                    <View
                      className="w-full rounded-full overflow-hidden"
                      style={{ height: 5, backgroundColor: theme.divider }}
                    >
                      <View style={{ width: `${item.pct}%`, height: 5, backgroundColor: color, borderRadius: 999 }} />
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {/* Filter tabs */}
          <View
            className="flex-row rounded-2xl p-1 mb-5"
            style={{ backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border }}
          >
            {['all', 'income', 'expense'].map((key) => {
              const active = filter === key;
              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => setFilter(key)}
                  className="flex-1 py-2.5 rounded-xl items-center"
                  style={{ backgroundColor: active ? theme.primary : 'transparent' }}
                >
                  <Text
                    className="text-xs font-bold capitalize"
                    style={{ color: active ? theme.onPrimary : theme.textSecondary }}
                  >
                    {key}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Transaction list, grouped by date */}
          {grouped.length === 0 ? (
            <View
              className="rounded-2xl p-8 items-center"
              style={{ backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border }}
            >
              <Wallet size={28} color={theme.textMuted} style={{ marginBottom: 8 }} />
              <Text style={{ color: theme.textMuted }} className="text-sm">
                No transactions found
              </Text>
            </View>
          ) : (
            grouped.map((group) => (
              <View key={group.label} className="mb-5">
                <Text style={{ color: theme.textSecondary }} className="text-xs font-semibold mb-2.5 ml-1">
                  {group.label}
                </Text>
                {group.items.map((t) => {
                  const isIncome = t.type === 'income';
                  const catKey = normalizeCategory(t.category);
                  const Icon = CATEGORY_ICONS[catKey] || MoreHorizontal;
                  const color = getCategoryColor(catKey);
                  return (
                    <View
                      key={t._id}
                      className="flex-row items-center rounded-2xl p-4 mb-2.5"
                      style={{ backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border }}
                    >
                      <View
                        className="w-11 h-11 rounded-full items-center justify-center mr-3"
                        style={{ backgroundColor: isDark ? `${color}26` : `${color}1A` }}
                      >
                        <Icon size={18} color={color} />
                      </View>
                      <View className="flex-1">
                        <Text style={{ color: theme.textPrimary }} className="text-sm font-bold" numberOfLines={1}>
                          {t.description || t.title || 'Transaction'}
                        </Text>
                        <Text style={{ color: theme.textMuted }} className="text-xs mt-0.5 capitalize">
                          {catKey}
                        </Text>
                      </View>
                      <Text
                        style={{ color: isIncome ? theme.income : theme.expense }}
                        className="text-sm font-bold"
                      >
                        {isIncome ? '+' : '-'}{formatCurrency(t.amount)}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}