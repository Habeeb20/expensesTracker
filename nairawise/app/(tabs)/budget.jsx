import { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Plus, ArrowLeft, PiggyBank } from 'lucide-react-native';
import { useTheme } from '../../src/theme/ThemeContext';
import { budgetApi } from '../../src/api/budgetApi';
import BudgetCard from '../../src/components/budget/BudgetCard';
import BudgetFormModal from '../../src/components/budget/BudgetFormModal';
import DeductBudgetModal from '../../src/components/budget/DeductModal';


export default function BudgetsScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [formVisible, setFormVisible] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [deductTarget, setDeductTarget] = useState(null);



const load = useCallback(async () => {
  try {
    const res = await budgetApi.getBudgets();
    setBudgets(res.budgets || []);
  } catch (err) {
    console.error('getBudgets failed:', err.response?.data || err.message);
    Alert.alert('Error', err.response?.data?.message || 'Could not load budgets.');
  }
}, []);


  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load().finally(() => setLoading(false));
    }, [load])
  );

const onRefresh = async () => {
  setRefreshing(true);
  await load();
  setRefreshing(false);
};

  const openCreate = () => {
    setEditingBudget(null);
    setFormVisible(true);
  };

  const openEdit = (budget) => {
    setEditingBudget(budget);
    setFormVisible(true);
  };

const handleFormSubmit = async (payload) => {
  try {
    if (editingBudget) {
      await budgetApi.editBudget(editingBudget._id, payload);
    } else {
      await budgetApi.createBudget(payload);
    }
    setFormVisible(false);
    load();
  } catch (err) {
    console.error('saveBudget failed:', err.response?.data || err.message);
    Alert.alert('Error', err.response?.data?.message || 'Could not save budget.');
  }
};

const handleDelete = (budget) => {
  Alert.alert('Delete budget', `Remove "${budget.category}"?`, [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Delete',
      style: 'destructive',
      onPress: async () => {
        try {
          await budgetApi.deleteBudget(budget._id);
          load();
        } catch (err) {
          console.error('deleteBudget failed:', err.response?.data || err.message);
          Alert.alert('Error', err.response?.data?.message || 'Could not delete budget.');
        }
      },
    },
  ]);
};

const handleDeductSubmit = async (payload) => {
  try {
    await budgetApi.deductBudget(deductTarget._id, payload);
    setDeductTarget(null);
    load();
  } catch (err) {
    console.error('deductBudget failed:', err.response?.data || err.message);
    Alert.alert('Error', err.response?.data?.message || 'Could not log spend.');
  }
};
  const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 56, gap: 12 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: '700', color: theme.text }}>Budgets</Text>
      </View>

      <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
        <View style={{ backgroundColor: theme.primary, borderRadius: 18, padding: 18 }}>
          <Text style={{ color: theme.onPrimary, opacity: 0.85, fontSize: 13 }}>Total budgeted</Text>
          <Text style={{ color: theme.onPrimary, fontSize: 26, fontWeight: '700', marginTop: 4 }}>
            ₦{totalLimit.toLocaleString()}
          </Text>
          <Text style={{ color: theme.onPrimary, opacity: 0.85, fontSize: 12, marginTop: 4 }}>
            ₦{totalSpent.toLocaleString()} spent so far
          </Text>
        </View>
      </View>

      <FlatList
        data={budgets}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />}
        ListEmptyComponent={
          !loading && (
            <View style={{ alignItems: 'center', marginTop: 60 }}>
              <Text style={{ color: theme.textMuted }}>No budgets yet. Create your first one.</Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <BudgetCard budget={item} onEdit={openEdit} onDelete={handleDelete} onDeduct={setDeductTarget} />
        )}
      />

      
<TouchableOpacity
  onPress={openCreate}
  style={{
    position: 'absolute',
    right: 20,
    bottom: 140, // was 24 — raised so it doesn't crowd the tab bar area
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  }}
>
   <PiggyBank size={24} color={theme.onPrimary} />
</TouchableOpacity>
      <BudgetFormModal
        visible={formVisible}
        initialBudget={editingBudget}
        onClose={() => setFormVisible(false)}
        onSubmit={handleFormSubmit}
      />
      <DeductBudgetModal
        visible={!!deductTarget}
        budget={deductTarget}
        onClose={() => setDeductTarget(null)}
        onSubmit={handleDeductSubmit}
      />
    </View>
  );
}
































