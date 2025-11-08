// /* eslint-disable no-unused-vars */
// // src/components/BudgetManager.jsx
// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   PiggyBank, Plus, X, CheckCircle, Calendar, TrendingDown,
//   Edit3, Trash2, Save, AlertCircle
// } from 'lucide-react';
// import { format } from 'date-fns';
// import { toast } from 'sonner';
// import { CartesianGrid } from 'recharts';
// import { XAxis,YAxis } from 'recharts';

// import {
//   PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
//   RadialBarChart, RadialBar, AreaChart, Area
// } from 'recharts';
// import { cn } from '../../utils/cn';
// import { useTheme } from '../../contexts/ThemeContext';
// import ImageLoading from "../../utils/Loading"
// const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6'];

// const BudgetManager = () => {
//   const { isDark } = useTheme();
//   const [budgets, setBudgets] = useState([]);
//   const [analytics, setAnalytics] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [form, setForm] = useState({ category: '', limit: '', task: '', dueDate: '', categoryId: '' });
//   const [loading, setLoading] = useState(true);

//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const [budgetRes, analRes, catRes] = await Promise.all([
//         fetch(`${import.meta.env.VITE_BACKEND_URL}/api/budgets`, { headers: { Authorization: `Bearer ${token}` } }),
//         fetch(`${import.meta.env.VITE_BACKEND_URL}/api/analytics`, { headers: { Authorization: `Bearer ${token}` } }),
//         fetch(`${import.meta.env.VITE_BACKEND_URL}/api/categories`, { headers: { Authorization: `Bearer ${token}` } })
//       ]);
//       const [budgets, analytics, cats] = await Promise.all([budgetRes.json(), analRes.json(), catRes.json()]);
//       if (budgets.success && analytics.success && cats.success) {
//         setBudgets(budgets.budgets);
//         setAnalytics(analytics.analytics);
//         setCategories(cats.categories.filter(c => c.type === 'expense'));
//       }
//     } catch (err) {
//       toast.error('Failed to load');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!form.category || !form.limit || !form.dueDate || !form.categoryId) return toast.error('Fill all fields');

//     const url = editingId
//       ? `${import.meta.env.VITE_BACKEND_URL}/api/budgets/${editingId}`
//       : `${import.meta.env.VITE_BACKEND_URL}/api/budgets`;
//     const method = editingId ? 'PUT' : 'POST';

//     try {
//       const res = await fetch(url, {
//         method,
//         headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
//         body: JSON.stringify({ ...form, limit: +form.limit })
//       });
//       const json = await res.json();
//       if (json.success) {
//         toast.success(editingId ? 'Budget updated!' : 'Budget created!');
//         resetForm();
//         fetchData();
//       } else {
//         toast.error(json.message);
//       }
//     } catch (err) {
//       toast.error('Failed');
//     }
//   };

//   const handleEdit = (budget) => {
//     setEditingId(budget._id);
//     setForm({
//       category: budget.category,
//       limit: budget.limit,
//       task: budget.task || '',
//       dueDate: format(new Date(budget.dueDate), 'yyyy-MM-dd'),
//       categoryId: budget.categoryId._id
//     });
//     setShowForm(true);
//   };

//   const handleDelete = async (id) => {
//     if (!confirm('Delete this budget?')) return;
//     try {
//       await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/budgets/${id}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       toast.success('Budget deleted');
//       fetchData();
//     } catch (err) {
//       toast.error('Failed');
//     }
//   };

//   const handleDeduct = async (budgetId, amount) => {
//     try {
//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/budgets/deduct/${budgetId}`, {
//         method: 'POST',
//         headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
//         body: JSON.stringify({ amount, description: 'Budget task completed' })
//       });
//       const json = await res.json();
//       if (json.success) {
//         toast.success('Deducted & added to expenses!');
//         fetchData();
//       }
//     } catch (err) {
//       toast.error('Failed');
//     }
//   };

//   const resetForm = () => {
//     setForm({ category: '', limit: '', task: '', dueDate: '', categoryId: '' });
//     setEditingId(null);
//     setShowForm(false);
//   };

//   // Chart Data
//   const pieData = budgets.map(b => ({ name: b.category, value: b.spent }));
//   const radialData = budgets.map(b => ({
//     name: b.category,
//     value: b.limit > 0 ? Math.round((b.spent / b.limit) * 100) : 0,
//     fill: b.spent >= b.limit ? '#ef4444' : '#10b981'
//   }));
//   const areaData = [
//     { name: 'Daily', expense: analytics?.daily?.expense || 0 },
//     { name: 'Weekly', expense: analytics?.weekly?.expense || 0 },
//     { name: 'Monthly', expense: analytics?.monthly?.expense || 0 },
//     { name: 'Yearly', expense: analytics?.yearly?.expense || 0 }
//   ];

//   if (loading) return <ImageLoading/>

//   return (
//     <div className={cn('p-4 space-y-6', isDark ? 'bg-[#090909FF]' : 'bg-gray-50')}>
//       <div className="flex justify-between items-center">
//         <h1 className="text-3xl font-bold text-green flex items-center gap-2">
//           <PiggyBank className="w-8 h-8" />
//           Budget Manager
//         </h1>
//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={() => { resetForm(); setShowForm(true); }}
//           className="flex items-center gap-2 bg-green text-white px-5 py-3 rounded-xl shadow-lg"
//         >
//           <Plus className="w-5 h-5" />
//           New Budget
//         </motion.button>
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <motion.div className={cn('p-6 rounded-2xl shadow-lg', isDark ? 'bg-gray-900' : 'bg-white')}>
//           <h3 className="text-lg font-semibold mb-4">Budget Spending</h3>
//           <ResponsiveContainer width="100%" height={280}>
//             <PieChart>
//               <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label>
//                 {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
//               </Pie>
//               <Tooltip formatter={(v) => `₦${v.toLocaleString()}`} />
//             </PieChart>
//           </ResponsiveContainer>
//         </motion.div>

//         <motion.div className={cn('p-6 rounded-2xl shadow-lg', isDark ? 'bg-gray-900' : 'bg-white')}>
//           <h3 className="text-lg font-semibold mb-4">Budget Health</h3>
//           <div className="grid grid-cols-2 gap-4">
//             {radialData.map((d, i) => (
//               <div key={i} className="flex flex-col items-center">
//                 <ResponsiveContainer width={90} height={90}>
//                   <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="80%" data={[d]}>
//                     <RadialBar dataKey="value" fill={d.fill} background />
//                   </RadialBarChart>
//                 </ResponsiveContainer>
//                 <p className="text-xs mt-1">{d.name}</p>
//                 <p className="text-xs text-gray-500">{d.value}%</p>
//               </div>
//             ))}
//           </div>
//         </motion.div>
//       </div>

//       <motion.div className={cn('p-6 rounded-2xl shadow-lg', isDark ? 'bg-gray-900' : 'bg-white')}>
//         <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//           <Calendar className="w-5 h-5 text-green" />
//           Expense Trend
//         </h3>
//         <ResponsiveContainer width="100%" height={300}>
//           <AreaChart data={areaData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip formatter={(v) => `₦${v.toLocaleString()}`} />
//             <Area type="monotone" dataKey="expense" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
//           </AreaChart>
//         </ResponsiveContainer>
//       </motion.div>

//       {/* Budget List */}
//       <div className="space-y-4">
//         <h3 className="text-xl font-bold">Active Budgets</h3>
//         <AnimatePresence>
//           {budgets.length === 0 ? (
//             <p className="text-center text-gray-500 py-8">No active budgets</p>
//           ) : (
//             budgets.map(b => {
//               const percentage = b.limit > 0 ? (b.spent / b.limit) * 100 : 0;
//               const remaining = b.limit - b.spent;
//               const isOver = percentage >= 100;

//               return (
//                 <motion.div
//                   key={b._id}
//                   layout
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, scale: 0.9, x: -100 }}
//                   className={cn(
//                     'p-5 rounded-2xl shadow-md border-2 flex items-center justify-between transition-all',
//                     isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200',
//                     isOver ? 'border-red-500' : 'border-green'
//                   )}
//                 >
//                   <div className="flex-1">
//                     <div className="flex items-center justify-between mb-2">
//                       <h4 className="font-bold text-lg">{b.category}</h4>
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => handleEdit(b)}
//                           className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg"
//                         >
//                           <Edit3 className="w-4 h-4 text-blue-600" />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(b._id)}
//                           className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg"
//                         >
//                           <Trash2 className="w-4 h-4 text-red-600" />
//                         </button>
//                       </div>
//                     </div>
//                     <p className="text-sm text-gray-500">Task: {b.task || '—'}</p>
//                     <p className="text-sm flex items-center gap-1">
//                       <Calendar className="w-4 h-4" />
//                       {/* Due: {format(new Date(b.dueDate), 'MMM dd, yyyy')} */}
//                     </p>
//                     <div className="mt-2 flex justify-between text-sm">
//                       <span>₦{b.spent.toLocaleString()} / ₦{b.limit.toLocaleString()}</span>
//                       <span className={cn('font-bold', remaining <= 0 ? 'text-red-600' : 'text-green')}>
//                         ₦{remaining.toLocaleString()} left
//                       </span>
//                     </div>
//                     <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
//                       <motion.div
//                         initial={{ width: 0 }}
//                         animate={{ width: `${Math.min(100, percentage)}%` }}
//                         className={cn('h-full rounded-full', isOver ? 'bg-red-500' : 'bg-green')}
//                       />
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-3 ml-4">
//                     {isOver ? (
//                       <AlertCircle className="w-6 h-6 text-red-500" />
//                     ) : (
//                       <>
//                         <input
//                           type="radio"
//                           id={`radio-${b._id}`}
//                           checked={false}
//                           onChange={() => handleDeduct(b._id, remaining)}
//                           className="w-6 h-6 text-green"
//                         />
//                         {/* <label htmlFor={`radio-${b._id}`} className="cursor-pointer">
//                           <Check111 className="w-6 h-6 text-green" />
//                         </label> */}
//                       </>
//                     )}
//                   </div>
//                 </motion.div>
//               );
//             })
//           )}
//         </AnimatePresence>
//       </div>

//       {/* Form Modal */}
//       <AnimatePresence>
//         {showForm && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
//             onClick={resetForm}
//           >
//             <motion.form
//               initial={{ scale: 0.9, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.9, y: 20 }}
//               onClick={(e) => e.stopPropagation()}
//               onSubmit={handleSubmit}
//               className={cn('w-full max-w-md p-6 rounded-2xl shadow-2xl', isDark ? 'bg-gray-900' : 'bg-white')}
//             >
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-xl font-bold">{editingId ? 'Edit' : 'Create'} Budget</h3>
//                 <button type="button" onClick={resetForm} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded">
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>

//               <input
//                 placeholder="Budget Name"
//                 value={form.category}
//                 onChange={e => setForm({ ...form, category: e.target.value })}
//                 className="w-full p-3 rounded-xl border mb-3"
//                 required
//               />
//               <input
//                 type="number"
//                 placeholder="Limit (NGN)"
//                 value={form.limit}
//                 onChange={e => setForm({ ...form, limit: e.target.value })}
//                 className="w-full p-3 rounded-xl border mb-3"
//                 required
//               />
//               <input
//                 placeholder="Task / Purpose"
//                 value={form.task}
//                 onChange={e => setForm({ ...form, task: e.target.value })}
//                 className="w-full p-3 rounded-xl border mb-3"
//               />
//               <input
//                 type="date"
//                 value={form.dueDate}
//                 onChange={e => setForm({ ...form, dueDate: e.target.value })}
//                 className="w-full p-3 rounded-xl border mb-3"
//                 required
//               />
//               <select
//                 value={form.categoryId}
//                 onChange={e => setForm({ ...form, categoryId: e.target.value })}
//                 className="w-full p-3 rounded-xl border mb-4"
//                 required
//               >
//                 <option value="">Select Category</option>
//                 {categories.map(c => (
//                   <option key={c._id} value={c._id}>{c.name}</option>
//                 ))}
//               </select>

