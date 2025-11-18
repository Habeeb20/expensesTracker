/* eslint-disable no-unused-vars */
// frontend/src/components/NetWorth/NetWorthDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { toast } from 'sonner';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function NetWorthDashboard() {
  const [assets, setAssets] = useState([]);     // e.g., Savings, Crypto, etc.
  const [liabilities, setLiabilities] = useState([]); // Debts, Loans
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  // Fetch from backend (we'll create endpoint later)
  useEffect(() => {
    fetchNetWorth();
  }, []);

  const fetchNetWorth = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/networth`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAssets(data.assets || []);
        setLiabilities(data.liabilities || []);
      }
    } catch (err) {
      console.log("No net worth data yet");
    } finally {
      setLoading(false);
    }
  };

  const totalAssets = assets.reduce((sum, a) => sum + a.amount, 0);
  const totalLiabilities = liabilities.reduce((sum, l) => sum + l.amount, 0);
  const netWorth = totalAssets - totalLiabilities;

  const pieData = {
    labels: [...assets.map(a => a.name), ...liabilities.map(l => `${l.name} (Debt)`)],
    datasets: [{
      data: [...assets.map(a => a.amount), ...liabilities.map(l => l.amount)],
      backgroundColor: [
        '#10b981', '#34d399', '#86efac', '#6ee7b7', // Greens for assets
        '#ef4444', '#f87171', '#fca5a5', '#fca5a5', // Reds for debts
      ],
      borderWidth: 2,
      borderColor: '#fff',
    }]
  };

  if (loading) return <div className="p-10 text-center">Loading your empire...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
            Your Net Worth
          </h1>
          <p className="text-2xl mt-4 text-gray-600 dark:text-gray-400">
            ₦{netWorth.toLocaleString()}
          </p>
          <p className={`text-lg font-bold ${netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {netWorth >= 0 ? '↑ You dey up!' : '↓ Make e no be like this o'}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Breakdown</h2>
            <div className="h-96">
              {totalAssets + totalLiabilities > 0 ? (
                <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
              ) : (
                <p className="text-center text-gray-500 text-xl">No data yet. Add assets & debts!</p>
              )}
            </div>
          </div>

          {/* Add Asset / Liability */}
          <div className="space-y-6">
            <AddItem type="asset" onAdd={(item) => setAssets([...assets, item])} />
            <AddItem type="liability" onAdd={(item) => setLiabilities([...liabilities, item])} />
          </div>
        </div>

        {/* Lists */}
        <div className="grid md:grid-cols-2 gap-8 mt-10">
          <AssetList items={assets} setItems={setAssets} />
          <LiabilityList items={liabilities} setItems={setLiabilities} />
        </div>
      </div>
    </div>
  );
}

// Reusable Add Form
function AddItem({ type, onAdd }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !amount) return;

    setSaving(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/networth`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type,
          name,
          amount: +amount
        })
      });

      if (res.ok) {
        const data = await res.json();
        onAdd(data.item);
        toast.success(`${name} added!`);
        setName(''); setAmount('');
      }
    } catch (err) {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-l-8 ${type === 'asset' ? 'border-green-500' : 'border-red-500'}`}>
      <h3 className="text-xl font-bold mb-4">
        {type === 'asset' ? '💰 Add Asset' : '😭 Add Debt'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder={type === 'asset' ? 'e.g. Opay Savings, Bitcoin' : 'e.g. Loan from John'}
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
        />
        <input
          type="number"
          placeholder="Amount in ₦"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
        />
        <button
          type="submit"
          disabled={saving}
          className={`w-full py-4 rounded-xl font-bold text-white ${
            type === 'asset'
              ? 'bg-gradient-to-r from-green-500 to-emerald-600'
              : 'bg-gradient-to-r from-red-500 to-rose-600'
          }`}
        >
          {saving ? 'Saving...' : 'Add'}
        </button>
      </form>
    </div>
  );
}

// Lists
function AssetList({ items, setItems }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-bold mb-6 text-green-600">Assets 💎</h2>
      {items.length === 0 ? (
        <p className="text-gray-500">No assets yet. You fit start small!</p>
      ) : (
        <div className="space-y-4">
          {items.map((item, i) => (
            <div key={i} className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/30 rounded-xl">
              <span className="font-medium">{item.name}</span>
              <span className="font-bold text-green-600">₦{item.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LiabilityList({ items, setItems }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-bold mb-6 text-red-600">Debts/Liabilities 😤</h2>
      {items.length === 0 ? (
        <p className="text-gray-500">No debt! You be correct guy/girl 👏</p>
      ) : (
        <div className="space-y-4">
          {items.map((item, i) => (
            <div key={i} className="flex justify-between items-center p-4 bg-red-50 dark:bg-red-900/30 rounded-xl">
              <span className="font-medium">{item.name}</span>
              <span className="font-bold text-red-600">₦{item.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}