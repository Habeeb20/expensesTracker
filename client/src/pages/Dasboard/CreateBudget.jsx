/* eslint-disable no-unused-vars */
// src/components/CreateBudget.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PiggyBank, Plus, X, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../../utils/cn';
import { useTheme } from '../../contexts/ThemeContext';

const CreateBudget = ({ onSuccess }) => {
  const { isDark } = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [limit, setLimit] = useState('');
  const [task, setTask] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (showForm) fetchCategories();
  }, [showForm]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) {
        setCategories(json.categories.filter(c => c.type === 'expense'));
      }
    } catch (err) {
      toast.error('Failed to load categories');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !limit || !category) return toast.error('Fill all fields');

    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/budget`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          category: name,
          limit: +limit,
          task,
          categoryId: category
        })
      });

      const json = await res.json();
      if (json.success) {
        toast.success('Budget created!');
        resetForm();
        setShowForm(false);
        onSuccess?.();
      } else {
        toast.error(json.message);
      }
    } catch (err) {
      toast.error('Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName(''); setLimit(''); setTask(''); setCategory('');
  };

  return (
    <div className="space-y-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowForm(true)}
        className="flex items-center gap-2 bg-green text-white px-5 py-3 rounded-xl shadow-lg font-medium"
      >
        <Plus className="w-5 h-5" />
        Create Budget
      </motion.button>

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
              <PiggyBank className="w-5 h-5" />
              New Budget
            </h2>
            <button type="button" onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Budget Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Food, Rent"
              className={cn('w-full p-3 rounded-xl border', isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300')}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Limit (NGN)</label>
            <input
              type="number"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              placeholder="e.g. 50000"
              className={cn('w-full p-3 rounded-xl border', isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300')}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Task / Purpose</label>
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="e.g. Weekly groceries"
              className={cn('w-full p-3 rounded-xl border', isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={cn('w-full p-3 rounded-xl border', isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300')}
              required
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green text-white py-3 rounded-xl font-medium hover:bg-green/90 disabled:opacity-70"
            >
              {loading ? 'Saving...' : 'Create Budget'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
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

export default CreateBudget;