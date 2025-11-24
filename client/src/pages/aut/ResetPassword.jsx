// frontend/src/pages/ResetPassword.jsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { CheckCircle, XCircle } from 'lucide-react';

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return toast.error('Passwords do not match');
    if (password.length < 6) return toast.error('Password must be 6+ characters');

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        toast.success('Password reset successful!');
      } else {
        toast.error(data.message || 'Invalid or expired link');
      }
    } catch (err) {
        console.log(err)
      toast.error('Network error');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-600 p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md">
          <CheckCircle className="w-24 h-24 text-green-600 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Password Reset Successful!</h1>
          <p className="text-gray-600 mb-8">You can now login with your new password</p>
          <Link
            to="/login"
            className="inline-block px-8 py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center  bg-[#090909FF]  p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-2">Set New Password</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Enter a strong password (6+ characters)
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-purple-600"
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-purple-600"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-green hover:bg-green/90  text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}