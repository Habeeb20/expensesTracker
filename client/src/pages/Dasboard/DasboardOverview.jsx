/* eslint-disable no-unused-vars */
// src/components/DashboardOverview.jsx
// src/components/DashboardOverview.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, DollarSign, Receipt, Calendar,
  PiggyBank, ArrowRight
} from 'lucide-react';
import {
  format, startOfDay, endOfDay, startOfWeek, endOfWeek,
  startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval
} from 'date-fns';
import { toast } from 'sonner';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  RadialBarChart, RadialBar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Legend, AreaChart, Area
} from 'recharts';
import Loading from '../../utils/Loading';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../utils/cn';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6'];

const DashboardOverview = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [transLent, setTranLengt] = useState([])
  const [transactionSummary, setTransactionSummary] = useState({});

  const token = localStorage.getItem('token');

  /* --------------------------------------------------------------
     FETCH ALL DATA (FIXED: unique variable names)
     -------------------------------------------------------------- */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        // Step 1: Fetch all responses
        const [dashRes, analRes, budgetRes, transRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/dashboard`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/analytics`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/budgets`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/transactions`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        // Step 2: Parse JSON with UNIQUE variable names
        const dashJson   = await dashRes.json();
        const analJson   = await analRes.json();
        const budgetJson = await budgetRes.json();
        const transJson  = await transRes.json();

        console.log(transJson)

        // Step 3: Validate and set state
        if (
          dashJson.success &&
          analJson.success &&
          budgetJson.success &&
          transJson.success
        ) {
          setDashboard(dashJson);
          setAnalytics(analJson.analytics);
          setBudgets(budgetJson.budgets);
          setTransactionSummary(transJson.summary || {});
          setTranLengt(transJson.transactions)
        } else {
          toast.error('Failed to load data');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        toast.error('Network error');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [token]);

  if (loading || !dashboard || !analytics) return <Loading />;

  const { user, recent } = dashboard;
  const { daily, weekly, monthly, yearly } = analytics;

  // REAL INCOME / EXPENSE / BALANCE from /api/transactions
  const income  = transactionSummary.income   ?? 0;
  const expense = transactionSummary.expense  ?? 0;
  const transaction = transLent  ?? 0;
  const balance = income - expense;

  /* --------------------------------------------------------------
     FILTER BUDGETS BY PERIOD
     -------------------------------------------------------------- */
  const filterBudgets = (startFn, endFn) => {
    const now = new Date();
    return budgets.filter(b => {
      const due = new Date(b.dueDate);
      return isWithinInterval(due, { start: startFn(now), end: endFn(now) });
    });
  };

  const dailyBudgets   = filterBudgets(startOfDay,   endOfDay);
  const weeklyBudgets  = filterBudgets(startOfWeek,  endOfWeek);
  const monthlyBudgets = filterBudgets(startOfMonth, endOfMonth);
  const yearlyBudgets  = filterBudgets(startOfYear,  endOfYear);

  /* --------------------------------------------------------------
     TOP 5 EXPENSE CATEGORIES (SAFE)
     -------------------------------------------------------------- */
  const topExpenseCats = (() => {
    if (!recent || !Array.isArray(recent)) return [];

    const map = recent
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        const name = t.category?.name || 'Other';
        acc[name] = (acc[name] || 0) + t.amount;
        return acc;
      }, {});

    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  })();

  /* --------------------------------------------------------------
     CHART DATA
     -------------------------------------------------------------- */
  const donutIncomeExpense = [
    { name: 'Income',  value: income },
    { name: 'Expense', value: expense }
  ];

  const radialBudgetHealth = budgets.map(b => {
    const pct = b.limit > 0 ? Math.round((b.spent / b.limit) * 100) : 0;
    return {
      name: b.category,
      value: pct,
      fill: pct > 90 ? '#ef4444' : pct > 70 ? '#f59e0b' : '#10b981'
    };
  });

  const lineToday = [
    { name: 'Income',  value: daily.income  || 0 },
    { name: 'Expense', value: daily.expense || 0 }
  ];

  const areaTrend = [
    { name: 'Weekly',  income: weekly.income  || 0, expense: weekly.expense  || 0 },
    { name: 'Monthly', income: monthly.income || 0, expense: monthly.expense || 0 },
    { name: 'Yearly',  income: yearly.income  || 0, expense: yearly.expense  || 0 }
  ];

  /* --------------------------------------------------------------
     RENDER
     -------------------------------------------------------------- */
  return (
    <div className={cn('p-4 space-y-8 min-h-screen', isDark ? 'bg-[#090909FF]' : 'bg-gray-50')}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="text-3xl font-bold text-green">Hi, {user?.name || 'User'}!</h1>
        <p className="text-sm text-gray-500">Your financial snapshot</p>
      </motion.div>

      {/* SUMMARY CARDS – REAL DATA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Income',      value: income,   icon: TrendingUp,   color: 'text-green-600' },
          { label: 'Total Expense',     value: expense,  icon: TrendingDown, color: 'text-red-600' },
          { label: 'Balance',           value: Math.abs(balance), icon: DollarSign,
            color: balance >= 0 ? 'text-green-600' : 'text-red-600' },
          { label: 'Transactions',      value: transaction.length || 0, icon: Receipt, color: 'text-blue-600' }
        ].map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn('p-5 rounded-2xl shadow-lg', isDark ? 'bg-gray-900' : 'bg-white')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{c.label}</p>
                <p className={cn('text-2xl font-bold', c.color)}>
                  {c.label === 'Transactions' ? c.value : `₦${c.value.toLocaleString()}`}
                </p>
              </div>
              <c.icon className={cn('w-10 h-10', c.color)} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Donut + Radial */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expense */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className={cn('p-6 rounded-2xl shadow-lg', isDark ? 'bg-gray-900' : 'bg-white')}>
          <h3 className="text-lg font-semibold mb-4">Income vs Expense</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={donutIncomeExpense} cx="50%" cy="50%" innerRadius={70} outerRadius={110}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                {donutIncomeExpense.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={v => `₦${v.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Budget Health */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          className={cn('p-6 rounded-2xl shadow-lg', isDark ? 'bg-gray-900' : 'bg-white')}>
          <h3 className="text-lg font-semibold mb-4">Budget Health</h3>
          <div className="grid grid-cols-2 gap-4">
            {radialBudgetHealth.length === 0 ? (
              <p className="col-span-2 text-center text-gray-500">No budgets</p>
            ) : (
              radialBudgetHealth.map((d, i) => (
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

      {/* Today’s Flow */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className={cn('p-6 rounded-2xl shadow-lg', isDark ? 'bg-gray-900' : 'bg-white')}>
        <h3 className="text-lg font-semibold mb-4">Today’s Flow</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={lineToday}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={v => `₦${v.toLocaleString()}`} />
            <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981' }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Trend Area Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className={cn('p-6 rounded-2xl shadow-lg', isDark ? 'bg-gray-900' : 'bg-white')}>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-green" />
          Weekly to Yearly Trend
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={areaTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={v => `₦${v.toLocaleString()}`} />
            <Legend />
            <Area type="monotone" dataKey="income" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
            <Area type="monotone" dataKey="expense" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* PERIODIC SECTIONS */}
      {[
        { title: 'Daily',   budgets: dailyBudgets,   expense: daily.expense   || 0 },
        { title: 'Weekly',  budgets: weeklyBudgets,  expense: weekly.expense  || 0 },
        { title: 'Monthly', budgets: monthlyBudgets, expense: monthly.expense || 0 },
        { title: 'Yearly',  budgets: yearlyBudgets,  expense: yearly.expense  || 0 }
      ].map((period, idx) => {
        const budgetDonut = period.budgets.map(b => ({
          name: b.category,
          value: b.limit
        }));

        return (
          <motion.section
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15 }}
            className={cn('p-6 rounded-2xl shadow-lg space-y-6', isDark ? 'bg-gray-900' : 'bg-white')}
          >
            <h2 className="text-xl font-bold flex items-center gap-2">
              <PiggyBank className="w-6 h-6 text-green" />
              {period.title} Overview
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Budget List */}
              <div className="lg:col-span-1">
                <h4 className="font-medium mb-2">Budgets</h4>
                {period.budgets.length === 0 ? (
                  <p className="text-gray-500 text-sm">No budgets for this period</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {period.budgets.map(b => {
                      const pct = b.limit > 0 ? (b.spent / b.limit) * 100 : 0;
                      return (
                        <div
                          key={b._id}
                          onClick={() => navigate('/budgets')}
                          className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-sm">{b.category}</p>
                              <p className="text-xs text-gray-500">
                                Due {format(new Date(b.dueDate), 'MMM dd')}
                              </p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-green" />
                          </div>
                          <div className="mt-1 flex justify-between text-xs">
                            <span>₦{b.spent.toLocaleString()} / ₦{b.limit.toLocaleString()}</span>
                            <span className={cn(pct >= 100 ? 'text-red-600' : 'text-green')}>
                              {pct.toFixed(0)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                            <div
                              className={cn('h-full rounded-full', pct >= 100 ? 'bg-red-500' : 'bg-green')}
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Top Spending */}
              <div className="lg:col-span-1">
                <h4 className="font-medium mb-2">Top Spending</h4>
                {topExpenseCats.length === 0 ? (
                  <p className="text-gray-500 text-sm">No expenses</p>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={topExpenseCats}
                        cx="50%" cy="50%" outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {topExpenseCats.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={v => `₦${v.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Budget Split */}
              <div className="lg:col-span-1">
                <h4 className="font-medium mb-2">Budget Split</h4>
                {budgetDonut.length === 0 ? (
                  <p className="text-gray-500 text-sm">No budgets</p>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={budgetDonut}
                        cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {budgetDonut.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={v => `₦${v.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </motion.section>
        );
      })}

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn('p-6 rounded-2xl shadow-lg', isDark ? 'bg-gray-900' : 'bg-white')}
      >
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {(!recent || recent.length === 0) ? (
            <p className="text-center text-gray-500 py-8">No transactions yet</p>
          ) : (
            recent.map((t, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    t.type === 'income' ? 'bg-green/20' : 'bg-red/20'
                  )}>
                    {t.type === 'income' ? (
                      <TrendingUp className="w-5 h-5 text-green" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{t.title || t.category?.name || 'Untitled'}</p>
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









// // src/components/DashboardOverview.jsx
// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import {
//   TrendingUp, TrendingDown, DollarSign, Receipt, Calendar,
//   PiggyBank, ArrowRight
// } from 'lucide-react';
// import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval } from 'date-fns';
// import { toast } from 'sonner';
// import {
//   PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
//   RadialBarChart, RadialBar, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend,
//   AreaChart, Area
// } from 'recharts';
// import Loading from '../../utils/Loading';
// import { useTheme } from '../../contexts/ThemeContext';
// import { cn } from '../../utils/cn';
// import { useNavigate } from 'react-router-dom';

// const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6'];

// const DashboardOverview = () => {
//   const { isDark } = useTheme();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);
//   const [dashboard, setDashboard] = useState(null);
//   const [analytics, setAnalytics] = useState(null);
//   const [budgets, setBudgets] = useState([]);
//   const [categories, setCategories] = useState([]);

//   const token = localStorage.getItem('token');

//   /* --------------------------------------------------------------
//      FETCH ALL DATA IN PARALLEL
//      -------------------------------------------------------------- */
//   useEffect(() => {
//     const fetchAll = async () => {
//       try {
//         setLoading(true);
//         const [dashRes, transactRes, analRes, budgetRes, catRes] = await Promise.all([
//           fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/dashboard`, {
//             headers: { Authorization: `Bearer ${token}` }
//           }),
//           fetch(`${import.meta.env.VITE_BACKEND_URL}/api/transactions`, {
//             headers: { Authorization: `Bearer ${token}` }
//           }),
//           fetch(`${import.meta.env.VITE_BACKEND_URL}/api/analytics`, {
//             headers: { Authorization: `Bearer ${token}` }
//           }),
//           fetch(`${import.meta.env.VITE_BACKEND_URL}/api/budgets`, {
//             headers: { Authorization: `Bearer ${token}` }
//           }),
//           fetch(`${import.meta.env.VITE_BACKEND_URL}/api/categories`, {
//             headers: { Authorization: `Bearer ${token}` }
//           })
//         ]);

//         const [dash, anal,  budgetJson, catJson] = await Promise.all([
//           dashRes.json(),
  
//           analRes.json(),
//           budgetRes.json(),
//           catRes.json()
//         ]);
        

//         if (dash.success &&  anal.success && budgetJson.success && catJson.success) {
//           setDashboard(dash);
//           setAnalytics(anal.analytics);
//           setBudgets(budgetJson.budgets);
//           setCategories(catJson.categories);
//         } else {
//           toast.error('Failed to load data');
//         }
//       } catch (err) {
//         console.error('Fetch error:', err);
//         toast.error('Network error');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAll();
//   }, [token]);

//   if (loading || !dashboard || !analytics) return <Loading />;

//   // FIXED: Correct destructuring
//   const { user, summary, recent } = dashboard; // ← from dashboard
//   const { daily, weekly, monthly, yearly, } = analytics; // ← from analytics

//   /* --------------------------------------------------------------
//      Filter budgets by period (Daily, Weekly, Monthly, Yearly)
//      -------------------------------------------------------------- */
//   const filterBudgets = (startFn, endFn) => {
//     const now = new Date();
//     const start = startFn(now);
//     const end = endFn(now);
//     return budgets.filter(b => {
//       const due = new Date(b.dueDate);
//       return isWithinInterval(due, { start, end });
//     });
//   };

//   const dailyBudgets = filterBudgets(startOfDay, endOfDay);
//   const weeklyBudgets = filterBudgets(startOfWeek, endOfWeek);
//   const monthlyBudgets = filterBudgets(startOfMonth, endOfMonth);
//   const yearlyBudgets = filterBudgets(startOfYear, endOfYear);

//   /* --------------------------------------------------------------
//      Top 5 expense categories (SAFE)
//      -------------------------------------------------------------- */
//   const topExpenseCats = (() => {
//     if (!recent || !Array.isArray(recent)) return [];

//     const map = recent
//       .filter(t => t.type === 'expense')
//       .reduce((acc, t) => {
//         const name = t.category?.name || 'Other';
//         acc[name] = (acc[name] || 0) + t.amount;
//         return acc;
//       }, {});

//     return Object.entries(map)
//       .map(([name, value]) => ({ name, value }))
//       .sort((a, b) => b.value - a.value)
//       .slice(0, 5);
//   })();

//   /* --------------------------------------------------------------
//      Chart Data
//      -------------------------------------------------------------- */
//   const donutIncomeExpense = [
//     { name: 'Income', value: summary.income || 0 },
//     { name: 'Expense', value: summary.expense || 0 }
//   ];

//   const radialBudgetHealth = budgets.map(b => {
//     const pct = b.limit > 0 ? Math.round((b.spent / b.limit) * 100) : 0;
//     return {
//       name: b.category,
//       value: pct,
//       fill: pct > 90 ? '#ef4444' : pct > 70 ? '#f59e0b' : '#10b981'
//     };
//   });

//   const lineToday = [
//     { name: 'Income', value: daily.income || 0 },
//     { name: 'Expense', value: daily.expense || 0 }
//   ];

//   const areaTrend = [
//     { name: 'Weekly', income: weekly.income || 0, expense: weekly.expense || 0 },
//     { name: 'Monthly', income: monthly.income || 0, expense: monthly.expense || 0 },
//     { name: 'Yearly', income: yearly.income || 0, expense: yearly.expense || 0 }
//   ];

//   /* --------------------------------------------------------------
//      Render
//      -------------------------------------------------------------- */
//   return (
//     <div className={cn('p-4 space-y-8 min-h-screen', isDark ? 'bg-[#090909FF]' : 'bg-gray-50')}>
//       {/* Header */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="text-center"
//       >
//         <h1 className="text-3xl font-bold text-green">Hi, {user?.name || 'User'}!</h1>
//         <p className="text-sm text-gray-500">Your financial snapshot</p>
//       </motion.div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {[
//           { label: 'Total Income', value: summary.income || 0, icon: TrendingUp, color: 'text-green-600' },
//           { label: 'Total Expense', value: summary.expense || 0, icon: TrendingDown, color: 'text-red-600' },
//           {
//             label: 'Balance',
//             value: Math.abs((summary.income || 0) - (summary.expense || 0)),
//             icon: DollarSign,
//             color: (summary.income || 0) >= (summary.expense || 0) ? 'text-green-600' : 'text-red-600'
//           },
//           { label: 'Transactions', value: recent?.length || 0, icon: Receipt, color: 'text-blue-600' }
//         ].map((c, i) => (
//           <motion.div
//             key={i}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: i * 0.1 }}
//             className={cn('p-5 rounded-2xl shadow-lg', isDark ? 'bg-gray-900' : 'bg-white')}
//           >
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500">{c.label}</p>
//                 <p className={cn('text-2xl font-bold', c.color)}>
//                   {c.label === 'Transactions' ? c.value : `₦${c.value.toLocaleString()}`}
//                 </p>
//               </div>
//               <c.icon className={cn('w-10 h-10', c.color)} />
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       {/* Donut + Radial Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Income vs Expense Donut */}
//         <motion.div
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           className={cn('p-6 rounded-2xl shadow-lg', isDark ? 'bg-gray-900' : 'bg-white')}
//         >
//           <h3 className="text-lg font-semibold mb-4">Income vs Expense</h3>
//           <ResponsiveContainer width="100%" height={280}>
//             <PieChart>
//               <Pie
//                 data={donutIncomeExpense}
//                 cx="50%" cy="50%" innerRadius={70} outerRadius={110}
//                 dataKey="value"
//                 label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//               >
//                 {donutIncomeExpense.map((_, i) => (
//                   <Cell key={i} fill={COLORS[i % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip formatter={(v) => `₦${v.toLocaleString()}`} />
//             </PieChart>
//           </ResponsiveContainer>
//         </motion.div>

//         {/* Budget Health Radial */}
//         <motion.div
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           className={cn('p-6 rounded-2xl shadow-lg', isDark ? 'bg-gray-900' : 'bg-white')}
//         >
//           <h3 className="text-lg font-semibold mb-4">Budget Health</h3>
//           <div className="grid grid-cols-2 gap-4">
//             {radialBudgetHealth.length === 0 ? (
//               <p className="col-span-2 text-center text-gray-500">No budgets</p>
//             ) : (
//               radialBudgetHealth.map((d, i) => (
//                 <div key={i} className="flex flex-col items-center">
//                   <ResponsiveContainer width={90} height={90}>
//                     <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="80%" data={[d]}>
//                       <RadialBar dataKey="value" fill={d.fill} background />
//                     </RadialBarChart>
//                   </ResponsiveContainer>
//                   <p className="text-xs mt-1 font-medium">{d.name}</p>
//                   <p className="text-xs text-gray-500">{d.value}% used</p>
//                 </div>
//               ))
//             )}
//           </div>
//         </motion.div>
//       </div>

//       {/* Today’s Flow */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className={cn('p-6 rounded-2xl shadow-lg', isDark ? 'bg-gray-900' : 'bg-white')}
//       >
//         <h3 className="text-lg font-semibold mb-4">Today’s Flow</h3>
//         <ResponsiveContainer width="100%" height={200}>
//           <LineChart data={lineToday}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip formatter={(v) => `₦${v.toLocaleString()}`} />
//             <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981' }} />
//           </LineChart>
//         </ResponsiveContainer>
//       </motion.div>

//       {/* Weekly → Yearly Trend */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className={cn('p-6 rounded-2xl shadow-lg', isDark ? 'bg-gray-900' : 'bg-white')}
//       >
//         <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//           <Calendar className="w-5 h-5 text-green" />
//           Weekly, Monthly, Yearly Trend
//         </h3>
//         <ResponsiveContainer width="100%" height={300}>
//           <AreaChart data={areaTrend}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip formatter={(v) => `₦${v.toLocaleString()}`} />
//             <Legend />
//             <Area type="monotone" dataKey="income" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
//             <Area type="monotone" dataKey="expense" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
//           </AreaChart>
//         </ResponsiveContainer>
//       </motion.div>

//       {/* Periodic Sections: Daily / Weekly / Monthly / Yearly */}
//       {[
//         { title: 'Daily', budgets: dailyBudgets, expense: daily.expense || 0 },
//         { title: 'Weekly', budgets: weeklyBudgets, expense: weekly.expense || 0 },
//         { title: 'Monthly', budgets: monthlyBudgets, expense: monthly.expense || 0 },
//         { title: 'Yearly', budgets: yearlyBudgets, expense: yearly.expense || 0 }
//       ].map((period, idx) => {
//         const budgetDonut = period.budgets.map(b => ({
//           name: b.category,
//           value: b.limit
//         }));

//         return (
//           <motion.section
//             key={idx}
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: idx * 0.15 }}
//             className={cn('p-6 rounded-2xl shadow-lg space-y-6', isDark ? 'bg-gray-900' : 'bg-white')}
//           >
//             <h2 className="text-xl font-bold flex items-center gap-2">
//               <PiggyBank className="w-6 h-6 text-green" />
//               {period.title} Overview
//             </h2>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//               {/* Budget List */}
//               <div className="lg:col-span-1">
//                 <h4 className="font-medium mb-2">Budgets</h4>
//                 {period.budgets.length === 0 ? (
//                   <p className="text-gray-500 text-sm">No budgets for this period</p>
//                 ) : (
//                   <div className="space-y-2 max-h-64 overflow-y-auto">
//                     {period.budgets.map(b => {
//                       const pct = b.limit > 0 ? (b.spent / b.limit) * 100 : 0;
//                       return (
//                         <div
//                           key={b._id}
//                           onClick={() => navigate('/budgets')}
//                           className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
//                         >
//                           <div className="flex justify-between items-center">
//                             <div>
//                               <p className="font-medium text-sm">{b.category}</p>
//                               <p className="text-xs text-gray-500">
//                                 Due {format(new Date(b.dueDate), 'MMM dd')}
//                               </p>
//                             </div>
//                             <ArrowRight className="w-4 h-4 text-green" />
//                           </div>
//                           <div className="mt-1 flex justify-between text-xs">
//                             <span>₦{b.spent.toLocaleString()} / ₦{b.limit.toLocaleString()}</span>
//                             <span className={cn(pct >= 100 ? 'text-red-600' : 'text-green')}>
//                               {pct.toFixed(0)}%
//                             </span>
//                           </div>
//                           <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
//                             <div
//                               className={cn('h-full rounded-full', pct >= 100 ? 'bg-red-500' : 'bg-green')}
//                               style={{ width: `${Math.min(pct, 100)}%` }}
//                             />
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>

//               {/* Top Spending Pie */}
//               <div className="lg:col-span-1">
//                 <h4 className="font-medium mb-2">Top Spending</h4>
//                 {topExpenseCats.length === 0 ? (
//                   <p className="text-gray-500 text-sm">No expenses</p>
//                 ) : (
//                   <ResponsiveContainer width="100%" height={220}>
//                     <PieChart>
//                       <Pie
//                         data={topExpenseCats}
//                         cx="50%" cy="50%" outerRadius={80}
//                         dataKey="value"
//                         label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                       >
//                         {topExpenseCats.map((_, i) => (
//                           <Cell key={i} fill={COLORS[i % COLORS.length]} />
//                         ))}
//                       </Pie>
//                       <Tooltip formatter={(v) => `₦${v.toLocaleString()}`} />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 )}
//               </div>

//               {/* Budget Allocation Donut */}
//               <div className="lg:col-span-1">
//                 <h4 className="font-medium mb-2">Budget Split</h4>
//                 {budgetDonut.length === 0 ? (
//                   <p className="text-gray-500 text-sm">No budgets</p>
//                 ) : (
//                   <ResponsiveContainer width="100%" height={220}>
//                     <PieChart>
//                       <Pie
//                         data={budgetDonut}
//                         cx="50%" cy="50%" innerRadius={50} outerRadius={80}
//                         dataKey="value"
//                         label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                       >
//                         {budgetDonut.map((_, i) => (
//                           <Cell key={i} fill={COLORS[i % COLORS.length]} />
//                         ))}
//                       </Pie>
//                       <Tooltip formatter={(v) => `₦${v.toLocaleString()}`} />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 )}
//               </div>
//             </div>
//           </motion.section>
//         );
//       })}

//       {/* Recent Activity */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className={cn('p-6 rounded-2xl shadow-lg', isDark ? 'bg-gray-900' : 'bg-white')}
//       >
//         <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
//         <div className="space-y-3 max-h-64 overflow-y-auto">
//           {(!recent || recent.length === 0) ? (
//             <p className="text-center text-gray-500 py-8">No transactions yet</p>
//           ) : (
//             recent.map((t, i) => (
//               <div
//                 key={i}
//                 className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
//               >
//                 <div className="flex items-center gap-3">
//                   <div className={cn(
//                     'w-10 h-10 rounded-full flex items-center justify-center',
//                     t.type === 'income' ? 'bg-green/20' : 'bg-red/20'
//                   )}>
//                     {t.type === 'income' ? (
//                       <TrendingUp className="w-5 h-5 text-green" />
//                     ) : (
//                       <TrendingDown className="w-5 h-5 text-red" />
//                     )}
//                   </div>
//                   <div>
//                     <p className="font-medium">{t.title || t.category?.name || 'Untitled'}</p>
//                     <p className="text-xs text-gray-500">{format(new Date(t.date), 'MMM dd, yyyy')}</p>
//                   </div>
//                 </div>
//                 <p className={cn('font-bold', t.type === 'income' ? 'text-green' : 'text-red-600')}>
//                   {t.type === 'income' ? '+' : '-'}₦{t.amount.toLocaleString()}
//                 </p>
//               </div>
//             ))
//           )}
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default DashboardOverview;