/* eslint-disable no-unused-vars */
// /* eslint-disable no-unused-vars */
// // frontend/src/components/VoiceInput/VoiceExpenseAdder.jsx
// import React, { useState } from 'react';
// import { toast } from 'sonner';

// export default function VoiceExpenseAdder({ onAdded }) {
//   const [listening, setListening] = useState(false);
//   const [processing, setProcessing] = useState(false);
//   const token = localStorage.getItem('token');

//   const startListening = () => {
//     if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
//       toast.error('Your browser no support voice. Use Chrome/Edge');
//       return;
//     }

//     setListening(true);
//     setProcessing(true);

//     const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
//     const recognition = new SpeechRecognition();
//     recognition.lang = 'en-NG'; // Nigerian English
//     recognition.continuous = false;
//     recognition.interimResults = true;

//     recognition.onresult = async (event) => {
//       let finalText = '';
//       for (let i = event.resultIndex; i < event.results.length; i++) {
//         if (event.results[i].isFinal) {
//           finalText += event.results[i][0].transcript;
//         }
//       }

//       if (finalText.trim()) {
//         await processVoiceCommand(finalText.trim());
//       }
//     };

//     recognition.onerror = () => {
//       toast.error('Voice recognition failed. Try again');
//       setListening(false);
//       setProcessing(false);
//     };

//     recognition.onend = () => {
//       setListening(false);
//       setProcessing(false);
//     };

//     recognition.start();
//   };

//   const processVoiceCommand = async (text) => {
//     const lower = text.toLowerCase();

//     // Extract amount
//     const amountMatch = lower.match(/(\d+(?:,\d+)?(?:\.\d+)?)\s*(naira|thousand|k|kobo)?/i);
//     if (!amountMatch) {
//       toast.error('I no hear the amount. Try again');
//       return;
//     }

//     let amount = parseFloat(amountMatch[1].replace(/,/g, ''));
//     if (lower.includes('thousand') || lower.includes('k')) amount *= 1000;

//     // Detect type: income or expense
//     const isIncome = lower.includes('earn') || lower.includes('receive') || lower.includes('credit') || lower.includes('salary') || lower.includes('income') || lower.includes('got');
//     const type = isIncome ? 'income' : 'expense';

//     // Detect category
//     let category = 'Others';
//     if (lower.includes('food') || lower.includes('eat') || lower.includes('shawarma') || lower.includes('rice')) category = 'Food';
//     else if (lower.includes('transport') || lower.includes('uber') || lower.includes('bolt') || lower.includes('fuel')) category = 'Transport';
//     else if (lower.includes('data') || lower.includes('airtime') || lower.includes('nepa') || lower.includes('light')) category = 'Bills';
//     else if (lower.includes('netflix') || lower.includes('dstv')) category = 'Entertainment';
//     else if (lower.includes('shopping') || lower.includes('cloth')) category = 'Shopping';

//     // Save to backend
//     try {
//       await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/transaction`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           amount,
//           type,
//           category,
//           description: `Voice: "${text}"`,
//           date: new Date().toISOString().split('T')[0]
//         })
//       });

//       toast.success(`${isIncome ? 'Income' : 'Expense'} ₦${amount.toLocaleString()} added by voice! 🎤`);
//       if (onAdded) onAdded();
//     } catch (err) {
//       toast.error('Failed to save');
//     }
//   };

//   return (
//     <div className="fixed bottom-6 right-6 z-50">
//       <button
//         onClick={startListening}
//         disabled={listening || processing}
//         className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-white text-4xl transition-all hover:scale-110 ${
//           listening || processing 
//             ? 'bg-red-600 animate-pulse' 
//             : 'bg-gradient-to-r from-purple-600 to-pink-600'
//         }`}
//       >
//         {listening || processing ? '🎙️' : '🎤'}
//       </button>

