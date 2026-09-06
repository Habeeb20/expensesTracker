import { Slot } from "expo-router";
import '../global.css';
import { ThemeProvider } from "../src/theme/ThemeContext";

export default function RootLayout() {

  return (
    <ThemeProvider>
      <Slot />
    </ThemeProvider>
  )


}