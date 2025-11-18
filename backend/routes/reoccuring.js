// backend/routes/recurring.js
import express from "express";
import { verifyToken } from "../utils/helpers.js";
import {
  getReoccuring,

  confirmReoccuring,
  toggleRecurring,
  getMyReoccuring
} from "../controllers/reOccuringController.js";
import Recurring from "../models/reoccurringModel.js";

import Transaction from "../models/TransactionModel.js";
import cron from "node-cron";

const router = express.Router();

// Apply auth to all routes
router.use(verifyToken);

// Routes
router.get('/recurring', getReoccuring);
router.get('/recurring/detect', getMyReoccuring);
router.post('/recurring', confirmReoccuring);
router.put('/recurring/:id/toggle', toggleRecurring);

// Daily cron job (2 AM) - Auto-add due recurrings
cron.schedule('0 2 * * *', async () => {
  console.log('Running recurring auto-add...');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = await Recurring.find({
    nextDate: { $lte: today },
    active: true
  });

  for (const r of due) {
    await Transaction.create({
      userId: r.userId,  // ← Fixed typo: r.userAId → r.userId
      amount: r.amount,
      type: r.type || 'expense',
      category: r.category,
      description: `${r.description} (Recurring)`,
      date: today,
      recurring: true
    });

    const next = new Date(today);
    if (r.frequency === 'weekly') next.setDate(next.getDate() + 7);
    else if (r.frequency === 'monthly') next.setMonth(next.getMonth() + 1);
    else if (r.frequency === 'yearly') next.setFullYear(next.getFullYear() + 1);

    r.nextDate = next;
    await r.save();
  }
});

export default router;