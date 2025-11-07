/* eslint-disable no-unused-vars */
// src/components/TransactionsPage.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, DollarSign, TrendingUp, TrendingDown, Calendar, Filter } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { format } from 'date-fns';
import { toast } from 'sonner';
import Loading from '../../utils/Loading';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../utils/cn';
import CategoryForm from './CategoryForm';

const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6'];

const TransactionsPage = () => {
  const { isDark } = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ transactions: [], summary: {}, categories: [] });

  const token = localStorage.getItem('token');

  // Fetch Data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [transRes, catRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/transactions`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/categories`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const trans = await transRes.json();
      const cats = await catRes.json();

      if (trans.success && cats.success) {
        setData({
          transactions: trans.transactions,
          summary: trans.summary,
          categories: cats.categories
        });
      }
    } catch (err) {
        console.log(err)
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !category) return toast.error('Fill required fields');

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/transaction`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: +amount, type, category, description, date })
      });

      const json = await res.json();
      if (json.success) {
        toast.success(`${type === 'income' ? 'Income' : 'Expense'} added!`);
        setShowForm(false);
        resetForm();
        fetchData();
      } else {
        toast.error(json.message);
      }
    } catch (err) {
        console.log(err)
      toast.error('Failed to save');
    }
  };

  const resetForm = () => {
    setAmount(''); setCategory(''); setDescription(''); setDate(format(new Date(), 'yyyy-MM-dd'));
  };

  const filteredCategories = data.categories.filter(c => c.type === type);

  // Chart Data
  const pieData = [
    { name: 'Income', value: data.summary.income || 0 },
    { name: 'Expense', value: data.summary.expense || 0 }
  ];

  const topExpenses = Object.entries(
    data.transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        const cat = t.category?.name || 'Other';
        acc[cat] = (acc[cat] || 0) + t.amount;
        return acc;
      }, {})
  )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const historyData = data.transactions
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .reduce((acc, t) => {
      const dateKey = format(new Date(t.date), 'MMM dd');
      const existing = acc.find(d => d.date === dateKey);
      if (existing) {
        if (t.type === 'income') existing.income += t.amount;
        else existing.expense += t.amount;
      } else {
        acc.push({
          date: dateKey,
          income: t.type === 'income' ? t.amount : 0,
          expense: t.type === 'expense' ? t.amount : 0
        });
      }
      return acc;
    }, []);

  if (loading) return <Loading />;

  return (
    <div className={cn('p-4 space-y-6', isDark ? 'bg-[#090909FF]' : 'bg-gray-50')}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green">Transactions</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-green text-white px-4 py-2 rounded-xl shadow-lg"
        >
       
          <Plus className="w-5 h-5" />
          Add {type === 'income' ? 'Income' : 'Expense'}
        </motion.button>
      </div>

      {/* Warning Banner */}
      {data.summary.warning && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'p-4 rounded-xl font-medium',
            data.summary.warning.type === 'over_budget'
              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
          )}
        >
          {data.summary.warning.message}
        </motion.div>
      )}

      {/* Form */}
      {showForm && (
        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          onSubmit={handleSubmit}
          className={cn(
            'p-6 rounded-2xl shadow-xl space-y-4',
            isDark ? 'bg-gray-900' : 'bg-white'
          )}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">New {type === 'income' ? 'Income' : 'Expense'}</h2>
            <button type="button" onClick={() => setShowForm(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => { setType(e.target.value); setCategory(''); }}
                className={cn('w-full p-3 rounded-xl border', isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300')}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className={cn('w-full p-3 rounded-xl border', isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300')}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={cn('w-full p-3 rounded-xl border', isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300')}
                required
              >
                <option value="">Select category</option>
                {filteredCategories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={cn('w-full p-3 rounded-xl border', isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300')}
              />
            </div>
          </div>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={2}
            className={cn('w-full p-3 rounded-xl border', isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300')}
          />

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-green text-white py-3 rounded-xl font-medium hover:bg-green/90 transition"
            >
              Save
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={cn('p-5 rounded-xl shadow-md', isDark ? 'bg-gray-900' : 'bg-white')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Income</p>
              <p className="text-2xl font-bold text-green-600">₦{data.summary.income?.toLocaleString() || 0}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className={cn('p-5 rounded-xl shadow-md', isDark ? 'bg-gray-900' : 'bg-white')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Expense</p>
              <p className="text-2xl font-bold text-red-600">₦{data.summary.expense?.toLocaleString() || 0}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className={cn('p-5 rounded-xl shadow-md', isDark ? 'bg-gray-900' : 'bg-white')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Balance</p>
              <p className={cn('text-2xl font-bold', data.summary.total >= 0 ? 'text-green-600' : 'text-red-600')}>
                ₦{Math.abs(data.summary.total || 0).toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className={cn('p-5 rounded-xl shadow-md', isDark ? 'bg-gray-900' : 'bg-white')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Transactions</p>
              <p className="text-2xl font-bold">{data.transactions.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className={cn('p-6 rounded-xl shadow-md', isDark ? 'bg-gray-900' : 'bg-white')}>
          <h3 className="text-lg font-semibold mb-4">Income vs Expense</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Expenses */}
        <div className={cn('p-6 rounded-xl shadow-md', isDark ? 'bg-gray-900' : 'bg-white')}>
          <h3 className="text-lg font-semibold mb-4">Top Expense Categories</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topExpenses}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* History Chart */}
      <div className={cn('p-6 rounded-xl shadow-md', isDark ? 'bg-gray-900' : 'bg-white')}>
        <h3 className="text-lg font-semibold mb-4">Income & Expense Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={historyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} />
            <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Transaction List */}
      <div className={cn('p-6 rounded-xl shadow-md', isDark ? 'bg-gray-900' : 'bg-white')}>
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {data.transactions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No transactions yet</p>
          ) : (
            data.transactions.map((t) => (
              <div
                key={t._id}
                className={cn(
                  'flex justify-between items-center p-3 rounded-lg',
                  isDark ? 'bg-gray-800' : 'bg-gray-50'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    t.type === 'income' ? 'bg-green/20' : 'bg-red/20'
                  )}>
                    {t.type === 'income' ? <TrendingUp className="w-5 h-5 text-green" /> : <TrendingDown className="w-5 h-5 text-red" />}
                  </div>
                  <div>
                    <p className="font-medium">{t.category?.name || 'Uncategorized'}</p>
                    <p className="text-sm text-gray-500">{format(new Date(t.date), 'MMM dd, yyyy')}</p>
                  </div>
                </div>
                <p className={cn(
                  'font-semibold',
                  t.type === 'income' ? 'text-green' : 'text-red-600'
                )}>
                  {t.type === 'income' ? '+' : '-'}₦{t.amount.toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;