//       {/* Tooltip */}
//       {(listening || processing) && (
//         <div className="absolute bottom-20 right-0 bg-black text-white px-4 py-2 rounded-xl text-sm">
//           {listening ? 'Listening...' : 'Processing...'}
//         </div>
//       )}
//     </div>
//   );
// }


// frontend/src/components/VoiceInput/VoiceExpenseAdder.jsx   ← REPLACE YOUR OLD ONE
import React, { useState } from 'react';
import { toast } from 'sonner';

export default function VoiceExpenseAdder() {
  const [listening, setListening] = useState(false);
  const token = localStorage.getItem('token');

  // AUTO REFRESH ALL PAGES
  const triggerRefresh = () => {
    window.dispatchEvent(new Event('transactionAdded'));
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      toast.error('Use Chrome or Edge for voice');
      return;
    }

    setListening(true);
    toast.loading('Listening... Speak now');

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-NG';
    recognition.continuous = false;

    recognition.onresult = async (event) => {
      let text = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          text += event.results[i][0].transcript;
        }
      }

      if (text.trim()) {
        await processCommand(text.trim());
      }
    };

    recognition.onerror = () => {
      toast.error('Voice failed. Try again');
      setListening(false);
    };

    recognition.onend = () => setListening(false);

    recognition.start();
  };

  const processCommand = async (text) => {
    const lower = text.toLowerCase();

    // Extract amount
    const amountMatch = lower.match(/(\d+(?:,\d+)?)\s*(naira|k|thousand)?/i);
    if (!amountMatch) {
      toast.error('I no hear amount. Try: "5000 food"');
      return;
    }

    let amount = parseFloat(amountMatch[1].replace(/,/g, ''));
    if (lower.includes('k') || lower.includes('thousand')) amount *= 1000;

    // Detect income or expense
    const isIncome = lower.includes('receive') || lower.includes('salary') || lower.includes('credit') || lower.includes('earn') || lower.includes('got');
    const type = isIncome ? 'income' : 'expense';

    // Detect category
    let category = 'Others';
    if (lower.includes('food') || lower.includes('eat') || lower.includes('rice')) category = 'Food';
    else if (lower.includes('transport') || lower.includes('uber') || lower.includes('bolt') || lower.includes('fuel')) category = 'Transport';
    else if (lower.includes('data') || lower.includes('airtime') || lower.includes('light') || lower.includes('nepa')) category = 'Bills';
    else if (lower.includes('netflix') || lower.includes('dstv')) category = 'Entertainment';
    else if (lower.includes('shopping') || lower.includes('cloth')) category = 'Shopping';

    // Save
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/transaction`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount,
          type,
          category,
          description: `Voice: "${text}"`,
          date: new Date().toISOString().split('T')[0]
        })
      });

      toast.success(`${type === 'income' ? 'Income' : 'Expense'} ₦${amount.toLocaleString()} added! 🎤`);
      triggerRefresh(); // auto refresh all pages
    }  catch (err) {
      toast.error('Save failed');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      <button
        onClick={startListening}
        disabled={listening}
        className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-white text-3xl transition-all hover:scale-110 ${
          listening ? 'bg-red-600 animate-pulse' : 'bg-gradient-to-r from-purple-600 to-pink-600'
        }`}
      >
        {listening ? '🎙️' : '🎤'}
      </button>

      {/* Beautiful Tooltip */}
      <div className="absolute bottom-20 right-0 bg-black text-white px-4 py-3 rounded-2xl text-xs max-w-xs shadow-2xl">
        <p className="font-bold mb-1">Voice Add Expense</p>
        <p className="opacity-90">Just say:</p>
        <p className="opacity-80 mt-1">• "2500 food"</p>
        <p className="opacity-80">• "50k salary"</p>
        <p className="opacity-80">• "Bolt 3200 transport"</p>
        <div className="absolute bottom-[-8px] right-6 w-4 h-4 bg-black rotate-45"></div>
      </div>
    </div>
  );
}