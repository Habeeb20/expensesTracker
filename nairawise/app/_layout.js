import { Slot } from "expo-router";
import '../global.css';
import { ThemeProvider } from "../src/theme/ThemeContext";
import { Toaster } from 'sonner-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { G } from "react-native-svg";
export default function RootLayout() {

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <ThemeProvider>
      <Slot />
      <Toaster />
    </ThemeProvider>
    </GestureHandlerRootView>
  )


}