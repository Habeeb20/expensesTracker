/* eslint-disable no-unused-vars */
// src/components/CategoryForm.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Palette, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '../../contexts/ThemeContext';

import { cn } from '../../utils/cn';
import ImageLoadingSpinner from '../../utils/Loading';

const iconOptions = [
  { name: 'PiggyBank', icon: 'piggy-bank' },
  { name: 'Utensils', icon: 'utensils' },
  { name: 'ShoppingCart', icon: 'shopping-cart' },
  { name: 'Home', icon: 'home' },
  { name: 'Car', icon: 'car' },
  { name: 'Briefcase', icon: 'briefcase' },
  { name: 'Heart', icon: 'heart' },
  { name: 'Gamepad2', icon: 'gamepad-2' },
  { name: 'Plane', icon: 'plane' },
  { name: 'GraduationCap', icon: 'graduation-cap' },
];

const colorOptions = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308',
  '#84cc16', '#22c55e', '#10b981', '#14b8a6',
  '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
  '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'
];

const CategoryForm = ({ onSuccess }) => {
  const { isDark } = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('expense');
  const [budget, setBudget] = useState('');
  const [icon, setIcon] = useState('piggy-bank');
  const [color, setColor] = useState('#ef4444');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Name is required');

    if (type === 'expense' && (!budget || budget <= 0)) {
      return toast.error('Budget required for expenses');
    }

    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/categories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name.trim(),
          type,
          budget: type === 'expense' ? +budget : 0,
          icon,
          color
        })
      });

      const json = await res.json();
      if (json.success) {
        toast.success('Category created!');
        resetForm();
        setShowForm(false);
        onSuccess?.();
      } else {
        toast.error(json.message);
      }
    } catch (err) {
        console.log(err)
      toast.error('Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName(''); setBudget(''); setIcon('piggy-bank'); setColor('#ef4444');
  };

  if(loading) return <ImageLoadingSpinner />
  return (
    <div className="space-y-4">
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowForm(!showForm)}
        className="flex items-center gap-2 bg-green text-white px-5 py-3 rounded-xl shadow-lg font-medium"
      >
        <Plus className="w-5 h-5" />
        New Category
      </motion.button>

      {/* Form */}
      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className={cn(
            'p-6 rounded-2xl shadow-xl space-y-5 border',
            isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
          )}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Create Category
            </h2>
            <button
              type="button"
              onClick={() => { setShowForm(false); resetForm(); }}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Food, Salary"
              className={cn(
                'w-full p-3 rounded-xl border focus:ring-2 focus:ring-green',
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'
              )}
              required
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => { setType('expense'); setBudget(''); }}
                className={cn(
                  'p-3 rounded-xl font-medium transition',
                  type === 'expense'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-800'
                )}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => { setType('income'); setBudget(''); }}
                className={cn(
                  'p-3 rounded-xl font-medium transition',
                  type === 'income'
                    ? 'bg-green text-white'
                  : 'bg-gray-200 dark:bg-gray-800'
                )}
              >
                Income
              </button>
            </div>
          </div>

          {/* Budget (only for expense) */}
          {type === 'expense' && (
            <div>
              <label className="block text-sm font-medium mb-2">Budget (NGN)</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g. 50000"
                className={cn(
                  'w-full p-3 rounded-xl border focus:ring-2 focus:ring-green',
                  isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'
                )}
                min="1"
                required
              />
            </div>
          )}

          {/* Icon Picker */}
          <div>
            <label className="block text-sm font-medium mb-2">Icon</label>
            <div className="grid grid-cols-5 gap-2">
              {iconOptions.map((opt) => (
                <button
                  key={opt.name}
                  type="button"
                  onClick={() => setIcon(opt.icon)}
                  className={cn(
                    'p-3 rounded-xl border-2 transition',
                    icon === opt.icon
                      ? 'border-green bg-green/10'
                      : 'border-gray-300 dark:border-gray-700'
                  )}
                >
                
                </button>
              ))}
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Palette className="w-4 h-4" />
              Color
            </label>
            <div className="grid grid-cols-8 gap-2">
              {colorOptions.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn(
                    'w-10 h-10 rounded-full border-4 transition',
                    color === c ? 'border-white shadow-lg' : 'border-transparent'
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green text-white py-3 rounded-xl font-medium hover:bg-green/90 disabled:opacity-70"
            >
              {loading ? 'Saving...' : 'Create Category'}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); resetForm(); }}
              className="flex-1 bg-gray-300 dark:bg-gray-700 py-3 rounded-xl font-medium"
            >
              Cancel
            </button>
          </div>
        </motion.form>
      )}
    </div>
  );
};

export default CategoryForm;