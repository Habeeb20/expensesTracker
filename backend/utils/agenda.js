// src/jobs/recurring.js
import Agenda from 'agenda';
import Transaction from '../models/TransactionModel.js';
import { checkDueTodos } from './notification.js';
import  Transaction from '../models/TransactionModel.js';

import { addDays, addMonths, addYears } from 'date-fns';

const agenda = new Agenda({ db: { address: process.env.MONGODB_URI } });

const getNextDate = (tx) => {
  const { interval, lastGenerated } = tx.recurring;
  const base = lastGenerated || tx.date;

  switch (interval) {
    case 'daily': return addDays(base, 1);
    case 'weekly': return addDays(base, 7);
    case 'monthly': return addMonths(base, 1);
    case 'yearly': return addYears(base, 1);
    default: return base;
  }
};

agenda.define('process recurring transactions', async () => {
  const recurring = await Transaction.find({ 'recurring.isRecurring': true });

  for (const tx of recurring) {
    const nextDate = getNextDate(tx);
    if (nextDate <= new Date() && (!tx.recurring.endDate || nextDate <= tx.recurring.endDate)) {
      await Transaction.create({
        ...tx.toObject(),
        _id: undefined,
        date: nextDate,
        recurring: { ...tx.recurring, lastGenerated: nextDate },
      });
    }
  }
});

agenda.define('check todo alerts', checkDueTodos);

agenda.on('ready', async () => {
  await agenda.every('0 0 * * *', 'process recurring transactions'); // Daily at midnight
  await agenda.every('*/10 * * * *', 'check todo alerts'); // Every 10 mins
  agenda.start();
  console.log('Agenda jobs started');
});

export default agenda;