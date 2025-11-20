// frontend/src/components/Debt/DebtTracker.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { cn } from '../../utils/cn';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Edit2, Trash2, CheckCircle } from 'lucide-react';

export default function DebtTracker() {
  const [debts, setDebts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ type: 'owe', person: '', amount: '', description: '', dueDate: '' });
  const token = localStorage.getItem('token');
  const isDark = document.documentElement.classList.contains('dark');

  useEffect(() => {
    fetchDebts();
  }, []);

  const fetchDebts = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/debt`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) setDebts(await res.json());
  };

  const saveDebt = async () => {
    if (!form.person || !form.amount) return toast.error('Fill name & amount');

    const url = editingId 
      ? `${import.meta.env.VITE_BACKEND_URL}/api/debt/${editingId}`
      : `${import.meta.env.VITE_BACKEND_URL}/api/debt`;

    await fetch(url, {
      method: editingId ? 'PUT' : 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...form, amount: +form.amount })
    });

    toast.success(editingId ? 'Debt updated!' : 'Debt added!');
    resetForm();
    fetchDebts();
  };

  const deleteDebt = async (id) => {
    if (!confirm('Delete this debt?')) return;
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/debt/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    toast.success('Deleted');
    fetchDebts();
  };

  const markPaid = async (id) => {
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/debt/${id}/paid`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    });
    toast.success('Marked as paid!');
    fetchDebts();
  };

  const startEdit = (debt) => {
    setEditingId(debt._id);
    setForm({
      type: debt.type,
      person: debt.person,
      amount: debt.amount,
      description: debt.description || '',
      dueDate: debt.dueDate ? debt.dueDate.split('T')[0] : ''
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({ type: 'owe', person: '', amount: '', description: '', dueDate: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const totalOwe = debts.filter(d => d.type === 'owe' && !d.paid).reduce((a, b) => a + b.amount, 0);
  const totalOwed = debts.filter(d => d.type === 'owed' && !d.paid).reduce((a, b) => a + b.amount, 0);

  const chartData = [
    { name: 'You Owe', value: totalOwe, color: '#ef4444' },
    { name: 'Owed to You', value: totalOwed, color: '#10b981' }
  ];

  return (
    <div className={cn('p-4 space-y-6', isDark ? 'bg-[#090909FF]' : 'bg-gray-50')}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <h1 className="text-3xl font-bold text-center">Debt Tracker</h1>

        {/* Summary + Chart */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className={cn('rounded-2xl p-6 shadow-lg', isDark ? 'bg-[#111111]' : 'bg-white')}>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `₦${Number(v).toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            <div className={cn('rounded-2xl p-6 text-center shadow-lg', isDark ? 'bg-red-900/20' : 'bg-red-100')}>
              <p className="text-sm opacity-80">You Owe</p>
              <p className="text-3xl font-bold text-red-600">₦{totalOwe.toLocaleString()}</p>
            </div>
            <div className={cn('rounded-2xl p-6 text-center shadow-lg', isDark ? 'bg-green-900/20' : 'bg-green-100')}>
              <p className="text-sm opacity-80">Owed to You</p>
              <p className="text-3xl font-bold text-green-600">₦{totalOwed.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Add Button */}
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-4 rounded-2xl bg-green-600  text-white font-bold text-lg shadow-lg"
        >
          + Add Debt
        </button>

        {/* Debt List */}
        <div className="space-y-4">
          {debts.length === 0 ? (
            <p className="text-center py-16 text-lg opacity-70">No debts · You're free! 🎉</p>
          ) : (
            debts.map(d => (
              <div
                key={d._id}
                className={cn(
                  'rounded-2xl p-6 shadow-lg border-l-8 flex justify-between items-center',
                  isDark ? 'bg-[#111111]' : 'bg-white',
                  d.paid ? 'opacity-60 border-gray-500' : d.type === 'owe' ? 'border-red-500' : 'border-green-500'
                )}
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{d.type === 'owe' ? '→' : '←'}</span>
                    <h3 className="text-xl font-bold">{d.person}</h3>
                    {d.paid && <CheckCircle className="w-6 h-6 text-green-500" />}
                  </div>
                  <p className="text-2xl font-bold mt-1">₦{d.amount.toLocaleString()}</p>
                  {d.description && <p className="text-sm opacity-70">{d.description}</p>}
                  {d.dueDate && <p className="text-xs opacity-60">Due: {new Date(d.dueDate).toLocaleDateString()}</p>}
                </div>

                <div className="flex gap-3">
                  {!d.paid && (
                    <>
                      <button onClick={() => startEdit(d)} className="p-3 bg-blue-600 text-white rounded-xl">
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button onClick={() => deleteDebt(d._id)} className="p-3 bg-red-600 text-white rounded-xl">
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button onClick={() => markPaid(d._id)} className="px-5 py-3 bg-green-600 text-white rounded-xl font-medium">
                        Paid
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className={cn('rounded-3xl p-8 max-w-md w-full shadow-2xl', isDark ? 'bg-[#111111]' : 'bg-white')}>
              <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit' : 'New'} Debt</h2>
              {/* same form as before */}
              {/* ... (form fields same as previous version) */}
              <div className="flex gap-4 mt-6">
                <button onClick={resetForm} className="flex-1 py-4 bg-gray-600 text-white rounded-xl">Cancel</button>
                <button onClick={saveDebt} className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold">
                  {editingId ? 'Update' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}