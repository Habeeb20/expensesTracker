import { View, Text } from 'react-native';
import { useTheme } from '../../src/theme/ThemeContext';

export default function Add() {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.background, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: theme.textPrimary }}>Add Transaction</Text>
    </View>
  );
}
