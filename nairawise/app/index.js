


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
//   const value = Math.abs(amount).toLocaleString('en-NG');
//   return `${sign}₦${value}`;
// }

// export default function Home() {
//   const { theme, isDark } = useTheme();

//   return (
//     <View style={{ flex: 1, backgroundColor: theme.background }}>
//       <ScrollView
//         contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 60, paddingBottom: 40 }}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Header */}
//         <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
//           <View>
//             <Text style={{ color: theme.textSecondary, fontSize: 14 }}>Good evening,</Text>
//             <Text style={{ color: theme.textPrimary, fontSize: 22, fontWeight: '700', marginTop: 2 }}>
//               Habeeb
//             </Text>
//           </View>
//           <TouchableOpacity
//             style={{
//               width: 44,
//               height: 44,
//               borderRadius: 22,
//               backgroundColor: theme.surface,
//               alignItems: 'center',
//               justifyContent: 'center',
//               borderWidth: 1,
//               borderColor: theme.border,
//             }}
//           >
//             <Bell size={20} color={theme.textPrimary} />
//           </TouchableOpacity>
//         </View>

//         {/* Balance card */}
//         <View
//           style={{
//             backgroundColor: theme.surface,
//             borderRadius: 24,
//             padding: 24,
//             marginBottom: 20,
//             borderWidth: 1,
//             borderColor: theme.border,
//           }}
//         >
//           <Text style={{ color: theme.textSecondary, fontSize: 13, marginBottom: 8 }}>
//             Total balance
//           </Text>
//           <Text style={{ color: theme.textPrimary, fontSize: 36, fontWeight: '700', letterSpacing: -0.5 }}>
//             ₦248,650
//           </Text>

//           <View style={{ flexDirection: 'row', marginTop: 24, gap: 12 }}>
//             <View
//               style={{
//                 flex: 1,
//                 backgroundColor: isDark ? 'rgba(16, 230, 143, 0.1)' : 'rgba(5, 150, 105, 0.08)',
//                 borderRadius: 16,
//                 padding: 14,
//               }}
//             >
//               <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
//                 <ArrowUpRight size={16} color={theme.income} />
//                 <Text style={{ color: theme.textSecondary, fontSize: 12 }}>Income</Text>
//               </View>
//               <Text style={{ color: theme.income, fontSize: 17, fontWeight: '600' }}>
//                 ₦85,000
//               </Text>
//             </View>

//             <View
//               style={{
//                 flex: 1,
//                 backgroundColor: isDark ? 'rgba(255, 107, 107, 0.1)' : 'rgba(220, 38, 38, 0.08)',
//                 borderRadius: 16,
//                 padding: 14,
//               }}
//             >
//               <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
//                 <ArrowDownRight size={16} color={theme.expense} />
//                 <Text style={{ color: theme.textSecondary, fontSize: 12 }}>Expenses</Text>
//               </View>
//               <Text style={{ color: theme.expense, fontSize: 17, fontWeight: '600' }}>
//                 ₦20,200
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* Add transaction button */}
//         <TouchableOpacity
//           style={{
//             backgroundColor: theme.primary,
//             borderRadius: 18,
//             paddingVertical: 16,
//             flexDirection: 'row',
//             alignItems: 'center',
//             justifyContent: 'center',
//             gap: 8,
//             marginBottom: 32,
//           }}
//         >
//           <Plus size={20} color={isDark ? '#0D0F12' : '#FFFFFF'} />
//           <Text style={{ color: isDark ? '#0D0F12' : '#FFFFFF', fontSize: 16, fontWeight: '700' }}>
//             Add transaction
//           </Text>
//         </TouchableOpacity>

//         {/* Recent transactions */}
//         <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
//           <Text style={{ color: theme.textPrimary, fontSize: 18, fontWeight: '700' }}>
//             Recent activity
//           </Text>
//           <TouchableOpacity>
//             <Text style={{ color: theme.primary, fontSize: 14, fontWeight: '600' }}>See all</Text>
//           </TouchableOpacity>
//         </View>

//         {recentTransactions.map((tx) => (
//           <View
//             key={tx.id}
//             style={{
//               flexDirection: 'row',
//               alignItems: 'center',
//               paddingVertical: 14,
//               borderBottomWidth: 1,
//               borderBottomColor: theme.divider,
//             }}
//           >
//             <View
//               style={{
//                 width: 10,
//                 height: 10,
//                 borderRadius: 5,
//                 backgroundColor: categoryDots[tx.category] || theme.textMuted,
//                 marginRight: 14,
//               }}
//             />
//             <View style={{ flex: 1 }}>
//               <Text style={{ color: theme.textPrimary, fontSize: 15, fontWeight: '600' }}>
//                 {tx.title}
//               </Text>
//               <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}>
//                 {tx.category} · {tx.date}
//               </Text>
//             </View>
//             <Text
//               style={{
//                 color: tx.amount < 0 ? theme.expense : theme.income,
//                 fontSize: 15,
//                 fontWeight: '700',
//               }}
//             >
//               {formatNaira(tx.amount)}
//             </Text>
//           </View>
//         ))}
//       </ScrollView>
//     </View>
//   );
// }





