// import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
// import { ArrowUpRight, ArrowDownRight, Plus, Bell } from 'lucide-react-native';

// import { useTheme } from './src/theme/ThemeContext';
// import { categoryColors } from './src/theme/colors';

// const recentTransactions = [
//   { id: '1', title: 'Grocery run', category: 'Food', amount: -12500, date: 'Today' },
//   { id: '2', title: 'Freelance payment', category: 'Income', amount: 85000, date: 'Today' },
//   { id: '3', title: 'Uber to office', category: 'Transport', amount: -3200, date: 'Yesterday' },
//   { id: '4', title: 'Netflix', category: 'Entertainment', amount: -4500, date: 'Yesterday' },
// ];

// const categoryDots = {
//   Food: categoryColors.food,
//   Income: categoryColors.other,
//   Transport: categoryColors.transport,
//   Entertainment: categoryColors.entertainment,
// };

// function formatNaira(amount) {
//   const sign = amount < 0 ? '-' : '+';
//   return `${sign}₦${Math.abs(amount).toLocaleString('en-NG')}`;
// }

// export default function Home() {
//   const { theme, isDark } = useTheme();

//   return (
//     <View className="flex-1" style={{ backgroundColor: theme.background }}>
//       <ScrollView
//         className="px-5 pt-16 pb-10"
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Header */}
//         <View className="flex-row justify-between items-center mb-7">
//           <View>
//             <Text style={{ color: theme.textSecondary }} className="text-sm">
//               Good evening,
//             </Text>
//             <Text style={{ color: theme.textPrimary }} className="text-2xl font-bold mt-0.5">
//               Habeeb
//             </Text>
//           </View>
//           <TouchableOpacity
//             className="w-11 h-11 rounded-full items-center justify-center border"
//             style={{ backgroundColor: theme.surface, borderColor: theme.border }}
//           >
//             <Bell size={20} color={theme.textPrimary} />
//           </TouchableOpacity>
//         </View>

//         {/* Balance card */}
//         <View
//           className="rounded-3xl p-6 mb-5 border"
//           style={{ backgroundColor: theme.surface, borderColor: theme.border }}
//         >
//           <Text style={{ color: theme.textSecondary }} className="text-sm mb-2">
//             Total balance
//           </Text>
//           <Text style={{ color: theme.textPrimary }} className="text-4xl font-bold tracking-tight">
//             ₦248,650
//           </Text>

//           <View className="flex-row mt-6 gap-3">
//             <View
//               className="flex-1 rounded-2xl p-3.5"
//               style={{ backgroundColor: isDark ? 'rgba(16, 230, 143, 0.1)' : 'rgba(5, 150, 105, 0.08)' }}
//             >
//               <View className="flex-row items-center gap-1.5 mb-1.5">
//                 <ArrowUpRight size={16} color={theme.income} />
//                 <Text style={{ color: theme.textSecondary }} className="text-xs">Income</Text>
//               </View>
//               <Text style={{ color: theme.income }} className="text-lg font-semibold">
//                 ₦85,000
//               </Text>
//             </View>

//             <View
//               className="flex-1 rounded-2xl p-3.5"
//               style={{ backgroundColor: isDark ? 'rgba(255, 107, 107, 0.1)' : 'rgba(220, 38, 38, 0.08)' }}
//             >
//               <View className="flex-row items-center gap-1.5 mb-1.5">
//                 <ArrowDownRight size={16} color={theme.expense} />
//                 <Text style={{ color: theme.textSecondary }} className="text-xs">Expenses</Text>
//               </View>
//               <Text style={{ color: theme.expense }} className="text-lg font-semibold">
//                 ₦20,200
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* Add transaction button */}
//         <TouchableOpacity
//           className="rounded-2xl py-4 flex-row items-center justify-center gap-2 mb-8"
//           style={{ backgroundColor: theme.primary }}
//         >
//           <Plus size={20} color={isDark ? '#0D0F12' : '#FFFFFF'} />
//           <Text
//             className="text-base font-bold"
//             style={{ color: isDark ? '#0D0F12' : '#FFFFFF' }}
//           >
//             Add transaction
//           </Text>
//         </TouchableOpacity>

