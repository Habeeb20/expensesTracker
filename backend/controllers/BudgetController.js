import Category from '../models/categoryModel.js';
import Budget from '../models/budgetModel.js';
import Transaction from "../models/TransactionModel.js"

// CREATE Budget
export const createBudget = async (req, res) => {
  const { category, limit, task, dueDate, categoryId } = req.body;
  try {
    const budget = await Budget.create({
      user: req.user._id,
      category, limit, task, dueDate, categoryId, spent: 0
    });
    res.json({ success: true, budget });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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



export const updateBudget = async(req, res) => {
    // routes/budgetRoutes.js

  const { spent } = req.body;
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { spent },
      { new: true }
    );
    if (!budget) return res.status(404).json({ success: false });
    res.json({ success: true, budget });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }

}




export const deductBudget = async(req, res) => {
      const { amount, description } = req.body;
  try {
    const budget = await Budget.findOne({ _id: req.params.id, user: req.user._id, isActive: true });
    if (!budget) return res.status(404).json({ success: false, message: 'Budget not found' });

    if (amount > budget.limit - budget.spent) {
      return res.status(400).json({ success: false, message: 'Not enough budget' });
    }

    // 1. Create expense
    await Transaction.create({
      user: req.user._id,
      amount,
      type: 'expense',
      category: budget.categoryId,
      description: `${description || budget.task} [Budget: ${budget.category}]`,
      date: new Date()
    });

    // 2. Update spent
    budget.spent += amount;

    // 3. If fully used → deactivate
    if (budget.spent >= budget.limit) {
      budget.isActive = false;
    }
    await budget.save();

    res.json({ success: true, budget });
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, message: err.message });
  }
}








export const editBudget = async(req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!budget) return res.status(404).json({ success: false });
    res.json({ success: true, budget });
  } catch (err) {
    res.status(500).json({ success: false });
  }
}


export const deleteBudget = async(req, res) => {
      try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isActive: false },
      { new: true }
    );
    if (!budget) return res.status(404).json({ success: false });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
}





