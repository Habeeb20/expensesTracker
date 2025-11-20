import express from "express"
import Transaction from "../models/TransactionModel.js"
import { verifyToken } from "../utils/helpers.js"
const yearlyrouter = express.Router()

// backend/routes/yearReview.js  ← Replace old one
yearlyrouter.get('/year-review/:year', verifyToken, async (req, res) => {
  try {
    const year = 2025
    const start = new Date(`${year}-01-01`);
    const end = new Date(`${year + 1}-01-01`);


    

    const transactions = await Transaction.find({
      user: req.user.id,
      date: { $gte: start, $lt: end }
    });

    const expenses = transactions.filter(t => t.type === 'expense');
    const totalSpent = expenses.reduce((a, b) => a + b.amount, 0);
    const totalTransactions = transactions.length;

    // Top category
    const catMap = {};
    expenses.forEach(t => {
      const cat = t.category?.name || t.category || 'Others';
      catMap[cat] = (catMap[cat] || 0) + t.amount;
    });
    const topCatEntry = Object.entries(catMap).sort((a, b) => b[1] - a[1])[0] || ['Others', 0];

    // Personality
    const personality = totalSpent > 10000000 
      ? { title: "OBO of Africa", description: "Money no be problem!", emoji: "🤑" }
      : totalSpent > 5000000 
        ? { title: "Enjoyment Minister", description: "You sabi enjoy life!", emoji: "🥳" }
        : { title: "Financial Guru", description: "You dey control money well!", emoji: "💪" };

    res.json({
      year,
      totalSpent,
      totalTransactions,
      topCategory: { name: topCatEntry[0], amount: topCatEntry[1] },
      personality
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error' });
  }
});


export default yearlyrouter 