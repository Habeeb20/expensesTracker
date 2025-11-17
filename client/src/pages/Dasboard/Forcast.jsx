// import React, { useEffect, useState } from 'react';
// import { Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import axios from 'axios';
// import ImageLoadingSpinner from '../../utils/Loading';

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// export default function ForecastDashboard() {
//   const [prob, setProb] = useState({});
//   const [next7, setNext7] = useState([]);
//   const [risks, setRisks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const userId = localStorage.getItem('userId');
//   const token = localStorage.getItem('token'); // GET TOKEN

//   // Axios instance with token
//   const api = axios.create({
//     baseURL: import.meta.env.VITE_BACKEND_URL,
//     headers: {
//       Authorization: `Bearer ${token}`, // ADD TOKEN
//       'Content-Type': 'application/json',
//     },
//   });

//   useEffect(() => {
//     if (!userId || !token) {
//       setError('Please log in to view forecast');
//       setLoading(false);
//       return;
//     }

//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const [probRes, next7Res, risksRes] = await Promise.all([
//           api.get(`/api/forecast/probability/${userId}`),
//           api.get(`/api/forecast/next7days/${userId}`),
//           api.get(`/api/forecast/risks/${userId}`),
//         ]);

//         setProb(probRes.data);
//         setNext7(next7Res.data);
//         setRisks(risksRes.data);
//         console.log(risksRes.data, next7Res.data, probRes.data)
//         setError(null);
//       } catch (err) {
//         console.error('Forecast error:', err);
//         setError(err.response?.data?.error || 'Failed to load forecast');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [userId, token]);

//   // Heatmap Data
//   const daysOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
//   const categories = prob['Mon'] ? Object.keys(prob['Mon']) : [];

//   // Bar Chart Data
//   const barData = {
//     labels: next7.map(d => `${d.day} (${d.date.split('-').slice(1).join('/')})`),
//     datasets: next7[0]?.categories
//       ? next7[0].categories.map(cat => ({
//           label: cat.name,
//           data: next7.map(d => 
//             d.categories.find(c => c.name === cat.name)?.amount || 0
//           ),
//           backgroundColor: cat.color,
//           borderRadius: 4,
//         }))
//       : [],
//   };

//   const barOptions = {
//     responsive: true,
//     plugins: {
//       legend: { position: 'top' },
//       title: { display: false },
//       tooltip: {
//         callbacks: {
//           label: ctx => `₦${ctx.parsed.y.toLocaleString()}`,
//         },
//       },
//     },
//     scales: {
//       x: { stacked: true },
//       y: { stacked: true },
//     },
//   };

//   if (loading) return <ImageLoadingSpinner/>

//   if (error) {
//     return (
//       <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700">
//         <strong>Error:</strong> {error}
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
//       {/* Header */}
//       <div className="text-center mb-6">
//         <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
//           Your Spending Forecast
//         </h2>
//         <p className="text-gray-600 dark:text-gray-400 mt-1">
//           AI-powered insights into your spending habits
//         </p>
//       </div>

//       <div className="grid md:grid-cols-2 gap-6">
//         {/* Probability Heatmap */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 border border-gray-200 dark:border-gray-700">
//           <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
//             <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
//             Weekly Spending Probability
//           </h3>
//           <div className="grid grid-cols-7 gap-1 text-xs font-medium">
//             {daysOrder.map(day => (
//               <div key={day} className="text-center text-gray-600 dark:text-gray-400 font-bold">
//                 {day}
//               </div>
//             ))}
//             {daysOrder.map(day => (
//               <div key={`cell-${day}`} className="col-span-1">
//                 {categories.map(cat => {
//                   const val = prob[day]?.[cat] || 0;
//                   const intensity = val / 100;
//                   return (
//                     <div
//                       key={`${day}-${cat}`}
//                       className="p-2 m-0.5 rounded text-center text-white font-semibold text-xs shadow-sm transition-all hover:scale-105"
//                       style={{
//                         backgroundColor: `rgba(239, 68, 68, ${intensity})`, // Red scale
//                         opacity: intensity > 0 ? 1 : 0.3,
//                       }}
//                       title={`${cat}: ${val}% chance on ${day}`}
//                     >
//                       {val > 30 ? val : ''}
//                     </div>
//                   );
//                 })}
//               </div>
//             ))}
//           </div>
//           <div className="flex justify-center gap-3 mt-4 flex-wrap">
//             {categories.map(cat => (
//               <span
//                 key={cat}
//                 className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
//               >
//                 {cat}
//               </span>
//             ))}
//           </div>
//         </div>

