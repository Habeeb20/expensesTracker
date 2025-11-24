// frontend/src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Enter your email');

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Reset link sent! Check your email (or console for dev)');
        console.log('Reset link:', data.resetUrl); // Remove in production
      } else {
        toast.error(data.message || 'User not found');
      }
    } catch (err) {
        console.log(err)
      toast.error('Network error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br bg-[#090909FF]  p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <Link to="/login" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-6">
          <ArrowLeft className="w-5 h-5" /> Back to Login
        </Link>

        <h1 className="text-3xl font-bold text-center mb-2">Forgot Password?</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Enter your email and we'll send you a reset link
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-green hover:bg-green/90 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="text-center text-sm text-green dark:text-gray-400 mt-8">
          Remember password?{' '}
          <Link to="/login" className="text-green font-bold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}