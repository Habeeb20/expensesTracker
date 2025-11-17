// backend/utils/cronJobs.ts
import cron from 'node-cron';
import Recurring from "../models/reoccuring.js"
import Transaction from '../models/TransactionModel.js';


cron.schedule('0 0 * * *', async () => { // Daily at midnight
  const recurrings = await Recurring.find({ nextDue: { $lte: new Date() } });
  for (const rec of recurrings) {
    await new Transaction({
      user: rec.user,
      category: rec.category,
      amount: rec.amount,
      type: rec.type,
      date: new Date(),
    }).save();

    // Update nextDue
    let next = new Date(rec.nextDue);
    if (rec.frequency === 'daily') next.setDate(next.getDate() + 1);
    else if (rec.frequency === 'weekly') next.setDate(next.getDate() + 7);
    else next.setMonth(next.getMonth() + 1);
    rec.nextDue = next;
    await rec.save();
  }
});