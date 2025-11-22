// /* eslint-disable no-unused-vars */


// // frontend/src/components/VoiceInput/VoiceExpenseAdder.jsx   ← REPLACE YOUR OLD ONE
// import React, { useState } from 'react';
// import { toast } from 'sonner';

// export default function VoiceExpenseAdder() {
//   const [listening, setListening] = useState(false);
//   const token = localStorage.getItem('token');

//   // AUTO REFRESH ALL PAGES
//   const triggerRefresh = () => {
//     window.dispatchEvent(new Event('transactionAdded'));
//   };

//   const startListening = () => {
//     if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
//       toast.error('Use Chrome or Edge for voice');
//       return;
//     }

//     setListening(true);
//     toast.loading('Listening... Speak now, speak clearly');

//     const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
//     const recognition = new SpeechRecognition();
//     recognition.lang = 'en-NG';
//     recognition.continuous = false;

//     recognition.onresult = async (event) => {
//       let text = '';
//       for (let i = event.resultIndex; i < event.results.length; i++) {
//         if (event.results[i].isFinal) {
//           text += event.results[i][0].transcript;
//         }
//       }

//       if (text.trim()) {
//         await processCommand(text.trim());
//       }
//     };

//     recognition.onerror = () => {
//       toast.error('Voice failed. Try again');
//       setListening(false);
//     };

//     recognition.onend = () => setListening(false);

//     recognition.start();
//   };

//   const processCommand = async (text) => {
//     const lower = text.toLowerCase();

//     // Extract amount
//     const amountMatch = lower.match(/(\d+(?:,\d+)?)\s*(naira|k|thousand)?/i);
//     if (!amountMatch) {
//       toast.error('I cant hear amount. Try: "5000 food or 50k salary"');
//       return;
//     }

//     let amount = parseFloat(amountMatch[1].replace(/,/g, ''));
//     if (lower.includes('k') || lower.includes('thousand')) amount *= 1000;

//     // Detect income or expense
//     const isIncome = lower.includes('receive') || lower.includes('salary') || lower.includes('credit') || lower.includes('earn') || lower.includes('got');
//     const type = isIncome ? 'income' : 'expense';

//     // Detect category
//     let category = 'Others';
//     if (lower.includes('food') || lower.includes('eat') || lower.includes('rice')) category = 'Food';
//     else if (lower.includes('transport') || lower.includes('uber') || lower.includes('bolt') || lower.includes('fuel')) category = 'Transport';
//     else if (lower.includes('data') || lower.includes('airtime') || lower.includes('light') || lower.includes('nepa')) category = 'Bills';
//     else if (lower.includes('netflix') || lower.includes('dstv')) category = 'Entertainment';
//     else if (lower.includes('shopping') || lower.includes('cloth')) category = 'Shopping';

//     // Save
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

//       toast.success(`${type === 'income' ? 'Income' : 'Expense'} ₦${amount.toLocaleString()} added! 🎤`);
//       triggerRefresh(); // auto refresh all pages
//     }  catch (err) {
//       toast.error('Save failed');
//     }
//   };

//   return (
//  <div className="fixed inset-0 z-50 pointer-events-none">
//       {/* Floating Button */}
//        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-auto">
//         <button
//           onClick={startListening}
//           disabled={listening}
//           className={`w-20 h-20 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 ${
//             listening ? 'bg-red-600 animate-pulse' : 'bg-gradient-to-r from-purple-600 to-pink-600'
//           }`}
//         >
//         {listening ? '🎙️' : '🎤'}
//       </button>
//       </div>

//       {/* Beautiful Tooltip */}
//        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-sm w-full pointer-events-auto">
//         <div className="bg-black text-white p-6 rounded-3xl shadow-2xl text-sm leading-relaxed">
//           <h3 className="font-bold text-center mb-4 text-lg">Voice Commands</h3>
          
//           <div className="space-y-4">
//             <div>
//               <p className="font-semibold text-green-400 mb-2">Income:</p>
//               <div className="text-xs space-y-1 opacity-90 ml-4">
//                 <p>• "50k salary"</p>
//                 <p>• "I received 100k"</p>
//                 <p>• "Credit alert 25 thousand"</p>
//               </div>
//             </div>

