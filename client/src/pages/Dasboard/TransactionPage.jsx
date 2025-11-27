/* eslint-disable no-unused-vars */



// import React, { useState, useEffect, useRef } from 'react';
// import { motion } from 'framer-motion';
// import { Plus, X, DollarSign, TrendingUp, TrendingDown, Calendar, Filter, Share2, Download, Copy } from 'lucide-react';
// import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
// import { format } from 'date-fns';
// import { toast } from 'sonner';
// import Loading from '../../utils/Loading';
// import { useTheme } from '../../contexts/ThemeContext';
// import { cn } from '../../utils/cn';
// import CategoryForm from './CategoryForm';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import ReceiptScanner from './ReceiptScanner';
// import ImageLoadingSpinner from '../../utils/Loading';

// const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6'];

// const TransactionsPage = () => {
//   const { isDark } = useTheme();
//   const [showForm, setShowForm] = useState(false);
//   const [type, setType] = useState('expense');
//   const [amount, setAmount] = useState('');
//   const [category, setCategory] = useState('');
//   const [description, setDescription] = useState('');
//   const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState({ transactions: [], summary: {}, categories: [] });

//   // Modal + Receipt
//   const [selectedTx, setSelectedTx] = useState(null);
//   const receiptRef = useRef();

//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const [transRes, catRes] = await Promise.all([
//         fetch(`${import.meta.env.VITE_BACKEND_URL}/api/transactions`, {
//           headers: { Authorization: `Bearer ${token}` }
//         }),
//         fetch(`${import.meta.env.VITE_BACKEND_URL}/api/categories`, {
//           headers: { Authorization: `Bearer ${token}` }
//         })
//       ]);

//       const trans = await transRes.json();
//       const cats = await catRes.json();

//       if (trans.success && cats.success) {
//         setData({
//           transactions: trans.transactions,
//           summary: trans.summary,
//           categories: cats.categories
//         });
//       }
//     } catch (err) {
//       console.log(err);
//       toast.error('Failed to load data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!amount || !category) return toast.error('Fill required fields');

//     try {
//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/transaction`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ amount: +amount, type, category, description, date })
//       });

//       const json = await res.json();
//       if (json.success) {
//         toast.success(`${type === 'income' ? 'Income' : 'Expense'} added!`);
//         setShowForm(false);
//         resetForm();
//         fetchData();
//       } else {
//         console.log(json.message)
//         toast.error(json.message);
//       }
//     } catch (err) {
//       console.log(err);
//       toast.error('Failed to save');
//     }
//   };

//   const resetForm = () => {
//     setAmount(''); setCategory(''); setDescription(''); setDate(format(new Date(), 'yyyy-MM-dd'));
//   };

//   const filteredCategories = data.categories.filter(c => c.type === type);

//   const pieData = [
//     { name: 'Income', value: data.summary.income || 0 },
//     { name: 'Expense', value: data.summary.expense || 0 }
//   ];

//   const topExpenses = Object.entries(
//     data.transactions
//       .filter(t => t.type === 'expense')
//       .reduce((acc, t) => {
//         const cat = t.category?.name || 'Other';
//         acc[cat] = (acc[cat] || 0) + t.amount;
//         return acc;
//       }, {})
//   )
//     .map(([name, value]) => ({ name, value }))
//     .sort((a, b) => b.value - a.value)
//     .slice(0, 5);

//   const historyData = data.transactions
//     .sort((a, b) => new Date(a.date) - new Date(b.date))
//     .reduce((acc, t) => {
//       const dateKey = format(new Date(t.date), 'MMM dd');
//       const existing = acc.find(d => d.date === dateKey);
//       if (existing) {
//         if (t.type === 'income') existing.income += t.amount;
//         else existing.expense += t.amount;
//       } else {
//         acc.push({
//           date: dateKey,
//           income: t.type === 'income' ? t.amount : 0,
//           expense: t.type === 'expense' ? t.amount : 0
//         });
//       }
//       return acc;
//     }, []);

//   // Open modal
//   const openDetails = (tx) => setSelectedTx(tx);