import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, PieChart, Shield, ArrowUpRight, Eye } from 'lucide-react-native';
import { useTheme } from '../src/theme/ThemeContext';

const features = [
  { icon: TrendingUp, label: 'Track spending in real time' },
  { icon: PieChart, label: 'See where your money goes' },
  { icon: Shield, label: 'Bank-level data security' },
];

export default function Welcome() {
  const { theme, isDark } = useTheme();
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Ambient glow behind the card */}
      <View
        style={{
          position: 'absolute',
          top: -80,
          left: -60,
          width: 320,
          height: 320,
          borderRadius: 160,
          backgroundColor: theme.primary,
          opacity: isDark ? 0.16 : 0.1,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: 120,
          right: -100,
          width: 260,
          height: 260,
          borderRadius: 130,
          backgroundColor: theme.secondary,
          opacity: isDark ? 0.14 : 0.08,
        }}
      />

      <View className="flex-1 px-6 pt-16 pb-10 justify-between">
        <View>
          {/* Brand mark */}
          <Text style={{ color: theme.textPrimary }} className="text-lg font-bold mb-8">
            NairaWise
          </Text>

          {/* Floating card mockup */}
          <LinearGradient
            colors={[theme.primary, theme.primaryMuted]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 24,
              padding: 22,
              marginBottom: 32,
              shadowColor: theme.primary,
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: isDark ? 0.35 : 0.2,
              shadowRadius: 24,
              elevation: 10,
            }}
          >
            <View className="flex-row justify-between items-start mb-8">
              <Text style={{ color: theme.onPrimary }} className="text-xs opacity-80">
                Total balance
              </Text>
              <Eye size={16} color={theme.onPrimary} style={{ opacity: 0.8 }} />
            </View>
            <Text style={{ color: theme.onPrimary }} className="text-[30px] font-bold mb-5">
              ₦248,650.00
            </Text>
            <View className="flex-row justify-between items-center">
              <View>
                <Text style={{ color: theme.onPrimary }} className="text-[11px] mb-0.5 opacity-70">
                  This month
                </Text>
                <View className="flex-row items-center gap-1">
                  <ArrowUpRight size={13} color={theme.onPrimary} />
                  <Text style={{ color: theme.onPrimary }} className="text-xs font-semibold">
                    +18.2%
                  </Text>
                </View>
              </View>
              <View className="flex-row gap-1">
                {[0.4, 0.7, 0.5, 0.9, 0.6, 1].map((h, i) => (
                  <View
                    key={i}
                    style={{
                      width: 4,
                      height: 24 * h,
                      borderRadius: 2,
                      backgroundColor: theme.onPrimary,
                      opacity: 0.85,
                      alignSelf: 'flex-end',
                    }}
                  />
                ))}
              </View>
            </View>
          </LinearGradient>

          {/* Hero copy */}
          <Text
            style={{ color: theme.textPrimary }}
            className="text-[32px] font-bold leading-[38px] mb-3"
          >
            Money clarity,{'\n'}finally.
          </Text>
          <Text
            style={{ color: theme.textSecondary }}
            className="text-base leading-6 mb-9 pr-8"
          >
            Track spending, manage income, and build better money habits — all in one place.
          </Text>

          {/* Feature list */}
          <View className="gap-4">
            {features.map(({ icon: Icon, label }, index) => (
              <View key={index} className="flex-row items-center gap-3.5">
                <View
                  className="w-9 h-9 rounded-full items-center justify-center"
                  style={{ backgroundColor: theme.primaryMuted, opacity: isDark ? 1 : 0.9 }}
                >
                  <Icon size={16} color={theme.onPrimary} />
                </View>
                <Text style={{ color: theme.textPrimary }} className="text-[15px] flex-1">
                  {label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* CTAs */}
        <View className="gap-3 mt-10">
          <TouchableOpacity
            className="rounded-2xl py-4 items-center"
            style={{ backgroundColor: theme.primary }}
            onPress={() => router.push('/register')}
          >
            <Text style={{ color: theme.onPrimary }} className="text-base font-bold">
              Get started
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="rounded-2xl py-4 items-center border"
            style={{ borderColor: theme.border }}
            onPress={() => router.push('/login')}
          >
            <Text style={{ color: theme.textPrimary }} className="text-base font-semibold">
              I already have an account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}