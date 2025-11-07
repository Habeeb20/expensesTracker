// controllers/transactionController.js

import Transaction from '../models/TransactionModel.js';
import Category from '../models/categoryModel.js';
import Budget from '../models/budgetModel.js';

// Helper: Calculate income, expense, total
const calculateSummary = async (userId) => {
  const transactions = await Transaction.find({ user: userId });
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const total = income - expense;

  // Check warnings
  let warning = null;
  if (income > 0) {
    const expenseRatio = expense / income;
    if (expenseRatio > 1) {
      warning = { type: 'over_budget', message: 'Expenses exceed income!' };
    } else if (expenseRatio >= 0.9) {
      warning = { type: 'near_limit', message: 'Expenses at 90% of income!' };
    }
  }

  return { income, expense, total, warning };
};

export const createTransaction = async (req, res) => {
  try {
    const { amount, type, category, description, date } = req.body;
    const userId = req.user._id;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid amount required' });
    }

    const cat = await Category.findOne({ _id: category, user: userId });
    if (!cat || cat.type !== type) {
      return res.status(400).json({ success: false, message: 'Invalid category' });
    }

    // Save transaction with amount
    const transaction = await Transaction.create({
      user: userId,
      amount,
      type,
      category,
      description,
      date: date || new Date()
    });

    const summary = await calculateSummary(userId);
    res.json({ success: true, transaction, summary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// GET All Transactions + Summary + Warnings
export const getTransactions = async (req, res) => {
  try {
    const userId = req.user._id;
    const transactions = await Transaction.find({ user: userId })
      .populate('category', 'name icon color')
      .sort({ date: -1 });

    const summary = await calculateSummary(userId);

    res.json({ success: true, transactions, summary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ANALYTICS: Daily, Weekly, Monthly, Yearly
export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const aggregate = async (startDate) => {
      const transactions = await Transaction.find({
        user: userId,
        date: { $gte: startDate }
      });
      const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
      return { income, expense, total: income - expense };
    };

    const [daily, weekly, monthly, yearly] = await Promise.all([
      aggregate(startOfDay),
      aggregate(startOfWeek),
      aggregate(startOfMonth),
      aggregate(startOfYear)
    ]);

    res.json({
      success: true,
      analytics: { daily, weekly, monthly, yearly }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};