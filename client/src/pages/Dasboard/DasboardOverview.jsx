/* eslint-disable no-unused-vars */
// src/components/DashboardOverview.jsx
// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import {
//   TrendingUp, TrendingDown, DollarSign, PiggyBank, Receipt, CheckSquare,
//   Calendar, Plus, X, Edit2, Trash2
// } from 'lucide-react';
// import { format } from 'date-fns';
// import { toast } from 'sonner';
// import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
// import Loading from '../../utils/Loading';
// import { useTheme } from '../../contexts/ThemeContext';
// import { cn } from '../../utils/cn';

// const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b'];

// const DashboardOverview = () => {
//   const { isDark } = useTheme();
//   const [loading, setLoading] = useState(true);
//   const [data, setData] = useState({
//     summary: { income: 0, expense: 0, total: 0 },
//     analytics: { daily: {}, weekly: {}, monthly: {}, yearly: {} },
//     transactions: [],
//     budgets: [],
//     todos: []
//   });
//   const [newTodo, setNewTodo] = useState('');

//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   const fetchAllData = async () => {
//     try {
//       setLoading(true);
//       const [transRes, analyticsRes, budgetRes, todoRes] = await Promise.all([
//         fetch(`${import.meta.env.VITE_BACKEND_URL}/api/transactions`, { headers: { Authorization: `Bearer ${token}` } }),
//         fetch(`${import.meta.env.VITE_BACKEND_URL}/api/analytics`, { headers: { Authorization: `Bearer ${token}` } }),
//         fetch(`${import.meta.env.VITE_BACKEND_URL}/api/budgets`, { headers: { Authorization: `Bearer ${token}` } }),
//         fetch(`${import.meta.env.VITE_BACKEND_URL}/api/todos`, { headers: { Authorization: `Bearer ${token}` } })
//       ]);

//       const [trans, analytics, budgets, todos] = await Promise.all([
//         transRes.json(), analyticsRes.json(), budgetRes.json(), todoRes.json()
//       ]);

//       if (trans.success && analytics.success && budgets.success && todos.success) {
//         setData({
//           summary: trans.summary,
//           analytics: analytics.analytics,
//           transactions: trans.transactions.slice(0, 5),
//           budgets: budgets.budgets,
//           todos: todos.todos || []
//         });
//       }
//     } catch (err) {
//       toast.error('Failed to load dashboard');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addTodo = async () => {
//     if (!newTodo.trim()) return;
//     try {
//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/todos`, {
//         method: 'POST',
//         headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
//         body: JSON.stringify({ title: newTodo })
//       });
//       const json = await res.json();
//       if (json.success) {
//         setData(prev => ({ ...prev, todos: [...prev.todos, json.todo] }));
//         setNewTodo('');
//         toast.success('To-Do added');
//       }
//     } catch (err) {
//         console.log(err)
//       toast.error('Failed');
//     }
//   };

//   const deleteTodo = async (id) => {
//     try {
//       await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/todos/${id}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setData(prev => ({ ...prev, todos: prev.todos.filter(t => t._id !== id) }));
//       toast.success('Deleted');
//     } catch (err) {
//         console.log(err)
//       toast.error('Failed');
//     }
//   };

//   if (loading) return <Loading />;

//   const { summary, analytics, transactions, budgets, todos } = data;

//   return (
//     <div className={cn('p-4 space-y-6', isDark ? 'bg-[#090909FF]' : 'bg-gray-50')}>
//       {/* Header */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="text-center"
//       >
//         <h1 className="text-3xl font-bold text-green">Dashboard Overview</h1>
//         <p className="text-sm text-gray-500 mt-1">Welcome back, {localStorage.getItem('userFullName')?.split(' ')[0] || 'User'}</p>
//       </motion.div>

