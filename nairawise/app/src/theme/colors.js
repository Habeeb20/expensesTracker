// src/theme/colors.js

export const darkTheme = {
  // Backgrounds
  background: '#0D0F12',
  surface: '#1A1D21',
  surfaceElevated: '#22262B',

  // Brand
  primary: '#10E68F',
  primaryMuted: '#0FA76B',
  secondary: '#7C5CFC',
  secondaryMuted: '#5B3FD1',

  // Text
  textPrimary: '#F5F5F7',
  textSecondary: '#8B8D93',
  textMuted: '#5C5E63',

  // Transaction semantics
  income: '#10E68F',
  expense: '#FF6B6B',
  pending: '#FFB020',

  // UI elements
  border: '#2A2D31',
  divider: '#22262B',
  overlay: 'rgba(0, 0, 0, 0.6)',

  // Status
  success: '#10E68F',
  error: '#FF4D4D',
  warning: '#FFB020',
  info: '#5B9CFC',
};

export const lightTheme = {
  // Backgrounds
  background: '#FAFAFA',
  surface: '#FFFFFF',
  surfaceElevated: '#F0F0F2',

  // Brand
  primary: '#059669',
  primaryMuted: '#047857',
  secondary: '#6D28D9',
  secondaryMuted: '#5B21B6',

  // Text
  textPrimary: '#1A1A1A',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',

  // Transaction semantics
  income: '#059669',
  expense: '#DC2626',
  pending: '#D97706',

  // UI elements
  border: '#E5E7EB',
  divider: '#F0F0F2',
  overlay: 'rgba(0, 0, 0, 0.4)',

  // Status
  success: '#059669',
  error: '#DC2626',
  warning: '#D97706',
  info: '#2563EB',
};

// Category colors — shared across both themes, used for charts/tags
export const categoryColors = {
  food: '#FF9F43',
  transport: '#54A0FF',
  bills: '#EE5A6F',
  shopping: '#A29BFE',
  entertainment: '#FD79A8',
  health: '#00D2A0',
  education: '#FFC048',
  other: '#8395A7',
};