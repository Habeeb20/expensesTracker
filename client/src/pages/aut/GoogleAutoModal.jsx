/* eslint-disable no-unused-vars */
// src/components/GoogleAutoLoginModal.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import ImageLoadingSpinner from '../../utils/Loading';

const GoogleAutoLoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes('@')) return toast.error('Enter valid email');

    setLoading(true);
    setShowLoader(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/auto-login`,
        { email }
      );
      localStorage.setItem('token', res.data.token);
      toast.success('Logged in with Google!');
      setTimeout(() => { window.location.href = '/dashboard'; }, 1500);
    } catch (err) {
      toast.error('Failed', { description: err.response?.data?.message || 'Try again' });
    } finally {
      setLoading(false);
      setShowLoader(false);
    }
  };

  if (showLoader) return <ImageLoadingSpinner fullScreen text="Logging in..." />;

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }} animate={{ scale: 1 }}
        className="bg-white dark:bg-[#090909FF] rounded-2xl p-6 max-w-md w-full shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-bold">Google Auto-Login</h3>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@gmail.com"
            className="w-full px-4 py-3 rounded-xl border mb-4"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green text-white py-3 rounded-xl flex justify-center gap-2"
          >
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</> : 'Submit'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default GoogleAutoLoginModal;