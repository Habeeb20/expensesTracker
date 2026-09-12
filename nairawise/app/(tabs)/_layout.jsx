


import { Tabs } from 'expo-router';
import { View, TouchableOpacity } from 'react-native';
import { Home, Receipt, Plus, PieChart, Settings } from 'lucide-react-native';
import { useTheme } from '../../src/theme/ThemeContext';
import VoiceQuickAdd from '../../src/components/VoiceQuickAdd';

import NairaWiseAIChat from '../../src/components/NairawiseAIChat';
import ReceiptScanButton from '../../src/components/ReceiptScannerButton';

function FloatingAddButton({ onPress }) {
  const { theme, isDark } = useTheme();
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', top: -22 }}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        style={{
          width: 58,
          height: 58,
          borderRadius: 29,
          backgroundColor: theme.primary,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: theme.primary,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.4,
          shadowRadius: 12,
          elevation: 8,
          borderWidth: 4,
          borderColor: theme.background,
        }}
      >
        <Plus size={26} color={theme.onPrimary} strokeWidth={2.5} />
      </TouchableOpacity>
    </View>
  );
}

export default function TabsLayout() {
  const { theme } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.textMuted,
          tabBarStyle: {
            backgroundColor: theme.surface,
            borderTopColor: theme.border,
            borderTopWidth: 1,
            height: 64,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{ title: 'Home', tabBarIcon: ({ color, size }) => <Home color={color} size={size} /> }}
        />
        <Tabs.Screen
          name="transactions"
          options={{ title: 'Transactions', tabBarIcon: ({ color, size }) => <Receipt color={color} size={size} /> }}
        />
          <Tabs.Screen
          name="todo"
          options={{ title: 'Todo', tabBarIcon: ({ color, size }) => <PieChart color={color} size={size} /> }}
        />
        <Tabs.Screen
          name="add"
          options={{
            title: '',
            tabBarIcon: () => null,
            tabBarButton: (props) => <FloatingAddButton onPress={props.onPress} />,
          }}
        />
        <Tabs.Screen
          name="availability"
          options={{ title: 'Calender', tabBarIcon: ({ color, size }) => <PieChart color={color} size={size} /> }}
        />
      
        <Tabs.Screen
          name="settings"
          options={{ title: 'Settings', tabBarIcon: ({ color, size }) => <Settings color={color} size={size} /> }}
        />
      </Tabs>

      {/* Floating AI chat overlay — sits above the tab bar on every tab */}
      <VoiceQuickAdd />
      <NairaWiseAIChat />

      <ReceiptScanButton />
    </View>
  );
}