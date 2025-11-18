// backend/controllers/reOccuringController.js
import Recurring from '../models/reoccurringModel.js';

import Transaction from '../models/TransactionModel.js';

// GET all active recurrings
export const getReoccuring = async (req, res) => {
  try {
    const recurrings = await Recurring.find({ userId: req.user.id }).sort({ nextDate: 1 });
    res.json(recurrings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// AI Detect recurring patterns
export const getMyReoccuring = async (req, res) => {
   try {
    console.log("Detecting for user:", req.user.id);

    // ← THIS WAS THE BUG! You use "user" not "userId"
    const transactions = await Transaction.find({
      user: req.user.id,        // ← CHANGED FROM userId TO user
      type: 'expense'
    }).sort({ date: -1 }).limit(200);

    console.log(`Found ${transactions.length} expenses`);

    if (transactions.length === 0) {
      return res.json([]);
    }

    const candidates = {};

    transactions.forEach(t => {
      const cleanDesc = t.description?.toLowerCase().trim() || '';
      const cleanCat = typeof t.category === 'object' ? t.category.name?.toLowerCase() : 'uncategorized';
      const amount = Math.round(t.amount);

      const key = `${amount}-${cleanCat}-${cleanDesc}`;

      if (!candidates[key]) {
        candidates[key] = { count: 0, dates: [], transaction: t };
      }
      candidates[key].count++;
      candidates[key].dates.push(new Date(t.date));
    });

    const detected = [];

    for (const key in candidates) {
      if (candidates[key].count >= 3) {
        const dates = candidates[key].dates.sort();
        const intervals = [];
        for (let i = 1; i < dates.length; i++) {
          intervals.push((dates[i] - dates[i - 1]) / 86400000);
        }
        const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length || 30;

        let frequency = avg < 12 ? 'weekly' : avg > 180 ? 'yearly' : 'monthly';

        const nextDate = new Date(dates[dates.length - 1]);
        if (frequency === 'weekly') nextDate.setDate(nextDate.getDate() + 7);
        else nextDate.setMonth(nextDate.getMonth() + 1);

        detected.push({
          amount: candidates[key].transaction.amount,
          category: candidates[key].transaction.category?.name || 'Uncategorized',
          description: candidates[key].transaction.description,
          type: 'expense',
          frequency,
          nextDate: nextDate.toISOString(),
        });
      }
    }

    console.log('DETECTED:', detected);
    res.json(detected);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed' });
  }
};





// Confirm & activate a recurring
export const confirmReoccuring = async (req, res) => {
  try {
    const { amount, category, description, type = 'expense', frequency = 'monthly', nextDate } = req.body;

    const recurring = await Recurring.create({
      userId: req.user.id,
      amount: +amount,
      category,
      description,
      type,
      frequency,
      nextDate: new Date(nextDate),
      active: true
    });

    res.status(201).json(recurring);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create recurring' });
  }
};

// Toggle ON/OFF
export const toggleRecurring = async (req, res) => {
  try {
    const recurring = await Recurring.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!recurring) return res.status(404).json({ message: 'Not found' });

    recurring.active = !recurring.active;
    await recurring.save();

    res.json({
      recurring,
      message: recurring.active
        ? `${recurring.description} auto-add ACTIVATED!`
        : `${recurring.description} auto-add OFF`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Toggle failed' });
  }
};