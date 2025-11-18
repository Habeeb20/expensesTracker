

// frontend/src/components/Forecast/ForecastDashboard.jsx
// import React, { useEffect, useState, useMemo } from 'react';
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
//   const token = localStorage.getItem('token');

//   // CREATE AXIOS INSTANCE ONCE (outside useEffect)
//   const api = useMemo(() => {
//     return axios.create({
//       baseURL: import.meta.env.VITE_BACKEND_URL,
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });
//   }, [token]);

//   useEffect(() => {
//     if (!userId || !token) {
//       setError('Please log in to view forecast');
//       setLoading(false);
//       return;
//     }

//     let isMounted = true;

//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const [probRes, next7Res, risksRes] = await Promise.all([
//           api.get(`/api/forecast/probability/${userId}`),
//           api.get(`/api/forecast/next7days/${userId}`),
//           api.get(`/api/forecast/risks/${userId}`),
//         ]);

//         if (isMounted) {
//           setProb(probRes.data);
//           setNext7(next7Res.data);
//           setRisks(risksRes.data);
//         }
//       } catch (err) {
//         if (isMounted) {
//           console.error('Forecast error:', err);
//           setError(err.response?.data?.error || 'Failed to load forecast');
//         }
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     };

//     fetchData();

//     // Cleanup to prevent state update on unmounted component
//     return () => {
//       isMounted = false;
//     };
//   }, [userId, api]); // ← Only re-run if userId or api (token) changes

//   // Rest of your chart logic (unchanged)
//   const daysOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
//   const categories = prob['Mon'] ? Object.keys(prob['Mon']) : [];

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
//       tooltip: {
//         callbacks: {
//           label: ctx => `₦${ctx.parsed.y.toLocaleString()}`,
//         },
//       },
//     },
//     scales: { x: { stacked: true }, y: { stacked: true } },
//   };

//   if (loading) return <ImageLoadingSpinner />;

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
//         {/* Heatmap */}
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
//                         backgroundColor: `rgba(239, 68, 68, ${intensity})`,
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

