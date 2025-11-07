// controllers/categoryController.js
import Category from '../models/categoryModel.js';
import Transaction from '../models/TransactionModel.js';





// GET Categories + Budget Progress
export const getCategories = async (req, res) => {
  try {
    const userId = req.user._id;

    const categories = await Category.find({ user: userId })
      .select('name type budget icon color _id');

    // Calculate spent per category
    const transactions = await Transaction.find({ user: userId });
    const spentByCategory = {};

    transactions.forEach(t => {
      if (t.type === 'expense' && t.category) {
        const catId = t.category.toString();
        spentByCategory[catId] = (spentByCategory[catId] || 0) + t.amount;
      }
    });

    const enriched = categories.map(cat => ({
      ...cat.toObject(),
      spent: spentByCategory[cat._id.toString()] || 0,
      remaining: Math.max(0, cat.budget - (spentByCategory[cat._id.toString()] || 0)),
      percentage: cat.budget > 0 
        ? Math.min(100, Math.round(((spentByCategory[cat._id.toString()] || 0) / cat.budget) * 100))
        : 0
    }));

    res.json({ success: true, categories: enriched });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE a new category (optional — for future use)
export const createCategory = async (req, res) => {
  try {
    const { name, type, icon, color } = req.body;
    const userId = req.user._id;

    if (!name || !type) {
      return res.status(400).json({ success: false, message: 'Name and type required' });
    }

    const category = await Category.create({
      user: userId,
      name: name.trim(),
      type,
      icon,
      color
    });

    res.status(201).json({ success: true, category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};