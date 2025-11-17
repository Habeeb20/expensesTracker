import Transaction from "../models/TransactionModel.js";
import Budget from "../models/budgetModel.js";

// Helper: Get color for category
const getCategoryColor = (cat) => {
  const colors = {
    Food: "#f59e0b",
    Transport: "#3b82f6",
    Entertainment: "#ec4899",
    Utilities: "#10b981",
    Shopping: "#8b5cf6",
    Health: "#ef4444",
    Other: "#6b7280",
  };
  return colors[cat] || "#" + Math.floor(Math.random() * 16777215).toString(16);
};

// ========== 1. PROBABILITY ==========
const calculateProbability = (txns) => {
  const dayMap = {};

  txns.forEach((t) => {
    const day = new Date(t.date).toLocaleString("en-US", { weekday: "short" });
    dayMap[day] = dayMap[day] || {};
    dayMap[day][t.category] = (dayMap[day][t.category] || 0) + 1;
  });

  const totalsPerDay = Object.values(dayMap).map((dayObj) =>
    Object.values(dayObj).reduce((a, b) => a + b, 0)
  );
  const max = Math.max(...totalsPerDay, 1);

  const result = {};
  for (const day in dayMap) {
    result[day] = {};
    for (const cat in dayMap[day]) {
      result[day][cat] = Math.round((dayMap[day][cat] / max) * 100);
    }
  }
  return result;
};

// ========== 2. 7-DAY FORECAST ==========
const predictNext7Days = async (userId) => {
  const txns = await Transaction.find({ user: userId })
    .sort({ date: -1 })
    .limit(500);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date().getDay();
  const next7Days = [...days.slice(today), ...days.slice(0, today)].slice(0, 7);

  // Count occurrences & total amount per day+category
  const countMap = {};
  const totalMap = {};

  txns.forEach((t) => {
    const day = new Date(t.date).toLocaleString("en-US", { weekday: "short" });
    countMap[day] = countMap[day] || {};
    totalMap[day] = totalMap[day] || {};

    countMap[day][t.category] = (countMap[day][t.category] || 0) + 1;
    totalMap[day][t.category] = (totalMap[day][t.category] || 0) + t.amount;
  });

  return next7Days.map((day, idx) => {
    const date = new Date(Date.now() + idx * 86400000).toISOString().split("T")[0];
    const categories = Object.keys(totalMap[day] || {}).map((cat) => {
      const avg = totalMap[day][cat] / (countMap[day][cat] || 1);
      return {
        name: cat,
        amount: Math.round(avg),
        color: getCategoryColor(cat),
      };
    });

    return { day, date, categories };
  });
};

// ========== 3. RISK ALERTS ==========
export const getRiskAlerts = async (req, res) => {
    const userId = req.user._id
  const budgets = await Budget.find({ user: userId });
  const txnsThisMonth = await Transaction.find({
    user: userId,
    date: {
      $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    },
  });

  const spent = {};
  txnsThisMonth.forEach((t) => {
    if (t.type === "expense") {
      spent[t.category] = (spent[t.category] || 0) + t.amount;
    }
  });

  const alerts = budgets
    .map((b) => {
      const used = spent[b.category] || 0;
      const percent = (used / b.amount) * 100;
      if (percent > 90) {
        return {
          level: "high",
          message: `Warning: ${b.category} budget 90 percent used (₦${used.toLocaleString()} of ₦${b.amount.toLocaleString()})`,
        };
      } else if (percent > 70) {
        return {
          level: "medium",
          message: `Caution: ${b.category} at ${Math.round(percent)} percent of budget`,
        };
      }
      return null;
    })
    .filter(Boolean);

  return alerts;
};

// ========== EXPORTED CONTROLLERS ==========
export const getProbability = async (req, res) => {
  const userId = req.user._id; // ← FROM JWT
  const { userId: paramId } = req.params;

  if (paramId !== userId.toString()) {
    return res.status(403).json({ error: "Forbidden: Access your own data" });
  }

  try {
    const transactions = await Transaction.find({ user: userId })
      .sort({ date: -1 })
      .limit(500);

    const probs = calculateProbability(transactions);
    res.json(probs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to calculate probability" });
  }
};

export const getNext7Days = async (req, res) => {
  const userId = req.user._id;
  const { userId: paramId } = req.params;

  if (paramId !== userId.toString()) {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    const forecast = await predictNext7Days(userId);
    res.json(forecast);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate forecast" });
  }
};

export const getRiskAlertsController = async (req, res) => {
  const userId = req.user._id;
  const { userId: paramId } = req.params;

  if (paramId !== userId.toString()) {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    const alerts = await getRiskAlerts(userId);
    res.json(alerts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get risk alerts" });
  }
};

