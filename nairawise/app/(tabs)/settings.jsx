import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { Moon, Sun } from 'lucide-react-native';
import { useTheme } from '../../src/theme/ThemeContext';

export default function Settings() {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }} className="px-6 pt-16">
      <Text style={{ color: theme.textPrimary }} className="text-2xl font-bold mb-8">
        Settings
      </Text>

      <View
        className="flex-row items-center justify-between rounded-2xl p-4"
        style={{ backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border }}
      >
        <View className="flex-row items-center">
          <View
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: theme.primaryMuted }}
          >
            {isDark ? (
              <Moon size={18} color={theme.onPrimary} />
            ) : (
              <Sun size={18} color={theme.onPrimary} />
            )}
          </View>
          <View>
            <Text style={{ color: theme.textPrimary }} className="text-[15px] font-semibold">
              Dark mode
            </Text>
            <Text style={{ color: theme.textSecondary }} className="text-xs mt-0.5">
              {isDark ? 'On' : 'Off'}
            </Text>
          </View>
        </View>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: theme.border, true: theme.primaryMuted }}
          thumbColor={theme.primary}
        />
      </View>
    </View>
  );
}