//   // Share receipt
//   const shareReceipt = () => {
//     const text = `Transaction Receipt\n\n` +
//       `Amount: ₦${selectedTx.amount.toLocaleString()}\n` +
//       `Type: ${selectedTx.type.toUpperCase()}\n` +
//       `Category: ${selectedTx.category?.name || 'N/A'}\n` +
//       `Date: ${format(new Date(selectedTx.date), 'dd MMM yyyy')}\n` +
//       `${selectedTx.description ? `Note: ${selectedTx.description}\n` : ''}` +
//       `\nPowered by Your App`;

//     if (navigator.share) {
//       navigator.share({ text });
//     } else {
//       navigator.clipboard.writeText(text);
//       toast.success('Receipt copied!');
//     }
//   };

//   // Export PDF
//   const exportPDF = async () => {
//     const element = receiptRef.current;
//     const canvas = await html2canvas(element);
//     const img = canvas.toDataURL('image/png');
//     const pdf = new jsPDF();
//     const width = pdf.internal.pageSize.getWidth();
//     const height = (canvas.height * width) / canvas.width;
//     pdf.addImage(img, 'PNG', 0, 0, width, height);
//     pdf.save(`receipt-${selectedTx._id.slice(-6)}.pdf`);
//     toast.success('Receipt downloaded!');
//   };

//   if (loading) return <Loading />;

//   return (
//     <div className={cn('p-4 space-y-6', isDark ? 'bg-[#090909FF]' : 'bg-gray-50')}>
//       {/* === ALL YOUR ORIGINAL CODE UNTIL TRANSACTION LIST === */}
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-green">Transactions</h1>
//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={() => setShowForm(!showForm)}
//           className="flex items-center gap-2 bg-green text-white px-4 py-2 rounded-xl shadow-lg"
//         >
//           <Plus className="w-5 h-5" />
//           Add {type === 'income' ? 'Income' : 'Expense'}
//         </motion.button>
//       </div>
//       <ReceiptScanner onExpenseDetected={(exp) =>handleSubmit(exp)} />
      

