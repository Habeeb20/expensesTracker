
import mongoose from 'mongoose';

const recurringSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
  nextDue: { type: Date, required: true },
});

export default mongoose.model('Recurring', recurringSchema);