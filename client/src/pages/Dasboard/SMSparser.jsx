// // frontend/src/components/SMSParser/SMSParser.jsx
// import React, { useState } from 'react';
// import { toast } from 'sonner';

// export default function SMSParser({ onTransactionAdded }) {
//   const [parsing, setParsing] = useState(false);

//   const parseSMS = (text) => {
//     const lower = text.toLowerCase();

//     // Detect Nigerian bank SMS patterns
//     const creditMatch = text.match(/(cr|credit|credited|deposit|received)[\s:]*₦?([\d,]+\.?\d*)/i);
//     const debitMatch = text.match(/(dr|debited|withdrawal|paid|spent)[\s:]*₦?([\d,]+\.?\d*)/i);

//     let amount = 0;
//     let type = 'expense';
//     let description = 'From SMS';

//     if (creditMatch) {
//       amount = parseFloat(creditMatch[2].replace(/,/g, ''));
//       type = 'income';
//       description = text.includes('salary') ? 'Salary' : 'Credit Alert';
//     } else if (debitMatch) {
//       amount = parseFloat(debitMatch[2].replace(/,/g, ''));
//       type = 'expense';

//       // Smart category detection
//       if (lower.includes('netflix')) description = 'Netflix';
//       else if (lower.includes('dstv') || lower.includes('gotv')) description = 'DSTV/GOtv';
//       else if (lower.includes('airtime') || lower.includes('data')) description = 'Airtime/Data';
//       else if (lower.includes('pos') || lower.includes('transfer')) description = 'Transfer/POS';
//       else description = 'Bank Debit';
//     } else {
//       return null;
//     }

//     return { amount, type, description, date: new Date().toISOString().split('T')[0] };
//   };

//   const handlePaste = async (e) => {
//     const text = e.clipboardData.getData('text');
//     if (!text) return;

//     setParsing(true);
//     toast.loading('Parsing SMS...');

//     const parsed = parseSMS(text);
//     if (parsed) {
//       // Save to backend
//       const token = localStorage.getItem('token');
//       await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/transaction`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           amount: parsed.amount,
//           type: parsed.type,
//           category: parsed.type === 'income' ? 'Salary/Income' : 'Others',
//           description: parsed.description + ' (SMS)',
//           date: parsed.date
//         })
//       });

//       toast.success(`₦${parsed.amount.toLocaleString()} ${parsed.type === 'income' ? 'income' : 'expense'} added from SMS!`);
//       if (onTransactionAdded) onTransactionAdded();
//     } else {
//       toast.error('No bank transaction found. Copy full SMS');
//     }
//     setParsing(false);
//   };

//   return (
//     <div className="fixed bottom-6 right-6 z-50">
//       <div
//         onClick={() => {
//           navigator.clipboard.readText().then(text => {
//             const event = { clipboardData: { getData: () => text } };
//             handlePaste(event);
//           }).catch(() => {
//             toast('Click here then paste SMS');
//           });
//         }}
//         className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-white text-3xl cursor-pointer transition-all ${
//           parsing ? 'bg-gray-500 animate-pulse' : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-110'
//         }`}
//       >
//         {parsing ? '...' : '💬'}
//       </div>

//       <div className="mt-20 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl max-w-sm">
//         <h3 className="font-bold text-lg mb-2">SMS Parser Active!</h3>
//         <p className="text-sm opacity-80">
//           Copy any bank SMS (Opay, GTB, Kuda, Palmpay, etc.) → Click the button → Auto-added!
//         </p>
//         <div className="mt-4 text-xs space-y-1 opacity-60">
//           <p>Works with:</p>
//           <p>• Cr: ₦50,000.00 from JOHN</p>
//           <p>• Dr: ₦4,900 Netflix</p>
//           <p>• You paid ₦2,500 to BOLT</p>
//         </div>
//       </div>
//     </div>
//   );
// }



// frontend/src/components/SMSParser/SMSParser.jsx   ← REPLACE YOUR OLD ONE WITH THIS
import React, { useState } from 'react';
import { toast } from 'sonner';

