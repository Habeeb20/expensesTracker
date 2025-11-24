// frontend/src/pages/DeleteAccount.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AlertTriangle, Trash2 } from 'lucide-react';

export default function DeleteAccount() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleDelete = async () => {
    if (password !== confirm) return toast.error('Passwords do not match');
    if (password.length < 6) return toast.error('Enter your password');

    const sure = window.confirm('⚠️ This will DELETE EVERYTHING forever. Are you 100% sure?');
    if (!sure) return;

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/delete-account`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Account deleted successfully');
        localStorage.clear();
        navigate('/login');
      } else {
        toast.error(data.message || 'Failed');
      }
    } catch (err) {
        console.log(err)
      toast.error('Network error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-10 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-16 h-16 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Delete Account Permanently?</h1>
          <p className="text-gray-600 dark:text-gray-400">
            This will delete:
          </p>
          <ul className="text-left mt-4 space-y-2 text-sm">
            <li>• All your transactions</li>
            <li>• Categories & budgets</li>
            <li>• Debts & recurring</li>
            <li>• Voice & SMS history</li>
            <li>• Your profile forever</li>
          </ul>
          <p className="mt-6 font-bold text-red-600">NO WAY TO RECOVER!</p>
        </div>

        <div className="space-y-5">
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
          />

          <button
            onClick={handleDelete}
            disabled={loading}
            className="w-full py-5 bg-red-600 text-white rounded-xl font-bold text-xl shadow-lg hover:bg-red-700 transition flex items-center justify-center gap-3"
          >
            <Trash2 className="w-6 h-6" />
            {loading ? 'Deleting...' : 'Delete My Account Forever'}
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full py-4 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl font-medium"
          >
            Cancel — Keep My Account
          </button>
        </div>
      </div>
    </div>
  );
}