//         {/* Bar Chart */}
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
  const [prob, setProb] = useState({});           // { Mon: { Food: 85, Transport: 60 } }
  const [next7, setNext7] = useState([]);         // Array of 7 days with categories + amounts
  const [risks, setRisks] = useState([]);         // Array of risk alerts
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  // Axios instance with token (re-created only when token changes)
  const api = useMemo(() => {
    return axios.create({
      baseURL: import.meta.env.VITE_BACKEND_URL,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }, [token]);

  // Fetch all forecast data
  useEffect(() => {
    if (!userId || !token) {
      setError('Please log in to view your forecast');
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchForecast = async () => {
      try {
        setLoading(true);
        setError(null);

        const [probRes, next7Res, risksRes] = await Promise.all([
          api.get(`/api/forecast/probability/${userId}`),
          api.get(`/api/forecast/next7days/${userId}`),
          api.get(`/api/forecast/risks/${userId}`),
        ]);

        if (isMounted) {
          setProb(probRes.data || {});
          setNext7(next7Res.data || []);
          setRisks(risksRes.data || []);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Forecast fetch error:', err);
          setError(err.response?.data?.message || 'Failed to load forecast data');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchForecast();

    return () => { isMounted = false };
  }, [userId, token, api]);

  // ──────────────────────────────────────────────
  // Process data safely with useMemo (prevents re-renders)
  // ──────────────────────────────────────────────
  const { categories, heatmapData, barLabels, barDatasets } = useMemo(() => {
    if (!next7.length || !next7[0]?.categories) {
      return { categories: [], heatmapData: {}, barLabels: [], barDatasets: [] };
    }

    const categoryObjects = next7[0].categories; // [{ name: "Food", color: "#ef4444" }, ...]
    const categories = categoryObjects.map(c => c.name);

    // Build consistent heatmap data
    const daysOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const heatmapData = {};

    daysOrder.forEach(day => {
      heatmapData[day] = {};
      categories.forEach(cat => {
        heatmapData[day][cat] = prob[day]?.[cat] || 0;
      });
    });



    

    // Bar chart labels (e.g., "Wed 11/19")
    const barLabels = next7.map(d => {
      const [_, month, date] = d.date.split('-');
      return `${d.day.slice(0, 3)} ${month}/${date}`;
    });

    // Bar chart datasets
    const barDatasets = categoryObjects.map(cat => ({
      label: cat.name,
      data: next7.map(dayObj =>
        dayObj.categories.find(c => c.name === cat.name)?.amount || 0
      ),
      backgroundColor: cat.color || '#94a3b8',
      borderRadius: 6,
      borderSkipped: false,
    }));

    return { categories, heatmapData, barLabels, barDatasets };
  }, [prob, next7]);

  const barData = {
    labels: barLabels,
    datasets: barDatasets,
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: (ctx) => `₦${ctx.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: { stacked: true },
      y: { stacked: true, beginAtZero: true },
    },
  };

  // ──────────────────────────────────────────────
  // Render States
  // ──────────────────────────────────────────────
  if (loading) return <ImageLoadingSpinner />;

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 max-w-md mx-auto">
          <strong className="block text-lg">Error</strong>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }
if (!next7.length || !next7[0]?.categories?.length) {
  return (
    <div className="p-10 text-center">
      <div className="max-w-md mx-auto">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          AI Forecast Not Ready Yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          We need at least 2 weeks of expenses to train the AI model 🤖
        </p>
        <div className="mt-6 p-4 bg-blue-50 rounded-xl text-blue-700">
          <strong>Tip:</strong> Add expenses for 10+ days to unlock forecast!
        </div>
      </div>
    </div>
  );
}
  const daysOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
          Your Spending Forecast
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          AI-powered insights for the next 7 days
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">

        {/* Heatmap */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            Weekly Spending Probability Heatmap
          </h3>

          <div className="overflow-x-auto">
            <div className="inline-grid grid-cols-8 gap-3 text-sm font-medium min-w-[640px]">
              {/* Empty corner + Day headers */}
              <div></div>
              {daysOrder.map(day => (
                <div key={day} className="text-center text-gray-600 dark:text-gray-300 font-bold">
                  {day}
                </div>
              ))}

              {/* Rows for each category */}
              {categories.map(cat => (
                <React.Fragment key={cat}>
                  <div className="text-left font-semibold text-gray-700 dark:text-gray-200 pr-4">
                    {cat}
                  </div>
                  {daysOrder.map(day => {
                    const val = heatmapData[day][cat];
                    const intensity = Math.max(val / 100, 0.15); // minimum visibility
                    return (
                      <div
                        key={`${day}-${cat}`}
                        className="flex items-center justify-center rounded-lg text-white font-bold text-xs h-12 transition-all hover:scale-110 shadow-sm"
                        style={{
                          backgroundColor: `rgba(239, 68, 68, ${intensity})`,
                        }}
                        title={`${cat}: ${val}% chance on ${day}`}
                      >
                        {val > 25 ? `${val}%` : ''}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {next7[0].categories.map(cat => (
              <span
                key={cat.name}
                className="px-4 py-2 rounded-full text-white text-sm font-medium shadow"
                style={{ backgroundColor: cat.color }}
              >
                {cat.name}
              </span>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
            Next 7 Days Forecast
          </h3>
          <div className="h-96">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>

      {/* Risk Alerts */}
      {risks.length > 0 && (
        <div className="max-w-4xl mx-auto mt-10">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-5">
            Risk Alerts
          </h3>
          <div className="space-y-4">
            {risks.map((risk, i) => (
              <div
                key={i}
                className={`p-5 rounded-xl flex items-center gap-4 text-lg font-medium shadow-lg border ${
                  risk.level === 'high'
                    ? 'bg-red-100 text-red-800 border-red-300'
                    : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}
              >
                <span className="text-3xl">
                  {risk.level === 'high' ? '🔴' : '🟡'}
                </span>
                <span>{risk.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}