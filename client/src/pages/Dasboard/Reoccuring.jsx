/* eslint-disable no-unused-vars */
// frontend/src/components/Recurring/RecurringDashboard.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { cn } from '../../utils/cn';

export default function RecurringDashboard() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const token = localStorage.getItem('token');

  // LIVE DARK MODE DETECTION (updates when user changes theme)
  useEffect(() => {
    const checkDark = () => setIsDark(document.documentElement.classList.contains('dark'));
    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetchAllRecurring();
  }, []);

  const fetchAllRecurring = async () => {
    try {
      setLoading(true);

      const [detectRes, activeRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/recurring/detect`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/recurring`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const detected = detectRes.ok ? await detectRes.json() : [];
      const active = activeRes.ok ? await activeRes.json() : [];

      const merged = detected.map(item => {
        const match = active.find(a =>
          a.amount === item.amount &&
          a.description.toLowerCase().trim() === item.description.toLowerCase().trim()
        );
        return match
          ? { ...item, ...match, active: match.active, _id: match._id }
          : { ...item, active: false };
      });

      // Add active ones not currently detected
      const extra = active.filter(a =>
        !detected.some(d =>
          d.amount === a.amount &&
          d.description.toLowerCase().trim() === a.description.toLowerCase().trim()
        )
      );

      setPredictions([...merged, ...extra]);
    } catch (err) {
      toast.error("Failed to load predictions");
    } finally {
      setLoading(false);
    }
  };

  const toggleAuto = async (item) => {
    try {
      if (!item.active) {
        // Activate
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/recurring`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            amount: item.amount,
            category: item.category,
            description: item.description,
            type: 'expense',
            frequency: item.frequency || 'monthly',
            nextDate: item.nextDate
          })
        });
        toast.success(`${item.description} → Auto-add ON! 🔥`);
      } else {
        // Deactivate
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/recurring/${item._id}/toggle`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success(`${item.description} → Auto-add OFF`);
      }
      fetchAllRecurring();
    } catch (err) {
      toast.error("Toggle failed");
    }
  };

  if (loading) {
    return (
      <div className={cn('min-h-screen p-6 flex items-center justify-center', isDark ? 'bg-[#090909FF]' : 'bg-gray-50')}>
        <p className="text-2xl animate-pulse">Scanning your spending patterns... 🔍</p>
      </div>
    );
  }

  return (
    <div className={cn('min-h-screen p-6 space-y-8', isDark ? 'bg-[#090909FF]' : 'bg-gray-50')}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-4">AI Recurring Predictions</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 text-lg mb-12">
          We noticed these happen regularly · Turn ON to auto-add forever!
        </p>

        {predictions.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-3xl font-bold text-gray-500 mb-4">No patterns yet</p>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Add more expenses · AI go soon detect your Netflix, rent, salary...
            </p>
          </div>
        ) : (
          <div className="grid gap-8">
            {predictions.map((p, index) => {
              const isActive = p.active === true;

              return (
                <div
                  key={p._id || `detected-${index}`}
                  className={cn(
                    'rounded-3xl p-8 shadow-2xl border-l-8 transition-all',
                    isDark ? 'bg-[#111111]' : 'bg-white',
                    isActive ? 'border-green-500 shadow-green-500/30' : 'border-gray-400'
                  )}
                >
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6 flex-1">
                      <div className="text-7xl">💸</div>
                      <div>
                        <p className="text-4xl font-bold text-red-600">
                          -₦{Number(p.amount).toLocaleString()}
                        </p>
                        <p className="text-2xl font-bold mt-2 text-gray-800 dark:text-gray-200">
                          {p.description}
                        </p>
                        <p className="text-gray-500 mt-1">
                          {p.category} · Every {p.frequency || 'month'} · Next: {new Date(p.nextDate).toLocaleDateString('en-GB')}
                        </p>
                      </div>
                    </div>

                    {/* SUPER VISIBLE SWITCH */}
                 <button
  onClick={() => toggleAuto(p)}
  className={cn(
    'relative w-44 h-24 rounded-full transition-all duration-500 shadow-xl cursor-pointer select-none',
    isActive 
      ? 'bg-gradient-to-r from-emerald-500 to-green-600' 
      : 'bg-gray-400 dark:bg-gray-700'
  )}
>
  <div
    className={cn(
      'absolute top-2 left-2 w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center text-3xl font-bold transition-all duration-500',
      isActive ? 'translate-x-20' : 'translate-x-0'
    )}
  >
    {isActive ? 'ON' : 'OFF'}
  </div>
</button>
                  </div>

                  {isActive && (
                    <div className="mt-6 text-center">
                      <p className="text-2xl font-bold text-green-600">
                        Auto-added every {p.frequency || 'month'} · No forget again! ✅
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}