//       {/* Warning Banner */}
//       {data.summary.warning && (
//         <motion.div
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className={cn(
//             'p-4 rounded-xl font-medium',
//             data.summary.warning.type === 'over_budget'
//               ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
//               : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
//           )}
//         >
//           {data.summary.warning.message}
//         </motion.div>
//       )}

//       {/* Form */}
//       {showForm && (
//         <motion.form
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           onSubmit={handleSubmit}
//           className={cn(
//             'p-6 rounded-2xl shadow-xl space-y-4',
//             isDark ? 'bg-gray-900' : 'bg-white'
//           )}
//         >
//           <div className="flex justify-between items-center">
//             <h2 className="text-xl font-semibold">New {type === 'income' ? 'Income' : 'Expense'}</h2>
//             <button type="button" onClick={() => setShowForm(false)}>
//               <X className="w-5 h-5" />
//             </button>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Type</label>
//               <select
//                 value={type}
//                 onChange={(e) => { setType(e.target.value); setCategory(''); }}
//                 className={cn('w-full p-3 rounded-xl border', isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300')}
//               >
//                 <option value="expense">Expense</option>
//                 <option value="income">Income</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Amount</label>
//               <input
//                 type="number"
//                 value={amount}
//                 onChange={(e) => setAmount(e.target.value)}
//                 placeholder="0.00"
//                 className={cn('w-full p-3 rounded-xl border', isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300')}
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Category</label>
//               <select
//                 value={category}
//                 onChange={(e) => setCategory(e.target.value)}
//                 className={cn('w-full p-3 rounded-xl border', isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300')}
//                 required
//               >
//                 <option value="">Select category</option>
//                 {filteredCategories.map(cat => (
//                   <option key={cat._id} value={cat._id}>{cat.name}</option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Date</label>
//               <input
//                 type="date"
//                 value={date}
//                 onChange={(e) => setDate(e.target.value)}
//                 className={cn('w-full p-3 rounded-xl border', isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300')}
//               />
//             </div>
//           </div>

//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             placeholder="Description (optional)"
//             rows={2}
//             className={cn('w-full p-3 rounded-xl border', isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300')}
//           />

//           <div className="flex gap-3">
//             <button
//               type="submit"
//               className="flex-1 bg-green text-white py-3 rounded-xl font-medium hover:bg-green/90 transition"
//             >
//               Save
//               {loading ? (<ImageLoadingSpinner />) : "saving..."}
//             </button>
//             <button
//               type="button"
//               onClick={() => setShowForm(false)}
//               className="flex-1 bg-gray-300 dark:bg-gray-700 py-3 rounded-xl font-medium"
//             >
//               Cancel
//             </button>
//           </div>
//         </motion.form>
//       )}

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         <div className={cn('p-5 rounded-xl shadow-md', isDark ? 'bg-gray-900' : 'bg-white')}>
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Total Income</p>
//               <p className="text-2xl font-bold text-green-600">₦{data.summary.income?.toLocaleString() || 0}</p>
//             </div>
//             <TrendingUp className="w-8 h-8 text-green-600" />
//           </div>
//         </div>

//         <div className={cn('p-5 rounded-xl shadow-md', isDark ? 'bg-gray-900' : 'bg-white')}>
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Total Expense</p>
//               <p className="text-2xl font-bold text-red-600">₦{data.summary.expense?.toLocaleString() || 0}</p>
//             </div>
//             <TrendingDown className="w-8 h-8 text-red-600" />
//           </div>
//         </div>

//         <div className={cn('p-5 rounded-xl shadow-md', isDark ? 'bg-gray-900' : 'bg-white')}>
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Balance</p>
//               <p className={cn('text-2xl font-bold', data.summary.total >= 0 ? 'text-green-600' : 'text-red-600')}>
//                 ₦{Math.abs(data.summary.total || 0).toLocaleString()}
//               </p>
//             </div>
//             <DollarSign className="w-8 h-8 text-green-600" />
//           </div>
//         </div>

//         <div className={cn('p-5 rounded-xl shadow-md', isDark ? 'bg-gray-900' : 'bg-white')}>
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Transactions</p>
//               <p className="text-2xl font-bold">{data.transactions.length}</p>
//             </div>
//             <Calendar className="w-8 h-8 text-blue-600" />
//           </div>
//         </div>
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className={cn('p-6 rounded-xl shadow-md', isDark ? 'bg-gray-900' : 'bg-white')}>
//           <h3 className="text-lg font-semibold mb-4">Income vs Expense</h3>
//           <ResponsiveContainer width="100%" height={250}>
//             <PieChart>
//               <Pie
//                 data={pieData}
//                 cx="50%"
//                 cy="50%"
//                 labelLine={false}
//                 label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                 outerRadius={80}
//                 fill="#8884d8"
//                 dataKey="value"
//               >
//                 {pieData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>

//         <div className={cn('p-6 rounded-xl shadow-md', isDark ? 'bg-gray-900' : 'bg-white')}>
//           <h3 className="text-lg font-semibold mb-4">Top Expense Categories</h3>
//           <ResponsiveContainer width="100%" height={250}>
//             <BarChart data={topExpenses}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="value" fill="#ef4444" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       <div className={cn('p-6 rounded-xl shadow-md', isDark ? 'bg-gray-900' : 'bg-white')}>
//         <h3 className="text-lg font-semibold mb-4">Income & Expense Over Time</h3>
//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={historyData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="date" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} />
//             <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Transaction List - NOW CLICKABLE */}
//       <div className={cn('p-6 rounded-xl shadow-md', isDark ? 'bg-gray-900' : 'bg-white')}>
//         <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
//         <div className="space-y-2 max-h-96 overflow-y-auto">
//           {data.transactions.length === 0 ? (
//             <p className="text-center text-gray-500 py-8">No transactions yet</p>
//           ) : (
//             data.transactions.map((t) => (
//               <motion.div
//                 key={t._id}
//                 whileHover={{ scale: 1.02 }}
//                 onClick={() => openDetails(t)}
//                 className={cn(
//                   'flex justify-between items-center p-4 rounded-lg cursor-pointer transition-all',
//                   isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
//                 )}
//               >
//                 <div className="flex items-center gap-3">
//                   <div className={cn(
//                     'w-10 h-10 rounded-full flex items-center justify-center',
//                     t.type === 'income' ? 'bg-green/20' : 'bg-red/20'
//                   )}>
//                     {t.type === 'income' ? <TrendingUp className="w-5 h-5 text-green" /> : <TrendingDown className="w-5 h-5 text-red" />}
//                   </div>
//                   <div>
//                     <p className="font-medium">{t.category?.name || 'Uncategorized'}</p>
//                     <p className="text-sm text-gray-500">{format(new Date(t.date), 'MMM dd, yyyy')}</p>
//                   </div>
//                 </div>
//                 <p className={cn(
//                   'font-semibold',
//                   t.type === 'income' ? 'text-green' : 'text-red-600'
//                 )}>
//                   {t.type === 'income' ? '+' : '-'}₦{t.amount.toLocaleString()}
//                 </p>
//               </motion.div>
//             ))
//           )}
//         </div>
//       </div>

//       {/* MODAL + PDF + SHARE */}
//       {selectedTx && (
//         <>
//           {/* Hidden receipt for PDF */}
//           <div ref={receiptRef} className="fixed -top-96 left-0 bg-white p-8 w-96 shadow-2xl">
//             <h2 className="text-2xl font-bold text-center mb-6">Transaction Receipt</h2>
//             <div className="text-center mb-6">
//               <p className="text-4xl font-black">₦{selectedTx.amount.toLocaleString()}</p>
//               <p className="text-xl font-bold text-green-600">{selectedTx.type.toUpperCase()}</p>
//             </div>
//             <div className="space-y-3 text-left">
//               <p><strong>Category:</strong> {selectedTx.category?.name || 'N/A'}</p>
//               <p><strong>Date:</strong> {format(new Date(selectedTx.date), 'dd MMMM yyyy')}</p>
//               {selectedTx.description && <p><strong>Note:</strong> {selectedTx.description}</p>}
//               <p><strong>ID:</strong> {selectedTx._id}</p>
//             </div>
//             <p className="text-center mt-8 text-gray-500">Thank you!</p>
//           </div>

//           {/* Modal */}
//           <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               className={cn('max-w-md w-full rounded-3xl p-8 relative', isDark ? 'bg-gray-900' : 'bg-white')}
//             >
//               <button onClick={() => setSelectedTx(null)} className="absolute top-4 right-4">
//                 <X className="w-6 h-6" />
//               </button>

//               <div className="text-center mb-8">
//                 <div className={cn(
//                   'w-20 h-20 rounded-full mx-auto flex items-center justify-center',
//                   selectedTx.type === 'income' ? 'bg-green-100' : 'bg-red-100'
//                 )}>
//                   {selectedTx.type === 'income' ?
//                     <TrendingUp className="w-12 h-12 text-green-600" /> :
//                     <TrendingDown className="w-12 h-12 text-red-600" />
//                   }
//                 </div>
//                 <h2 className="text-4xl font-bold mt-4">₦{selectedTx.amount.toLocaleString()}</h2>
//                 <p className={cn('text-xl font-semibold', selectedTx.type === 'income' ? 'text-green-600' : 'text-red-600')}>
//                   {selectedTx.type.toUpperCase()}
//                 </p>
//               </div>

//               <div className="space-y-4 text-left">
//                 <div><strong>Category:</strong> {selectedTx.category?.name || 'Uncategorized'}</div>
//                 <div><strong>Date:</strong> {format(new Date(selectedTx.date), 'EEEE, dd MMMM yyyy')}</div>
//                 {selectedTx.description && <div><strong>Note:</strong> {selectedTx.description}</div>}
//                 <div><strong>ID:</strong> {selectedTx._id}</div>
//               </div>

//               <div className="flex gap-3 mt-8">
//                 <button onClick={exportPDF} className="flex-1 bg-blue-600 text-white py-3 rounded-xl flex items-center justify-center gap-2">
//                   <Download className="w-5 h-5" /> PDF
//                 </button>
//                 <button onClick={shareReceipt} className="flex-1 bg-green-600 text-white py-3 rounded-xl flex items-center justify-center gap-2">
//                   <Share2 className="w-5 h-5" /> Share
//                 </button>
//               </div>
//             </motion.div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default TransactionsPage;


































































import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, DollarSign, TrendingUp, TrendingDown, Calendar, Filter, Share2, Download, Copy } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { format } from 'date-fns';
import { toast } from 'sonner';
import Loading from '../../utils/Loading';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../utils/cn';
import CategoryForm from './CategoryForm';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Trash2, Printer, AlertCircle } from 'lucide-react';
import ReceiptScanner from './ReceiptScanner';
import ImageLoadingSpinner from '../../utils/Loading';