//         {/* Recent transactions */}
//         <View className="flex-row justify-between items-center mb-4">
//           <Text style={{ color: theme.textPrimary }} className="text-lg font-bold">
//             Recent activity
//           </Text>
//           <TouchableOpacity>
//             <Text style={{ color: theme.primary }} className="text-sm font-semibold">
//               See all
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {recentTransactions.map((tx) => (
//           <View
//             key={tx.id}
//             className="flex-row items-center py-3.5 border-b"
//             style={{ borderBottomColor: theme.divider }}
//           >
//             <View
//               className="w-2.5 h-2.5 rounded-full mr-3.5"
//               style={{ backgroundColor: categoryDots[tx.category] || theme.textMuted }}
//             />
//             <View className="flex-1">
//               <Text style={{ color: theme.textPrimary }} className="text-[15px] font-semibold">
//                 {tx.title}
//               </Text>
//               <Text style={{ color: theme.textSecondary }} className="text-[13px] mt-0.5">
//                 {tx.category} · {tx.date}
//               </Text>
//             </View>
//             <Text
//               className="text-[15px] font-bold"
//               style={{ color: tx.amount < 0 ? theme.expense : theme.income }}
//             >
//               {formatNaira(tx.amount)}
//             </Text>
//           </View>
//         ))}
//       </ScrollView>
//     </View>
//   );
// }



import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowUpRight, ArrowDownRight, Plus, Bell } from 'lucide-react-native';
import { useTheme } from './src/theme/ThemeContext';
import { categoryColors } from './src/theme/colors';

const recentTransactions = [
  { id: '1', title: 'Grocery run', category: 'Food', amount: -12500, date: 'Today' },
  { id: '2', title: 'Freelance payment', category: 'Income', amount: 85000, date: 'Today' },
  { id: '3', title: 'Uber to office', category: 'Transport', amount: -3200, date: 'Yesterday' },
  { id: '4', title: 'Netflix', category: 'Entertainment', amount: -4500, date: 'Yesterday' },
];

const categoryDots = {
  Food: categoryColors.food,
  Income: categoryColors.other,
  Transport: categoryColors.transport,
  Entertainment: categoryColors.entertainment,
};

function formatNaira(amount) {
  const sign = amount < 0 ? '-' : '+';
  const value = Math.abs(amount).toLocaleString('en-NG');
  return `${sign}₦${value}`;
}

export default function Home() {
  const { theme, isDark } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 60, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <View>
            <Text style={{ color: theme.textSecondary, fontSize: 14 }}>Good evening,</Text>
            <Text style={{ color: theme.textPrimary, fontSize: 22, fontWeight: '700', marginTop: 2 }}>
              Habeeb
            </Text>
          </View>
          <TouchableOpacity
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: theme.surface,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: theme.border,
            }}
          >
            <Bell size={20} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Balance card */}
        <View
          style={{
            backgroundColor: theme.surface,
            borderRadius: 24,
            padding: 24,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: theme.border,
          }}
        >
          <Text style={{ color: theme.textSecondary, fontSize: 13, marginBottom: 8 }}>
            Total balance
          </Text>
          <Text style={{ color: theme.textPrimary, fontSize: 36, fontWeight: '700', letterSpacing: -0.5 }}>
            ₦248,650
          </Text>

          <View style={{ flexDirection: 'row', marginTop: 24, gap: 12 }}>
            <View
              style={{
                flex: 1,
                backgroundColor: isDark ? 'rgba(16, 230, 143, 0.1)' : 'rgba(5, 150, 105, 0.08)',
                borderRadius: 16,
                padding: 14,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <ArrowUpRight size={16} color={theme.income} />
                <Text style={{ color: theme.textSecondary, fontSize: 12 }}>Income</Text>
              </View>
              <Text style={{ color: theme.income, fontSize: 17, fontWeight: '600' }}>
                ₦85,000
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: isDark ? 'rgba(255, 107, 107, 0.1)' : 'rgba(220, 38, 38, 0.08)',
                borderRadius: 16,
                padding: 14,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <ArrowDownRight size={16} color={theme.expense} />
                <Text style={{ color: theme.textSecondary, fontSize: 12 }}>Expenses</Text>
              </View>
              <Text style={{ color: theme.expense, fontSize: 17, fontWeight: '600' }}>
                ₦20,200
              </Text>
            </View>
          </View>
        </View>

        {/* Add transaction button */}
        <TouchableOpacity
          style={{
            backgroundColor: theme.primary,
            borderRadius: 18,
            paddingVertical: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 32,
          }}
        >
          <Plus size={20} color={isDark ? '#0D0F12' : '#FFFFFF'} />
          <Text style={{ color: isDark ? '#0D0F12' : '#FFFFFF', fontSize: 16, fontWeight: '700' }}>
            Add transaction
          </Text>
        </TouchableOpacity>

        {/* Recent transactions */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ color: theme.textPrimary, fontSize: 18, fontWeight: '700' }}>
            Recent activity
          </Text>
          <TouchableOpacity>
            <Text style={{ color: theme.primary, fontSize: 14, fontWeight: '600' }}>See all</Text>
          </TouchableOpacity>
        </View>

        {recentTransactions.map((tx) => (
          <View
            key={tx.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 14,
              borderBottomWidth: 1,
              borderBottomColor: theme.divider,
            }}
          >
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: categoryDots[tx.category] || theme.textMuted,
                marginRight: 14,
              }}
            />
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.textPrimary, fontSize: 15, fontWeight: '600' }}>
                {tx.title}
              </Text>
              <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}>
                {tx.category} · {tx.date}
              </Text>
            </View>
            <Text
              style={{
                color: tx.amount < 0 ? theme.expense : theme.income,
                fontSize: 15,
                fontWeight: '700',
              }}
            >
              {formatNaira(tx.amount)}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}