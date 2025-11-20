/* eslint-disable no-unused-vars */
// frontend/src/components/YearInReview/YearInReview.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

export default function YearInReview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [slide, setSlide] = useState(0);
  const token = localStorage.getItem('token');

  const reviewYear = 2025; // Force 2025

  useEffect(() => {
    fetchYearReview();
  }, []);

  const fetchYearReview = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/year-review/2025`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const review = await res.json();
        setData(review);
      } else {
        toast.error('No 2025 data yet');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const triggerConfetti = () => {
    confetti({ particleCount: 400, spread: 100, origin: { y: 0.6 } });
  };

  const isDark = document.documentElement.classList.contains('dark');

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#090909FF]' : 'bg-gray-50'}`}>
        <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="text-2xl md:text-3xl font-medium">
          Loading your {reviewYear} story... ✨
        </motion.p>
      </div>
    );
  }

  if (!data || data.totalSpent === 0) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-8 ${isDark ? 'bg-[#090909FF]' : 'bg-gray-50'}`}>
        <p className="text-3xl md:text-4xl font-bold mb-4">No {reviewYear} data yet</p>
        <p className="text-lg md:text-xl opacity-80">Start tracking to unlock your year review!</p>
      </div>
    );
  }

  // Fix category name (in case backend sends object)
  const topCatName = typeof data.topCategory.name === 'object' 
    ? data.topCategory.name || 'Others' 
    : data.topCategory.name || 'Others';

  const slides = [
    // Slide 1 - Hero
    <motion.div key="hero" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
      <motion.h1
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 150 }}
        className="text-6xl md:text-8xl font-black mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
      >
        {reviewYear}
      </motion.h1>
      <div className="space-y-6 text-xl md:text-2xl font-medium">
        <p>You spent a total of</p>
        <p className="text-4xl md:text-5xl font-bold">₦{data.totalSpent.toLocaleString()}</p>
        <p>in {data.totalTransactions} transactions</p>
      </div>
    </motion.div>,

    // Slide 2 - Top Category
    <motion.div key="category" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8 }}
        className="text-8xl md:text-9xl mb-8"
      >
        {data.topCategory.emoji || '🛍️'}
      </motion.div>
      <h2 className="text-4xl md:text-5xl font-bold mb-4">{topCatName}</h2>
      <p className="text-3xl md:text-4xl font-bold">₦{data.topCategory.amount.toLocaleString()}</p>
      <p className="text-lg md:text-xl mt-6 italic opacity-90">"Na this one chop your money pass!" 😂</p>
    </motion.div>,

    // Slide 3 - Personality
    <motion.div key="personality" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
      <motion.h2
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl md:text-5xl font-bold mb-8"
      >
        You be {data.personality.title}!
      </motion.h2>
      <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto">{data.personality.description}</p>
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-8xl md:text-9xl"
      >
        {data.personality.emoji}
      </motion.div>
    </motion.div>,

    // Slide 4 - Thank You
    <motion.div key="thanks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
      <motion.h1
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        onAnimationComplete={triggerConfetti}
        className="text-4xl md:text-5xl font-bold mb-8"
      >
        Thank You for {reviewYear}!
      </motion.h1>
      <p className="text-2xl md:text-3xl mb-12">2026 go better pass this one!!</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => toast.success('Shared to status! 🚀')}
        className="px-12 py-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-xl md:text-2xl font-bold shadow-2xl"
      >
        Share My {reviewYear} Story 📲
      </motion.button>
    </motion.div>
  ];

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-[#090909FF]' : 'bg-gray-50'}`}>
      {/* Main Slide */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className={`rounded-3xl shadow-2xl p-12 md:p-20 max-w-4xl w-full ${isDark ? 'bg-[#111111]' : 'bg-white'}`}>
          {slides[slide]}
        </div>
      </div>

      {/* Navigation */}
      <div className="p-8 flex justify-center items-center gap-8">
        <button
          onClick={() => setSlide(s => Math.max(0, s - 1))}
          className={`px-8 py-4 rounded-full font-bold text-lg transition ${
            slide === 0 ? 'bg-gray-300 text-gray-500' : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
          }`}
          disabled={slide === 0}
        >
          ← Back
        </button>

        <div className="flex gap-3">
          {slides.map((_, i) => (
            <div
              key={i}
              onClick={() => setSlide(i)}
              className={`w-3 h-3 rounded-full cursor-pointer transition-all ${i === slide ? 'bg-purple-600 w-10' : 'bg-gray-400'}`}
            />
          ))}
        </div>

        <button
          onClick={() => setSlide(s => Math.min(slides.length - 1, s + 1))}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-lg"
        >
          {slide === slides.length - 1 ? 'Finish 🎉' : 'Next →'}
        </button>
      </div>
    </div>
  );
}