const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6'];

const TransactionsPage = () => {
  const printRef = useRef();
  const { isDark } = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ transactions: [], summary: {}, categories: [] });

  // Modal + Receipt
  const [selectedTx, setSelectedTx] = useState(null);
  const receiptRef = useRef();

  const token = localStorage.getItem('token');

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
      console.log(err);
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
      console.log(json)
      if (json.status === 201) {
        toast.success("successfully added")
        toast.success(`${type === 'income' ? 'Income' : 'Expense'} added!`);
        setShowForm(false);
        resetForm();
        fetchData();
      } else {
        // console.log(json.message)
        toast.success("successfully added");
      }
    } catch (err) {
      console.log(err);
      toast.error('Failed to save');
    }
  };

  const resetForm = () => {
    setAmount(''); setCategory(''); setDescription(''); setDate(format(new Date(), 'yyyy-MM-dd'));
  };

  const filteredCategories = data.categories.filter(c => c.type === type);

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

  // Open modal
  const openDetails = (tx) => setSelectedTx(tx);

  // Share receipt
  const shareReceipt = () => {
    const text = `Transaction Receipt\n\n` +
      `Amount: ₦${selectedTx.amount.toLocaleString()}\n` +
      `Type: ${selectedTx.type.toUpperCase()}\n` +
      `Category: ${selectedTx.category?.name || 'N/A'}\n` +
      `Date: ${format(new Date(selectedTx.date), 'dd MMM yyyy')}\n` +
      `${selectedTx.description ? `Note: ${selectedTx.description}\n` : ''}` +
      `\nPowered by Your App`;

    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      toast.success('Receipt copied!');
    }
  };

  // Export PDF
  const exportPDF = async () => {
    const element = receiptRef.current;
    const canvas = await html2canvas(element);
    const img = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(img, 'PNG', 0, 0, width, height);
    pdf.save(`receipt-${selectedTx._id.slice(-6)}.pdf`);
    toast.success('Receipt downloaded!');
  };


  const deleteTransaction = async (id) => {
  if (!confirm('Delete this transaction?')) return;
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/transaction/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      toast.success('Transaction deleted');
      fetchData();
    }
  } catch (err) {
    toast.error('Delete failed');
  }
};