//       {/* Warning */}
//       {summary.warning && (
//         <motion.div
//           initial={{ scale: 0.9 }}
//           animate={{ scale: 1 }}
//           className={cn(
//             'p-4 rounded-xl font-semibold text-center',
//             summary.warning.type === 'over_budget' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
//           )}
//         >
//           {summary.warning.message}
//         </motion.div>
//       )}

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {[
//           { label: 'Total Income', value: summary.income, icon: TrendingUp, color: 'text-green-600' },
//           { label: 'Total Expense', value: summary.expense, icon: TrendingDown, color: 'text-red-600' },
//           { label: 'Balance', value: Math.abs(summary.total), icon: DollarSign, color: summary.total >= 0 ? 'text-green-600' : 'text-red-600' },
//           { label: 'Transactions', value: transactions.length, icon: Receipt, color: 'text-blue-600' }
//         ].map((card, i) => (
//           <motion.div
//             key={i}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: i * 0.1 }}
//             className={cn('p-5 rounded-2xl shadow-lg', isDark ? 'bg-gray-900' : 'bg-white')}
//           >
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500">{card.label}</p>
//                 <p className={cn('text-2xl font-bold', card.color)}>
//                   {card.label.includes('Income') || card.label.includes('Expense') || card.label.includes('Balance')
//                     ? `₦${card.value.toLocaleString()}`
//                     : card.value}
//                 </p>
//               </div>
//               <card.icon className={cn('w-10 h-10', card.color)} />
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Yearly Overview */}
//         <motion.div
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           className={cn('p-6 rounded-2xl shadow-lg', isDark ? 'bg-gray-900' : 'bg-white')}
//         >
//           <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//             <Calendar className="w-5 h-5 text-green" />
//             Yearly Summary
//           </h3>
//           <ResponsiveContainer width="100%" height={250}>
//             <BarChart data={[
//               { name: 'Daily', income: analytics.daily.income, expense: analytics.daily.expense },
//               { name: 'Weekly', income: analytics.weekly.income, expense: analytics.weekly.expense },
//               { name: 'Monthly', income: analytics.monthly.income, expense: analytics.monthly.expense },
//               { name: 'Yearly', income: analytics.yearly.income, expense: analytics.yearly.expense }
//             ]}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="income" fill="#10b981" />
//               <Bar dataKey="expense" fill="#ef4444" />
//             </BarChart>
//           </ResponsiveContainer>
//         </motion.div>

//         {/* Budget Progress */}
//         <motion.div
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           className={cn('p-6 rounded-2xl shadow-lg', isDark ? 'bg-gray-900' : 'bg-white')}
//         >
//           <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//             <PiggyBank className="w-5 h-5 text-green" />
//             Budget Overview
//           </h3>
//           <div className="space-y-4 max-h-64 overflow-y-auto">
//             {budgets.length === 0 ? (
//               <p className="text-center text-gray-500 py-8">No budgets set</p>
//             ) : (
//               budgets.map((b, i) => (
//                 <div key={i} className="space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span className="font-medium">{b.category}</span>
//                     <span>₦{b.spent.toLocaleString()} / ₦{b.limit.toLocaleString()}</span>
//                   </div>
//                   <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
//                     <motion.div
//                       initial={{ width: 0 }}
//                       animate={{ width: `${b.percentage || 0}%` }}
//                       className={cn(
//                         'h-full rounded-full',
//                         b.percentage > 90 ? 'bg-red-500' : b.percentage > 70 ? 'bg-yellow-500' : 'bg-green'
//                       )}
//                     />
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </motion.div>
//       </div>

//       {/* Recent Transactions + To-Do */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Recent Transactions */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className={cn('p-6 rounded-2xl shadow-lg', isDark ? 'bg-gray-900' : 'bg-white')}
//         >
//           <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
//           <div className="space-y-3 max-h-64 overflow-y-auto">
//             {transactions.length === 0 ? (
//               <p className="text-center text-gray-500 py-8">No transactions</p>
//             ) : (
//               transactions.map((t) => (
//                 <div key={t._id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
//                   <div className="flex items-center gap-3">
//                     <div className={cn(
//                       'w-10 h-10 rounded-full flex items-center justify-center',
//                       t.type === 'income' ? 'bg-green/20' : 'bg-red/20'
//                     )}>
//                       {t.type === 'income' ? <TrendingUp className="w-5 h-5 text-green" /> : <TrendingDown className="w-5 h-5 text-red" />}
//                     </div>
//                     <div>
//                       <p className="font-medium">{t.category?.name || 'Uncategorized'}</p>
//                       <p className="text-xs text-gray-500">{format(new Date(t.date), 'MMM dd')}</p>
//                     </div>
//                   </div>
//                   <p className={cn('font-bold', t.type === 'income' ? 'text-green' : 'text-red-600')}>
//                     {t.type === 'income' ? '+' : '-'}₦{t.amount.toLocaleString()}
//                   </p>
//                 </div>
//               ))
//             )}
//           </div>
//         </motion.div>

//         {/* To-Do List */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className={cn('p-6 rounded-2xl shadow-lg', isDark ? 'bg-gray-900' : 'bg-white')}
//         >
//           <h3 className="text-lg font-semibold mb-4 flex items-center justify-between">
//             <span className="flex items-center gap-2">
//               <CheckSquare className="w-5 h-5 text-green" />
//               To-Do List
//             </span>
//             <span className="text-sm text-gray-500">{todos.length} tasks</span>
//           </h3>
//           <div className="flex gap-2 mb-4">
//             <input
//               type="text"
//               value={newTodo}
//               onChange={(e) => setNewTodo(e.target.value)}
//               onKeyPress={(e) => e.key === 'Enter' && addTodo()}
//               placeholder="Add a task..."
//               className={cn('flex-1 p-3 rounded-xl border', isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300')}
//             />
//             <button
//               onClick={addTodo}
//               className="bg-green text-white p-3 rounded-xl hover:bg-green/90"
//             >
//               <Plus className="w-5 h-5" />
//             </button>
//           </div>
//           <div className="space-y-2 max-h-64 overflow-y-auto">
//             {todos.length === 0 ? (
//               <p className="text-center text-gray-500 py-8">No tasks yet</p>
//             ) : (
//               todos.map((todo) => (
//                 <div key={todo._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
//                   <p className="font-medium">{todo.title}</p>
//                   <button
//                     onClick={() => deleteTodo(todo._id)}
//                     className="text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 p-1 rounded"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </button>
//                 </div>
//               ))
//             )}
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default DashboardOverview;

// src/components/DashboardOverview.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, DollarSign, PiggyBank, Receipt, Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  RadialBarChart, RadialBar, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend,
  AreaChart, Area
} from 'recharts';
import Loading from '../../utils/Loading';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../utils/cn';

