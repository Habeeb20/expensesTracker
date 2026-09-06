import {Tabs} from 'expo-router';

import {useTheme} from "../../src/theme/ThemeContext"
import { Home, Receipt, Plus, PieChart, Settings } from 'lucide-react-native';

export default function TabsLayout() {
    const { theme } = useTheme();

    return(
        <Tabs 
       
  screenOptions={{
    headerShown: false,
    tabBarActiveTintColor: theme.primary,
    tabBarInactiveTintColor: theme.textMuted,
    tabBarStyle: {
      backgroundColor: theme.surface,
      borderTopColor: theme.border,
      borderTopWidth: 1,
      height: 60,
      paddingBottom: 6,
      paddingTop: 6,
    },
    tabBarLabelStyle: {
      fontSize: 12,
      fontWeight: '600',
    },
    tabBarIconStyle: {
      marginTop: 4,
    },
    tabBarItemStyle: {
      paddingVertical: 6,
    },
  }}
>
            <Tabs.Screen name = "index" 
            options={{title: 'Home', tabBarIcon:({ color, size }) => <Home color={color} size={size} />}} />

                  <Tabs.Screen
        name="transactions"
        options={{ title: 'Transactions', tabBarIcon: ({ color, size }) => <Receipt color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="add"
        options={{ title: 'Add', tabBarIcon: ({ color, size }) => <Plus color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="reports"
        options={{ title: 'Reports', tabBarIcon: ({ color, size }) => <PieChart color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: 'Settings', tabBarIcon: ({ color, size }) => <Settings color={color} size={size} /> }}
      />

        </Tabs>
    )
}