const deleteAllTransactions = async () => {
  if (!confirm('⚠️ DELETE ALL TRANSACTIONS FOREVER? This cannot be undone!')) return;
  if (!confirm('Are you 100% sure?')) return;

  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/transactions/all`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      toast.success('All transactions deleted!');
      fetchData();
    }
  } catch (err) {
    toast.error('Failed to delete all');
  }
};

const printAllTransactions = () => {
  window.print();
};

const downloadAllAsPDF = async () => {
  toast.loading('Generating your PDF... Please wait');

  try {
    // Use a clean, simple printable area
    const printArea = document.createElement('div');
    printArea.innerHTML = `
      <div style="padding: 40px; font-family: Arial, sans-serif; background: white; color: black;">
        <h1 style="text-align: center; font-size: 28px; margin-bottom: 20px;">
          All Transactions - ${format(new Date(), 'dd MMMM yyyy')}
        </h1>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: #f3f4f6;">
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Date</th>
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Category</th>
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Description</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${data.transactions
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map(t => `
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 10px;">${format(new Date(t.date), 'dd MMM yyyy')}</td>
                  <td style="padding: 10px;">${t.category?.name || 'Uncategorized'}</td>
                  <td style="padding: 10px;">${t.description || '-'}</td>
                  <td style="padding: 10px; text-align: right; font-weight: bold; 
                    color: ${t.type === 'income' ? 'green' : 'red'};">
                    ${t.type==='income' ? '+' : '-'}₦${t.amount.toLocaleString()}
                  </td>
                </tr>
              `).join('')}
          </tbody>
        </table>
        <div style="margin-top: 30px; text-align: center; font-size: 20px;">
          <p><strong>Total Income:</strong> ₦${(data.summary.income || 0).toLocaleString()}</p>
          <p><strong>Total Expense:</strong> ₦${(data.summary.expense || 0).toLocaleString()}</p>
          <p style="font-size: 24px; margin-top: 10px;">
            <strong>Balance: ₦${Math.abs(data.summary.total || 0).toLocaleString()}</strong>
          </p>
        </div>
        <p style="text-align: center; margin-top: 40px; color: #666; font-size: 12px;">
          Generated by D Expense Tracker • ${new Date().toLocaleString()}
        </p>
      </div>
    `;

    // Add to body temporarily
    document.body.appendChild(printArea);
    printArea.style.position = 'absolute';
    printArea.style.left = '-9999px';

    // Convert to canvas
    const canvas = await html2canvas(printArea, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false
    });

    // Remove temp element
    document.body.removeChild(printArea);

    // Generate PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    pdf.save(`all-transactions-${format(new Date(), 'yyyy-MM-dd')}.pdf`);

    toast.success('All transactions downloaded successfully!');
  } catch (err) {
    console.error(err);
    toast.error('PDF generation failed. Try again');
  }
};

  if (loading) return <ImageLoadingSpinner />;

  return (
    <div className={cn('p-4 space-y-6', isDark ? 'bg-[#090909FF]' : 'bg-gray-50')}>
      {/* === ALL YOUR ORIGINAL CODE UNTIL TRANSACTION LIST === */}
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
       <ReceiptScanner onExpenseDetected={(exp) =>handleSubmit(exp)} />
      

      

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

      {/* HIDDEN PRINTABLE VERSION */}
<div className="hidden print:block">
  <div ref={printRef} className="p-10 bg-white">
    <h1 className="text-3xl font-bold text-center mb-8">All Transactions - {format(new Date(), 'dd MMMM yyyy')}</h1>
    <div className="space-y-4">
      {data.transactions.map(t => (
        <div key={t._id} className="border-b pb-4">
          <div className="flex justify-between">
            <div>
              <p className="font-bold">{t.category?.name || 'Uncategorized'}</p>
              <p className="text-sm text-gray-600">{format(new Date(t.date), 'dd MMM yyyy')}</p>
              {t.description && <p className="text-sm italic">{t.description}</p>}
            </div>
            <p className={`font-bold text-lg ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
              {t.type === 'income' ? '+' : '-'}₦{t.amount.toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
    <div className="mt-10 text-center">
      <p className="text-2xl font-bold">Total Income: ₦{data.summary.income?.toLocaleString() || 0}</p>
      <p className="text-2xl font-bold">Total Expense: ₦{data.summary.expense?.toLocaleString() || 0}</p>
      <p className="text-3xl font-black mt-4">
        Balance: ₦{Math.abs(data.summary.total || 0).toLocaleString()}
      </p>
    </div>
  </div>
</div>

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
            {/* <DollarSign className="w-8 h-8 text-green-600" /> */}
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

      {/* ACTION BUTTONS */}
<div className="flex flex-wrap gap-3 justify-center mb-6">
  <button
    onClick={downloadAllAsPDF}
    className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
  >
    <Download className="w-5 h-5" /> Download All (PDF)
  </button>

  <button
    onClick={printAllTransactions}
    className="flex items-center gap-2 px-5 py-3 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-700 transition print:hidden"
  >
    <Printer className="w-5 h-5" /> Print All
  </button>

  <button
    onClick={deleteAllTransactions}
    className="flex items-center gap-2 px-5 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition print:hidden"
  >
    <AlertCircle className="w-5 h-5" /> Delete All
  </button>
</div>

      {/* Transaction List - NOW CLICKABLE */}
      <div className={cn('p-6 rounded-xl shadow-md', isDark ? 'bg-gray-900' : 'bg-white')}>
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {data.transactions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No transactions yet</p>
          ) : (
          data.transactions.map((t) => (
  <motion.div
    key={t._id}
    whileHover={{ scale: 1.02 }}
    className={cn(
      'flex justify-between items-center p-4 rounded-lg transition-all relative group',
      isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
    )}
  >
    <div className="flex items-center gap-3 flex-1" onClick={() => openDetails(t)}>
      {/* your existing content */}
      <div className="flex-1">
        <p className="font-medium">{t.category?.name || 'Uncategorized'}</p>
        <p className="text-sm text-gray-500">{format(new Date(t.date), 'MMM dd, yyyy')}</p>
      </div>
      <p className={cn('font-semibold', t.type === 'income' ? 'text-green' : 'text-red-600')}>
        {t.type === 'income' ? '+' : '-'}₦{t.amount.toLocaleString()}
      </p>
    </div>

    {/* DELETE ICON - appears on hover */}
    <button
      onClick={(e) => {
        e.stopPropagation();
        deleteTransaction(t._id);
      }}
      className="opacity-0 group-hover:opacity-100 transition ml-3 p-2 hover:bg-red-600 rounded-lg"
    >
      <Trash2 className="w-5 h-5 text-red-600 hover:text-white" />
    </button>
  </motion.div>
))
          )}
        </div>
      </div>

      {/* MODAL + PDF + SHARE */}
      {selectedTx && (
        <>
          {/* Hidden receipt for PDF */}
          <div ref={receiptRef} className="fixed -top-96 left-0 bg-white p-8 w-96 shadow-2xl">
            <h2 className="text-2xl font-bold text-center mb-6">Transaction Receipt</h2>
            <div className="text-center mb-6">
              <p className="text-4xl font-black">₦{selectedTx.amount.toLocaleString()}</p>
              <p className="text-xl font-bold text-green-600">{selectedTx.type.toUpperCase()}</p>
            </div>
            <div className="space-y-3 text-left">
              <p><strong>Category:</strong> {selectedTx.category?.name || 'N/A'}</p>
              <p><strong>Date:</strong> {format(new Date(selectedTx.date), 'dd MMMM yyyy')}</p>
              {selectedTx.description && <p><strong>Note:</strong> {selectedTx.description}</p>}
              <p><strong>ID:</strong> {selectedTx._id}</p>
            </div>
            <p className="text-center mt-8 text-gray-500">Thank you!</p>
          </div>

          {/* Modal */}
          <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn('max-w-md w-full rounded-3xl p-8 relative', isDark ? 'bg-gray-900' : 'bg-white')}
            >
              <button onClick={() => setSelectedTx(null)} className="absolute top-4 right-4">
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-8">
                <div className={cn(
                  'w-20 h-20 rounded-full mx-auto flex items-center justify-center',
                  selectedTx.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                )}>
                  {selectedTx.type === 'income' ?
                    <TrendingUp className="w-12 h-12 text-green-600" /> :
                    <TrendingDown className="w-12 h-12 text-red-600" />
                  }
                </div>
                <h2 className="text-4xl font-bold mt-4">₦{selectedTx.amount.toLocaleString()}</h2>
                <p className={cn('text-xl font-semibold', selectedTx.type === 'income' ? 'text-green-600' : 'text-red-600')}>
                  {selectedTx.type.toUpperCase()}
                </p>
              </div>

              <div className="space-y-4 text-left">
                <div><strong>Category:</strong> {selectedTx.category?.name || 'Uncategorized'}</div>
                <div><strong>Date:</strong> {format(new Date(selectedTx.date), 'EEEE, dd MMMM yyyy')}</div>
                {selectedTx.description && <div><strong>Note:</strong> {selectedTx.description}</div>}
                <div><strong>ID:</strong> {selectedTx._id}</div>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={exportPDF} className="flex-1 bg-blue-600 text-white py-3 rounded-xl flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" /> PDF
                </button>
                <button onClick={shareReceipt} className="flex-1 bg-green-600 text-white py-3 rounded-xl flex items-center justify-center gap-2">
                  <Share2 className="w-5 h-5" /> Share
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
};

export default TransactionsPage;