const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b'];

const DashboardOverview = () => {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dashRes, analRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/dashboard`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/analytics`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const [dash, anal] = await Promise.all([dashRes.json(), analRes.json()]);

        if (dash.success && anal.success) {
          setDashboard(dash);
          setAnalytics(anal.analytics);
        } else {
          toast.error('Failed to load data');
        }
      } catch (err) {
        toast.error('Network error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  if (loading || !dashboard || !analytics) return <Loading />;

  const { user, summary, recent, budgets } = dashboard;
  const { daily, weekly, monthly, yearly } = analytics;

  // Donut: Income vs Expense (Overall)
  const donutData = [
    { name: 'Income', value: summary.income },
    { name: 'Expense', value: summary.expense }
  ];

  // Radial: Budget Usage per Category
  const radialData = budgets.map(b => {
    const percentage = b.limit > 0 ? Math.round((b.spent / b.limit) * 100) : 0;
    return {
      name: b.category,
      value: percentage,
      fill: percentage > 90 ? '#ef4444' : percentage > 70 ? '#f59e0b' : '#10b981'
    };
  });

  // Line Chart: Daily Trend
  const lineData = [
    { name: 'Income', value: daily.income },
    { name: 'Expense', value: daily.expense }
  ];

  // Area Chart: Weekly → Yearly Trend
  const areaData = [
    { name: 'Weekly', income: weekly.income, expense: weekly.expense },
    { name: 'Monthly', income: monthly.income, expense: monthly.expense },
    { name: 'Yearly', income: yearly.income, expense: yearly.expense }
  ];

  return (
    <div className={cn('p-4 space-y-6 min-h-screen', isDark ? 'bg-[#090909FF]' : 'bg-gray-50')}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="text-3xl font-bold text-green">Hi, {user.name}!</h1>
        <p className="text-sm text-gray-500">Your financial overview</p>
      </motion.div>

      {/* Grid Cards (like TransactionsPage) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Income', value: summary.income, icon: TrendingUp, color: 'text-green-600' },
          { label: 'Total Expense', value: summary.expense, icon: TrendingDown, color: 'text-red-600' },
          { label: 'Balance', value: Math.abs(summary.balance), icon: DollarSign, color: summary.balance >= 0 ? 'text-green-600' : 'text-red-600' },
          { label: 'Transactions', value: recent.length, icon: Receipt, color: 'text-blue-600' }
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn('p-5 rounded-2xl shadow-lg', isDark ? 'bg-gray-900' : 'bg-white')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className={cn('text-2xl font-bold', card.color)}>
                  {card.label === 'Transactions' ? card.value : `₦${card.value.toLocaleString()}`}
                </p>
              </div>
              <card.icon className={cn('w-10 h-10', card.color)} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Donut + Radial Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut: Income vs Expense */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn('p-6 rounded-2xl shadow-lg', isDark ? 'bg-gray-900' : 'bg-white')}
        >
          <h3 className="text-lg font-semibold mb-4">Income vs Expense</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {donutData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `₦${v.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Radial: Budget Usage */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn('p-6 rounded-2xl shadow-lg', isDark ? 'bg-gray-900' : 'bg-white')}
        >
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
                  <p className="text-xs mt-1 font-medium">{d.name}</p>
                  <p className="text-xs text-gray-500">{d.value}% used</p>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Line Chart: Daily */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn('p-6 rounded-2xl shadow-lg', isDark ? 'bg-gray-900' : 'bg-white')}
      >
        <h3 className="text-lg font-semibold mb-4">Today’s Flow</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(v) => `₦${v.toLocaleString()}`} />
            <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981' }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Area Chart: Weekly → Yearly */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn('p-6 rounded-2xl shadow-lg', isDark ? 'bg-gray-900' : 'bg-white')}
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-green" />
          Weekly, Monthly, Yearly Trend
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={areaData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(v) => `₦${v.toLocaleString()}`} />
            <Legend />
            <Area type="monotone" dataKey="income" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
            <Area type="monotone" dataKey="expense" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn('p-6 rounded-2xl shadow-lg', isDark ? 'bg-gray-900' : 'bg-white')}
      >
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {recent.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No transactions</p>
          ) : (
            recent.map((t, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    t.type === 'income' ? 'bg-green/20' : 'bg-red/20'
                  )}>
                    {t.type === 'income' ? <TrendingUp className="w-5 h-5 text-green" /> : <TrendingDown className="w-5 h-5 text-red" />}
                  </div>
                  <div>
                    <p className="font-medium">{t.title || 'Untitled'}</p>
                    <p className="text-xs text-gray-500">{format(new Date(t.date), 'MMM dd, yyyy')}</p>
                  </div>
                </div>
                <p className={cn('font-bold', t.type === 'income' ? 'text-green' : 'text-red-600')}>
                  {t.type === 'income' ? '+' : '-'}₦{t.amount.toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardOverview;