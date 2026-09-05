import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkTheme, lightTheme } from './colors';

const ThemeContext = createContext(undefined);
const STORAGE_KEY = 'theme_preference';

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true); // dark mode is the default
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (value !== null) setIsDark(value === 'dark');
      })
      .finally(() => setIsLoaded(true));
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    AsyncStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
  };

  const setTheme = (mode) => {
    const next = mode === 'dark';
    setIsDark(next);
    AsyncStorage.setItem(STORAGE_KEY, mode);
  };

  const theme = isDark ? darkTheme : lightTheme;

  // Avoid a flash of the wrong theme while AsyncStorage loads
  if (!isLoaded) return null;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};