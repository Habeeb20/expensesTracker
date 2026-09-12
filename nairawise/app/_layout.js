import { Slot } from "expo-router";
import '../global.css';
import { ThemeProvider } from "../src/theme/ThemeContext";
import { Toaster } from 'sonner-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { G } from "react-native-svg";
import { BiometricProvider } from "../src/theme/BiometricContext";
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { registerForNotificationsAsync } from "../src/notifications/setups";
import { useEffect } from "react";



export default function RootLayout() {

  useEffect(() => {
  registerForNotificationsAsync();
}, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
 <ThemeProvider>
        <BiometricProvider>
          <Slot />
          <Toaster />
        </BiometricProvider>

      </ThemeProvider>
      </BottomSheetModalProvider>
     
    </GestureHandlerRootView>
  )


}