export default function SMSParser() {
  const [parsing, setParsing] = useState(false);
  const token = localStorage.getItem('token');

  // AUTO REFRESH ALL PAGES (Dashboard, Transactions, Forecast, etc.)
  const triggerGlobalRefresh = () => {
    // This broadcasts to all open tabs/components
    window.dispatchEvent(new Event('transactionAdded'));
  };

  const parseSMS = (text) => {
    const lower = text.toLowerCase();

    const creditMatch = text.match(/(cr|credit|credited|deposit|received|fund|alert)[\s:]*₦?([\d,]+\.?\d*)/i);
    const debitMatch = text.match(/(dr|debited|withdrawal|paid|spent|pos|transfer)[\s:]*₦?([\d,]+\.?\d*)/i);

    let amount = 0;
    let type = 'expense';
    let description = 'Bank Alert';

    if (creditMatch) {
      amount = parseFloat(creditMatch[2].replace(/,/g, ''));
      type = 'income';
      description = lower.includes('salary') ? 'Salary Credit' : 
                    lower.includes('transfer') ? 'Transfer Received' : 'Credit Alert';
    } else if (debitMatch) {
      amount = parseFloat(debitMatch[2].replace(/,/g, ''));
      type = 'expense';

      if (lower.includes('netflix')) description = 'Netflix Subscription';
      else if (lower.includes('dstv') || lower.includes('gotv')) description = 'DSTV/GOtv';
      else if (lower.includes('airtime') || lower.includes('data')) description = 'Airtime/Data';
      else if (lower.includes('bolt') || lower.includes('uber')) description = 'Ride (Bolt/Uber)';
      else if (lower.includes('pos')) description = 'POS Purchase';
      else description = 'Bank Debit';
    } else {
      return null;
    }

    return { amount, type, description };
  };

  const saveAndRefresh = async (parsed) => {
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/transaction`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: parsed.amount,
          type: parsed.type,
          category: parsed.type === 'income' ? 'Salary/Income' : 'Others',
          description: `${parsed.description} (SMS)`,
          date: new Date().toISOString().split('T')[0]
        })
      });

      toast.success(`₦${parsed.amount.toLocaleString()} ${parsed.type === 'income' ? 'income' : 'spent'} added! ✅`);
      
      // AUTO REFRESH EVERYWHERE
      triggerGlobalRefresh();
    } catch (err) {
        console.log(err)
      toast.error('Save failed');
    }
  };

  const handlePaste = async (e) => {
    const text = e.clipboardData?.getData('text') || await navigator.clipboard.readText().catch(() => '');
    if (!text) return toast('No text found. Copy SMS first!');

    setParsing(true);
    toast.loading('Reading SMS...');

    const parsed = parseSMS(text);
    if (parsed) {
      await saveAndRefresh(parsed);
    } else {
      toast.error('Not a bank alert. Try copying full SMS');
    }
    setParsing(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        onClick={handlePaste}
        className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-white text-3xl cursor-pointer transition-all hover:scale-110 ${
          parsing ? 'bg-gray-500 animate-pulse' : 'bg-gradient-to-r from-green-500 to-emerald-600'
        }`}
      >
        {parsing ? '...' : '💬'}
      </div>

      {/* Floating Tooltip */}
       <div className="mt-20 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl max-w-sm">
         <h3 className="font-bold text-lg mb-2">SMS Parser Active!</h3>
         <p className="text-sm opacity-80">
           Copy any bank SMS (Opay, GTB, Kuda, Palmpay, etc.) → Click the button → Auto-added!
         </p>
         <div className="mt-4 text-xs space-y-1 opacity-60">
           <p>Works with:</p>
           <p>• Cr: ₦50,000.00 from JOHN</p>
           <p>• Dr: ₦4,900 Netflix</p>
           <p>• You paid ₦2,500 to BOLT</p>
         </div>
       </div>
    </div>
  );
}