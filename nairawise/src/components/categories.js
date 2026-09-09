// src/constants/categories.js
import {
  UtensilsCrossed,
  Car,
  Receipt,
  ShoppingBag,
  Film,
  HeartPulse,
  GraduationCap,
  MoreHorizontal,
  MonitorCloud,
} from 'lucide-react-native';

export const CATEGORIES = [
  { key: 'food', label: 'Food', icon: UtensilsCrossed, keywords: ['food', 'lunch', 'dinner', 'breakfast', 'grocery', 'groceries', 'restaurant', 'eating'] },
  { key: 'allowance', label: 'Allowance', icon: UtensilsCrossed, keywords: ['allowance', 'pocket money', 'gift'] },
  { key: 'salary', label: 'Salary', icon: MonitorCloud, keywords: ['salary', 'paycheck', 'pay', 'wage'] },
  { key: 'transport', label: 'Transport', icon: Car, keywords: ['transport', 'uber', 'bolt', 'taxi', 'fuel', 'fare', 'bus', 'transportation'] },
  { key: 'bills', label: 'Bills', icon: Receipt, keywords: ['bill', 'bills', 'electricity', 'rent', 'subscription', 'netflix', 'light', 'utility', 'utilities'] },
  { key: 'shopping', label: 'Shopping', icon: ShoppingBag, keywords: ['shopping', 'clothes', 'shoes', 'bought', 'purchase'] },
  { key: 'entertainment', label: 'Entertainment', icon: Film, keywords: ['entertainment', 'movie', 'cinema', 'game', 'fun', 'outing'] },
  { key: 'health', label: 'Health', icon: HeartPulse, keywords: ['health', 'hospital', 'drug', 'medicine', 'doctor', 'clinic', 'pharmacy'] },
  { key: 'education', label: 'Education', icon: GraduationCap, keywords: ['education', 'school', 'fees', 'books', 'tuition', 'course'] },
  { key: 'other', label: 'Other', icon: MoreHorizontal, keywords: [] },
];

export const INCOME_TYPE_WORDS = ['income', 'earned', 'received', 'got paid', 'credited', 'deposit'];
export const EXPENSE_TYPE_WORDS = ['expense', 'spent', 'paid', 'bought', 'purchased', 'cost'];
export const INCOME_LEANING_CATEGORIES = ['salary', 'allowance'];