//             <div>
//               <p className="font-semibold text-red-400 mb-2">Expenses:</p>
//               <div className="text-xs space-y-1 opacity-90 ml-4">
//                 <p>• "2500 food"</p>
//                 <p>• "Bolt 3200 transport"</p>
//                 <p>• "Netflix 4900"</p>
//                 <p>• "Shopping 15k"</p>
//               </div>
//             </div>
//           </div>

//           <p className="text-center text-xs mt-4 opacity-70">
//             Tap mic • Speak • Done!
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }



// frontend/src/components/VoiceInput/VoiceExpenseAdder.jsx
import React, { useState } from 'react';
import { toast } from 'sonner';

export default function VoiceExpenseAdder() {
  const [listening, setListening] = useState(false);
  const token = localStorage.getItem('token');

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
      if (text.trim()) await processCommand(text.trim());
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
      toast.error('Speak amount clearly e.g. "5000 food"');
      return;
    }

    let amount = parseFloat(amountMatch[1].replace(/,/g, ''));
    if (lower.includes('k') || lower.includes('thousand')) amount *= 1000;

    // Detect income vs expense
    const incomeKeywords = ['salary', 'credit', 'receive', 'got', 'earn', 'paid', 'allowance', 'transfer', 'income'];
    const isIncome = incomeKeywords.some(k => lower.includes(k));
    const type = isIncome ? 'income' : 'expense';

    // Map to your existing categories
    let categoryName = 'Others';
    if (lower.includes('food') || lower.includes('eat') || lower.includes('rice')) categoryName = 'Food';
    else if (lower.includes('transport') || lower.includes('uber') || lower.includes('bolt') || lower.includes('fuel')) categoryName = 'Transport';
    else if (lower.includes('data') || lower.includes('airtime') || lower.includes('light') || lower.includes('nepa')) categoryName = 'Bills';
    else if (lower.includes('netflix') || lower.includes('dstv')) categoryName = 'Entertainment';
    else if (lower.includes('shopping') || lower.includes('cloth')) categoryName = 'Shopping';
    else if (isIncome) categoryName = 'Salary/Income';

    try {
      // SEND BOTH `category` (name) AND `type` SO YOUR BACKEND IS HAPPY
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/transaction`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount,
          type,                                // ← transaction type
          category: categoryName,              // ← category name (string)
          description: `Voice: "${text}"`,
          date: new Date().toISOString().split('T')[0]
        })
      });

      if (response.ok) {
        toast.success(`₦${amount.toLocaleString()} ${isIncome ? 'income' : 'expense'} added!`);
        triggerRefresh();
      } else {
        const err = await response.json();
        toast.error(err.message || 'Save failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-auto">
        <button
          onClick={startListening}
          disabled={listening}
          className={`w-20 h-20 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 ${
            listening ? 'bg-red-600 animate-pulse' : 'bg-gradient-to-r from-purple-600 to-pink-600'
          }`}
        >
          {listening ? 'Listening 🎙️' : '🎤'}
        </button>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-sm w-full pointer-events-auto">
        <div className="bg-black text-white p-6 rounded-3xl shadow-2xl text-sm leading-relaxed">
          <h3 className="font-bold text-center mb-4 text-lg">Voice Commands</h3>
          <div className="space-y-4 text-xs">
            <div>
              <p className="font-semibold text-green-400 mb-1">Income:</p>
              <p className="ml-4 opacity-90">• "50k salary"</p>
              <p className="ml-4 opacity-90">• "I received 100k"</p>
              <p className="ml-4 opacity-90">• "Credit alert 25 thousand"</p>
            </div>
            <div>
              <p className="font-semibold text-red-400 mb-1">Expenses:</p>
              <p className="ml-4 opacity-90">• "2500 food"</p>
              <p className="ml-4 opacity-90">• "Bolt 3200 transport"</p>
              <p className="ml-4 opacity-90">• "Netflix 4900"</p>
               <p className="ml-4 opacity-90">• "Shopping 15k"</p>
            </div>
          </div>
          <p className="text-center text-xs mt-4 opacity-70">Tap mic • Speak • Done!</p>
        </div>
      </div>
    </div>
  );
}