//         {/* 7-Day Forecast Bar */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 border border-gray-200 dark:border-gray-700">
//           <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
//             <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
//             Next 7 Days Forecast
//           </h3>
//           <div className="h-64">
//             <Bar data={barData} options={barOptions} />
//           </div>
//         </div>
//       </div>

//       {/* Risk Alerts */}
//       {risks.length > 0 && (
//         <div className="mt-6">
//           <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
//             Risk Alerts
//           </h3>
//           <div className="space-y-3">
//             {risks.map((r, i) => (
//               <div
//                 key={i}
//                 className={`p-4 rounded-xl flex items-center space-x-3 transition-all ${
//                   r.level === 'high'
//                     ? 'bg-red-100 text-red-800 border border-red-300'
//                     : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
//                 }`}
//               >
//                 <div className="text-2xl">
//                   {r.level === 'high' ? 'High Risk' : 'Warning'}
//                 </div>
//                 <div className="flex-1">{r.message}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



// frontend/src/components/Forecast/ForecastDashboard.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';
import ImageLoadingSpinner from '../../utils/Loading';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ForecastDashboard() {
  const [prob, setProb] = useState({});
  const [next7, setNext7] = useState([]);
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  // CREATE AXIOS INSTANCE ONCE (outside useEffect)
  const api = useMemo(() => {
    return axios.create({
      baseURL: import.meta.env.VITE_BACKEND_URL,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }, [token]);

  useEffect(() => {
    if (!userId || !token) {
      setError('Please log in to view forecast');
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [probRes, next7Res, risksRes] = await Promise.all([
          api.get(`/api/forecast/probability/${userId}`),
          api.get(`/api/forecast/next7days/${userId}`),
          api.get(`/api/forecast/risks/${userId}`),
        ]);

        if (isMounted) {
          setProb(probRes.data);
          setNext7(next7Res.data);
          setRisks(risksRes.data);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Forecast error:', err);
          setError(err.response?.data?.error || 'Failed to load forecast');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    // Cleanup to prevent state update on unmounted component
    return () => {
      isMounted = false;
    };
  }, [userId, api]); // ← Only re-run if userId or api (token) changes

  // Rest of your chart logic (unchanged)
  const daysOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const categories = prob['Mon'] ? Object.keys(prob['Mon']) : [];

  const barData = {
    labels: next7.map(d => `${d.day} (${d.date.split('-').slice(1).join('/')})`),
    datasets: next7[0]?.categories
      ? next7[0].categories.map(cat => ({
          label: cat.name,
          data: next7.map(d =>
            d.categories.find(c => c.name === cat.name)?.amount || 0
          ),
          backgroundColor: cat.color,
          borderRadius: 4,
        }))
      : [],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: ctx => `₦${ctx.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: { x: { stacked: true }, y: { stacked: true } },
  };

  if (loading) return <ImageLoadingSpinner />;

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          Your Spending Forecast
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          AI-powered insights into your spending habits
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Heatmap */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
            Weekly Spending Probability
          </h3>
          <div className="grid grid-cols-7 gap-1 text-xs font-medium">
            {daysOrder.map(day => (
              <div key={day} className="text-center text-gray-600 dark:text-gray-400 font-bold">
                {day}
              </div>
            ))}
            {daysOrder.map(day => (
              <div key={`cell-${day}`} className="col-span-1">
                {categories.map(cat => {
                  const val = prob[day]?.[cat] || 0;
                  const intensity = val / 100;
                  return (
                    <div
                      key={`${day}-${cat}`}
                      className="p-2 m-0.5 rounded text-center text-white font-semibold text-xs shadow-sm transition-all hover:scale-105"
                      style={{
                        backgroundColor: `rgba(239, 68, 68, ${intensity})`,
                        opacity: intensity > 0 ? 1 : 0.3,
                      }}
                      title={`${cat}: ${val}% chance on ${day}`}
                    >
                      {val > 30 ? val : ''}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-3 mt-4 flex-wrap">
            {categories.map(cat => (
              <span
                key={cat}
                className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Next 7 Days Forecast
          </h3>
          <div className="h-64">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>

      {/* Risk Alerts */}
      {risks.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
            Risk Alerts
          </h3>
          <div className="space-y-3">
            {risks.map((r, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl flex items-center space-x-3 transition-all ${
                  r.level === 'high'
                    ? 'bg-red-100 text-red-800 border border-red-300'
                    : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                }`}
              >
                <div className="text-2xl">
                  {r.level === 'high' ? 'High Risk' : 'Warning'}
                </div>
                <div className="flex-1">{r.message}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}