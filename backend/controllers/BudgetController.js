import Category from '../models/categoryModel.js';
import Budget from '../models/budgetModel.js';
// CREATE Budget
export const createBudget = async (req, res) => {
  try {
    const { category, limit } = req.body;
    const userId = req.user._id;

    const cat = await Category.findOne({ _id: category, user: userId, type: 'expense' });
    if (!cat) return res.status(400).json({ success: false, message: 'Invalid expense category' });

    const budget = await Budget.create({
      user: userId,
      category: cat.name,
      limit
    });

    res.json({ success: true, budget });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET All Budgets
export const getBudgets = async (req, res) => {
  try {
    const userId = req.user._id;
    const budgets = await Budget.find({ user: userId, isActive: true });

    res.json({ success: true, budgets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};