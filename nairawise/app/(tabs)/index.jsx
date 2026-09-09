import { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  ChevronRight,
  Eye,
  EyeOff,
  UtensilsCrossed,
  Car,
  Receipt,
  ShoppingBag,
  Film,
  HeartPulse,
  GraduationCap,
  MoreHorizontal,
} from 'lucide-react-native';
import { useTheme } from '../../src/theme/ThemeContext';
import { categoryColors } from '../../src/theme/colors';
import apiClient from '../../src/api/client';

const CATEGORY_ICONS = {
  food: UtensilsCrossed,
  transport: Car,
  bills: Receipt,
  shopping: ShoppingBag,
  entertainment: Film,
  health: HeartPulse,
  education: GraduationCap,
  other: MoreHorizontal,
};

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
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Home() {
  const { theme, isDark } = useTheme();
  const router = useRouter();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [balanceHidden, setBalanceHidden] = useState(false);

  const fetchDashboard = async () => {
    try {
      const { data: res } = await apiClient.get('/api/user/dashboard');
      setData(res);

    } catch (e) {
      console.log('Failed to load dashboard', e?.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        setLoading(true);
        await fetchDashboard();
        if (active) setLoading(false);
      })();
      return () => { active = false; };
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboard();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  const user = data?.user || {};
  const summary = data?.summary || { balance: 0, income: 0, expense: 0 };
  const recent = data?.recent || [];
  const budgets = data?.budgets || [];
  const currency = user.currency || 'NGN';
  const firstName = (user.name || '').split(' ')[0] || 'there';

  // Simple income-vs-expense ratio for a visual "spend rate" indicator
  const totalFlow = summary.income + summary.expense;
  const expenseRatio = totalFlow > 0 ? Math.min((summary.expense / totalFlow) * 100, 100) : 0;

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
          {/* Header */}
          <View className="flex-row items-center justify-between mb-8">
            <View>
              <Text style={{ color: theme.textSecondary }} className="text-sm mb-1">
                {getGreeting()}
              </Text>
              <Text style={{ color: theme.textPrimary }} className="text-2xl font-bold">
                {firstName} 👋
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/profile')}
              className="w-11 h-11 rounded-full items-center justify-center"
              style={{ backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border }}
            >
              <Text style={{ color: theme.textPrimary }} className="text-base font-bold">
                {firstName.charAt(0).toUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Balance card */}
          <LinearGradient
            colors={[theme.primary, theme.primaryMuted]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 24,
              padding: 24,
              marginBottom: 24,
              shadowColor: theme.primary,
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: isDark ? 0.35 : 0.2,
              shadowRadius: 20,
              elevation: 8,
            }}
          >
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center">
                <Wallet size={16} color={theme.onPrimary} style={{ opacity: 0.85 }} />
                <Text style={{ color: theme.onPrimary, opacity: 0.85 }} className="text-sm ml-2 font-medium">
                  Total Balance
                </Text>
              </View>
              <TouchableOpacity onPress={() => setBalanceHidden((v) => !v)} hitSlop={8}>
                {balanceHidden ? (
                  <EyeOff size={18} color={theme.onPrimary} style={{ opacity: 0.85 }} />
                ) : (
                  <Eye size={18} color={theme.onPrimary} style={{ opacity: 0.85 }} />
                )}
              </TouchableOpacity>
            </View>

            <Text style={{ color: theme.onPrimary }} className="text-[36px] font-extrabold mb-6 tracking-tight">
              {balanceHidden ? '₦ • • • • • •' : formatCurrency(summary.balance, currency)}
            </Text>

            <View className="flex-row mb-5" style={{ gap: 12 }}>
              <View className="flex-1 rounded-2xl p-3.5" style={{ backgroundColor: 'rgba(255,255,255,0.14)' }}>
                <View className="flex-row items-center mb-1.5">
                  <View
                    className="w-6 h-6 rounded-full items-center justify-center mr-1.5"
                    style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                  >
                    <ArrowDownRight size={12} color={theme.onPrimary} />
                  </View>
                  <Text style={{ color: theme.onPrimary, opacity: 0.85 }} className="text-xs">
                    Income
                  </Text>
                </View>
                <Text style={{ color: theme.onPrimary }} className="text-base font-bold">
                  {balanceHidden ? '••••' : formatCurrency(summary.income, currency)}
                </Text>
              </View>
              <View className="flex-1 rounded-2xl p-3.5" style={{ backgroundColor: 'rgba(255,255,255,0.14)' }}>
                <View className="flex-row items-center mb-1.5">
                  <View
                    className="w-6 h-6 rounded-full items-center justify-center mr-1.5"
                    style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                  >
                    <ArrowUpRight size={12} color={theme.onPrimary} />
                  </View>
                  <Text style={{ color: theme.onPrimary, opacity: 0.85 }} className="text-xs">
                    Expense
                  </Text>
                </View>
                <Text style={{ color: theme.onPrimary }} className="text-base font-bold">
                  {balanceHidden ? '••••' : formatCurrency(summary.expense, currency)}
                </Text>
              </View>
            </View>

            {/* Spend-rate bar */}
            {totalFlow > 0 && (
              <View>
                <View className="flex-row justify-between mb-1.5">
                  <Text style={{ color: theme.onPrimary, opacity: 0.75 }} className="text-[11px]">
                    Spend rate
                  </Text>
                  <Text style={{ color: theme.onPrimary, opacity: 0.9 }} className="text-[11px] font-bold">
                    {Math.round(expenseRatio)}%
                  </Text>
                </View>
                <View
                  className="w-full rounded-full overflow-hidden"
                  style={{ height: 5, backgroundColor: 'rgba(255,255,255,0.2)' }}
                >
                  <View
                    style={{
                      width: `${expenseRatio}%`,
                      height: 5,
                      backgroundColor: theme.onPrimary,
                      borderRadius: 999,
                    }}
                  />
                </View>
              </View>
            )}
          </LinearGradient>

          {/* Quick action */}
          <TouchableOpacity
            onPress={() => router.push('/add')}
            className="flex-row items-center justify-center rounded-2xl py-4 mb-8 border"
            style={{ borderColor: theme.border, borderStyle: 'dashed' }}
          >
            <Plus size={18} color={theme.primary} />
            <Text style={{ color: theme.primary }} className="text-sm font-bold ml-2">
              Add Transaction
            </Text>
          </TouchableOpacity>

          {/* Budgets */}
          {budgets.length > 0 && (
            <View className="mb-8">
              <View className="flex-row items-center justify-between mb-4">
                <Text style={{ color: theme.textPrimary }} className="text-lg font-bold">
                  Budgets
                </Text>
                <TouchableOpacity onPress={() => router.push('/budgets')} className="flex-row items-center">
                  <Text style={{ color: theme.textSecondary }} className="text-sm mr-1">
                    See all
                  </Text>
                  <ChevronRight size={14} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>

              {budgets.slice(0, 3).map((b, idx) => {
                const pct = b.limit > 0 ? Math.min((b.spent / b.limit) * 100, 100) : 0;
                const barColor = categoryColors[b.category] || theme.primary;
                const overBudget = b.spent > b.limit;
                return (
                  <View
                    key={idx}
                    className="rounded-2xl p-4 mb-3"
                    style={{ backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border }}
                  >
                    <View className="flex-row items-center justify-between mb-2">
                      <Text style={{ color: theme.textPrimary }} className="text-sm font-bold capitalize">
                        {b.category}
                      </Text>
                      <Text
                        style={{ color: overBudget ? theme.expense : theme.textSecondary }}
                        className="text-xs font-medium"
                      >
                        {formatCurrency(b.spent, currency)} / {formatCurrency(b.limit, currency)}
                      </Text>
                    </View>
                    <View
                      className="w-full rounded-full overflow-hidden"
                      style={{ height: 6, backgroundColor: theme.divider }}
                    >
                      <View
                        style={{
                          width: `${pct}%`,
                          height: 6,
                          backgroundColor: overBudget ? theme.expense : barColor,
                          borderRadius: 999,
                        }}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {/* Recent transactions */}
          <View className="flex-row items-center justify-between mb-4">
            <Text style={{ color: theme.textPrimary }} className="text-lg font-bold">
              Recent Transactions
            </Text>
            <TouchableOpacity onPress={() => router.push('/transactions')} className="flex-row items-center">
              <Text style={{ color: theme.textSecondary }} className="text-sm mr-1">
                See all
              </Text>
              <ChevronRight size={14} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {recent.length === 0 ? (
            <View
              className="rounded-2xl p-8 items-center"
              style={{ backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border }}
            >
              <Wallet size={28} color={theme.textMuted} style={{ marginBottom: 8 }} />
              <Text style={{ color: theme.textMuted }} className="text-sm">
                No transactions yet
              </Text>
            </View>
          ) : (
            recent.map((t) => {
              const isIncome = t.type === 'income';
              const Icon = CATEGORY_ICONS[t.category] || MoreHorizontal;
              const iconColor = categoryColors[t.category] || theme.textMuted;
              return (
                <View
                  key={t._id}
                  className="flex-row items-center rounded-2xl p-4 mb-3"
                  style={{ backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border }}
                >
                  <View
                    className="w-11 h-11 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: isDark ? `${iconColor}26` : `${iconColor}1A` }}
                  >
                    <Icon size={18} color={iconColor} />
                  </View>
                  <View className="flex-1">
                    <Text style={{ color: theme.textPrimary }} className="text-sm font-bold" numberOfLines={1}>
                      {t.title}
                    </Text>
                    <Text style={{ color: theme.textMuted }} className="text-xs mt-0.5">
                      {formatDate(t.date)}
                    </Text>
                  </View>
                  <Text
                    style={{ color: isIncome ? theme.income : theme.expense }}
                    className="text-sm font-bold"
                  >
                    {balanceHidden ? '••••' : `${isIncome ? '+' : '-'}${formatCurrency(t.amount, currency)}`}
                  </Text>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}