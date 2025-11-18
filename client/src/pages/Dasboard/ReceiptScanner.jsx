/* eslint-disable no-useless-escape */
// frontend/src/components/ReceiptScanner/ReceiptScanner.jsx
import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import { toast } from 'sonner';

export default function ReceiptScanner({ onExpenseDetected }) {
  const [scanning, setScanning] = useState(false);

  const handleCapture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setScanning(true);
    toast.loading('Reading receipt... 🔍');

    Tesseract.recognize(
      file,
      'eng',
      { logger: m => console.log(m) }
    ).then(({ data: { text } }) => {
      const amount = extractAmount(text);
      const date = extractDate(text) || new Date().toISOString().split('T')[0];

      if (amount) {
        onExpenseDetected({
          amount,
          description: 'Receipt (Auto)',
          date,
          category: guessCategory(text)
        });
        toast.success(`₦${amount.toLocaleString()} detected! Added ✅`);
      } else {
        toast.error('No amount found. Try better lighting');
      }
      setScanning(false);
    }).catch(err => {
        console.log(err)
      toast.error('Scan failed');
      setScanning(false);
    });
  };

  const extractAmount = (text) => {
    const patterns = [
      /total[\s:]*₦?([\d,]+\.?\d*)/i,
      /₦([\d,]+\.?\d*)/,
      /amount[\s:]*₦?([\d,]+\.?\d*)/i,
      /([\d,]+\.?\d*)\s*naira/i,
      /\b(\d{3,})\b/g  // fallback: big numbers
    ];
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return parseFloat(match[1].replace(/,/g, ''));
      }
    }
    return null;
  };

  const extractDate = (text) => {
    const dateMatch = text.match(/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/);
    return dateMatch ? new Date(dateMatch[0]).toISOString().split('T')[0] : null;
  };

  const guessCategory = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('fuel') || lower.includes('pms')) return 'Transport';
    if (lower.includes('restaurant') || lower.includes('food')) return 'Food';
    if (lower.includes('nepa') || lower.includes('light')) return 'Utilities';
    if (lower.includes('data') || lower.includes('airtime')) return 'Bills';
    return 'Others';
  };

  return (
    <div className="fixed bottom-20 right-6 z-50">
      <label className="cursor-pointer">
        <input type="file" accept="image/*" capture="camera" className="hidden" onChange={handleCapture} disabled={scanning} />
        <div className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-white text-3xl transition-all ${scanning ? 'bg-gray-500 animate-pulse' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-110'}`}>
          {scanning ? '...' : '📸'}
        </div>
      </label>
    </div>
  );
}