//               <div className="flex gap-3">
//                 <button
//                   type="submit"
//                   className="flex-1 bg-green text-white py-3 rounded-xl flex items-center justify-center gap-2"
//                 >
//                   <Save className="w-5 h-5" />
//                   {editingId ? 'Update' : 'Create'}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={resetForm}
//                   className="flex-1 bg-gray-300 dark:bg-gray-700 py-3 rounded-xl"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </motion.form>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default BudgetManager;




/* eslint-disable no-unused-vars */
// src/components/BudgetManager.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PiggyBank, Plus, X, CheckCircle, Calendar, TrendingDown,
  Edit3, Trash2, Save, AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { CartesianGrid, XAxis, YAxis, BarChart, Bar, Legend } from 'recharts';

import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  RadialBarChart, RadialBar, AreaChart, Area
} from 'recharts';
import { cn } from '../../utils/cn';
import { useTheme } from '../../contexts/ThemeContext';
import ImageLoading from "../../utils/Loading";

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6'];

const BudgetManager = () => {
  const { isDark } = useTheme();
  const [budgets, setBudgets] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ category: '', limit: '', task: '', dueDate: '', categoryId: '' });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [budgetRes, analRes, catRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/budgets`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/analytics`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/categories`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      const [budgets, analytics, cats] = await Promise.all([budgetRes.json(), analRes.json(), catRes.json()]);
      if (budgets.success && analytics.success && cats.success) {
        setBudgets(budgets.budgets);
        setAnalytics(analytics.analytics);
        setCategories(cats.categories.filter(c => c.type === 'expense'));
      }
    } catch (err) {
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category || !form.limit || !form.dueDate || !form.categoryId) return toast.error('Fill all fields');

    const url = editingId
      ? `${import.meta.env.VITE_BACKEND_URL}/api/budgets/${editingId}`
      : `${import.meta.env.VITE_BACKEND_URL}/api/budgets`;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, limit: +form.limit })
      });
      const json = await res.json();
      if (json.success) {
        toast.success(editingId ? 'Budget updated!' : 'Budget created!');
        resetForm();
        fetchData();
      } else {
        toast.error(json.message);
      }
    } catch (err) {
      toast.error('Failed');
    }
  };

  const handleEdit = (budget) => {
    setEditingId(budget._id);
    setForm({
      category: budget.category,
      limit: budget.limit,
      task: budget.task || '',
      dueDate: format(new Date(budget.dueDate), 'yyyy-MM-dd'),
      categoryId: budget.categoryId._id
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this budget?')) return;
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/budgets/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Budget deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed');
    }
  };

  const handleDeduct = async (budgetId, amount) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/budgets/deduct/${budgetId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, description: 'Budget task completed' })
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Deducted & added to expenses!');
        fetchData();
      }
    } catch (err) {
      toast.error('Failed');
    }
  };

  const resetForm = () => {
    setForm({ category: '', limit: '', task: '', dueDate: '', categoryId: '' });
    setEditingId(null);
    setShowForm(false);
  };

  // CHART DATA
  const pieData = budgets.length > 0
    ? budgets.map(b => ({ name: b.category, value: b.spent }))
    : [{ name: 'No data', value: 1 }];

  const radialData = budgets.map(b => ({
    name: b.category,
    value: b.limit > 0 ? Math.round((b.spent / b.limit) * 100) : 0,
    fill: b.spent >= b.limit ? '#ef4444' : '#10b981'
  }));

  const areaData = [
    { name: 'Daily', expense: analytics?.daily?.expense || 0 },
    { name: 'Weekly', expense: analytics?.weekly?.expense || 0 },
    { name: 'Monthly', expense: analytics?.monthly?.expense || 0 },
    { name: 'Yearly', expense: analytics?.yearly?.expense || 0 }
  ];

  // NEW: Budget Donut + Bar
  const budgetDonutData = budgets.length > 0
    ? budgets.map(b => ({ name: b.category, value: b.limit }))
    : [{ name: 'No budget', value: 1 }];

  const budgetBarData = [
    { name: 'Daily', budget: budgets.reduce((s, b) => s + (b.limit || 0), 0) },
    { name: 'Weekly', budget: budgets.reduce((s, b) => s + (b.limit || 0), 0) },
    { name: 'Monthly', budget: budgets.reduce((s, b) => s + (b.limit || 0), 0) },
    { name: 'Yearly', budget: budgets.reduce((s, b) => s + (b.limit || 0), 0) }
  ];

  // NEW: Expense Donut + Bar
  const expenseDonutData = [
    { name: 'Daily', value: analytics?.daily?.expense || 0 },
    { name: 'Weekly', value: analytics?.weekly?.expense || 0 },
    { name: 'Monthly', value: analytics?.monthly?.expense || 0 },
    { name: 'Yearly', value: analytics?.yearly?.expense || 0 }
  ].filter(d => d.value > 0);

  const expenseBarData = [
    { name: 'Daily', expense: analytics?.daily?.expense || 0 },
    { name: 'Weekly', expense: analytics?.weekly?.expense || 0 },
    { name: 'Monthly', expense: analytics?.monthly?.expense || 0 },
    { name: 'Yearly', expense: analytics?.yearly?.expense || 0 }
  ];

  if (loading) return <ImageLoading />;

  return (
    <div className={cn('p-4 space-y-6', isDark ? 'bg-[#090909FF]' : 'bg-gray-50')}>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-green flex items-center gap-2">
          <PiggyBank className="w-8 h-8" />
          Budget Manager
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 bg-green text-white px-5 py-3 rounded-xl shadow-lg"
        >
          <Plus className="w-5 h-5" />
          New Budget
        </motion.button>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fixed Pie Chart */}
        <motion.div className={cn('p-6 rounded-2xl shadow-lg', isDark ? 'bg-gray-900' : 'bg-white')}>
          <h3 className="text-lg font-semibold mb-4">Budget Spending</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => percent > 0 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={pieData[i].value === 1 && pieData[i].name === 'No data' ? '#94a3b8' : COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `₦${v.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Radial Health */}
        <motion.div className={cn('p-6 rounded-2xl shadow-lg', isDark ? 'bg-gray-900' : 'bg-white')}>
          <h3 className="text-lg font-semibold mb-4">Budget Health</h3>
          <div className="grid grid-cols-2 gap-4">
            {radialData.length === 0 ? (
              <p className="col-span-2 text-center text-gray-500">No budgets</p>
            ) : (
              radialData.map((d, i) => (
                <div key={i} className="flex flex-col items-center">
                  <ResponsiveContainer width={90} height={90}>
                    <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="80%" data={[d]}>
                      <RadialBar dataKey="value" fill={d.fill} background />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <p className="text-xs mt-1">{d.name}</p>
                  <p className="text-xs text-gray-500">{d.value}%</p>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Expense Trend (Area) */}
      <motion.div className={cn('p-6 rounded-2xl shadow-lg', isDark ? 'bg-gray-900' : 'bg-white')}>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-green" />
          Expense Trend
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={areaData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(v) => `₦${v.toLocaleString()}`} />
            <Area type="monotone" dataKey="expense" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* NEW: Budget Donut + Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div className={cn('p-6 rounded-2xl shadow-lg', isDark ? 'bg-gray-900' : 'bg-white')}>
          <h3 className="text-lg font-semibold mb-4">Total Budget Allocation</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={budgetDonutData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                dataKey="value"
                label={({ name, percent }) => percent > 0 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''}
              >
                {budgetDonutData.map((_, i) => (
                  <Cell key={i} fill={budgetDonutData[i].value === 1 && budgetDonutData[i].name === 'No budget' ? '#94a3b8' : COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `₦${v.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div className={cn('p-6 rounded-2xl shadow-lg', isDark ? 'bg-gray-900' : 'bg-white')}>
          <h3 className="text-lg font-semibold mb-4">Budget Over Time</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={budgetBarData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(v) => `₦${v.toLocaleString()}`} />
              <Bar dataKey="budget" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* NEW: Expense Donut + Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div className={cn('p-6 rounded-2xl shadow-lg', isDark ? 'bg-gray-900' : 'bg-white')}>
          <h3 className="text-lg font-semibold mb-4">Expense Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={expenseDonutData.length > 0 ? expenseDonutData : [{ name: 'No expense', value: 1 }]}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                dataKey="value"
                label={({ name, percent }) => percent > 0 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''}
              >
                {expenseDonutData.map((_, i) => (
                  <Cell key={i} fill={expenseDonutData[i]?.value === 1 && expenseDonutData[i]?.name === 'No expense' ? '#94a3b8' : '#ef4444'} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `₦${v.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div className={cn('p-6 rounded-2xl shadow-lg', isDark ? 'bg-gray-900' : 'bg-white')}>
          <h3 className="text-lg font-semibold mb-4">Expense Over Time</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={expenseBarData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(v) => `₦${v.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="expense" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Budget List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Active Budgets</h3>
        <AnimatePresence>
          {budgets.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No active budgets</p>
          ) : (
            budgets.map(b => {
              const percentage = b.limit > 0 ? (b.spent / b.limit) * 100 : 0;
              const remaining = b.limit - b.spent;
              const isOver = percentage >= 100;

              return (
                <motion.div
                  key={b._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: -100 }}
                  className={cn(
                    'p-5 rounded-2xl shadow-md border-2 flex items-center justify-between transition-all',
                    isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200',
                    isOver ? 'border-red-500' : 'border-green'
                  )}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-lg">{b.category}</h4>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(b)}
                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg"
                        >
                          <Edit3 className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(b._id)}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">Task: {b.task || '—'}</p>
                    <p className="text-sm flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Due: {format(new Date(b.dueDate), 'MMM dd, yyyy')}
                    </p>
                    <div className="mt-2 flex justify-between text-sm">
                      <span>₦{b.spent.toLocaleString()} / ₦{b.limit.toLocaleString()}</span>
                      <span className={cn('font-bold', remaining <= 0 ? 'text-red-600' : 'text-green')}>
                        ₦{remaining.toLocaleString()} left
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, percentage)}%` }}
                        className={cn('h-full rounded-full', isOver ? 'bg-red-500' : 'bg-green')}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 ml-4">
                    {isOver ? (
                      <AlertCircle className="w-6 h-6 text-red-500" />
                    ) : (
                      <>
                        <input
                          type="radio"
                          id={`radio-${b._id}`}
                          checked={false}
                          onChange={() => handleDeduct(b._id, remaining)}
                          className="w-6 h-6 text-green"
                        />
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={resetForm}
          >
            <motion.form
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleSubmit}
              className={cn('w-full max-w-md p-6 rounded-2xl shadow-2xl', isDark ? 'bg-gray-900' : 'bg-white')}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{editingId ? 'Edit' : 'Create'} Budget</h3>
                <button type="button" onClick={resetForm} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <input
                placeholder="Budget Name"
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full p-3 rounded-xl border mb-3"
                required
              />
              <input
                type="number"
                placeholder="Limit (NGN)"
                value={form.limit}
                onChange={e => setForm({ ...form, limit: e.target.value })}
                className="w-full p-3 rounded-xl border mb-3"
                required
              />
              <input
                placeholder="Task / Purpose"
                value={form.task}
                onChange={e => setForm({ ...form, task: e.target.value })}
                className="w-full p-3 rounded-xl border mb-3"
              />
              <input
                type="date"
                value={form.dueDate}
                onChange={e => setForm({ ...form, dueDate: e.target.value })}
                className="w-full p-3 rounded-xl border mb-3"
                required
              />
              <select
                value={form.categoryId}
                onChange={e => setForm({ ...form, categoryId: e.target.value })}
                className="w-full p-3 rounded-xl border mb-4"
                required
              >
                <option value="">Select Category</option>
                {categories.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-green text-white py-3 rounded-xl flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {editingId ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-300 dark:bg-gray-700 py-3 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BudgetManager;