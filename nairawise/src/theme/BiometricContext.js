// src/theme/BiometricContext.js  (or wherever ThemeContext lives)
import { createContext, useContext, useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

const BIOMETRIC_PREF_KEY = 'biometric_enabled';
const BiometricContext = createContext(null);

export function BiometricProvider({ children }) {
  const [isSupported, setIsSupported] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setIsSupported(compatible && enrolled);

      const savedPref = await SecureStore.getItemAsync(BIOMETRIC_PREF_KEY);
      setIsEnabled(savedPref === 'true');
      setLoading(false);
    })();
  }, []);

  const authenticate = async (promptMessage = 'Confirm your identity') => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      fallbackLabel: 'Use passcode',
      cancelLabel: 'Cancel',
    });
    return result.success;
  };

  const toggleBiometric = async (value) => {
    if (value) {
      // Require a successful scan before turning it ON
      const success = await authenticate('Enable fingerprint login');
      if (!success) return false;
    }
    await SecureStore.setItemAsync(BIOMETRIC_PREF_KEY, String(value));
    setIsEnabled(value);
    return true;
  };

  return (
    <BiometricContext.Provider
      value={{ isSupported, isEnabled, loading, authenticate, toggleBiometric }}
    >
      {children}
    </BiometricContext.Provider>
  );
}

export const useBiometric = () => useContext(BiometricContext);