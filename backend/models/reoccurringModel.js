// backend/models/Recurring.js  ← Replace your old one
import mongoose from 'mongoose';

const recurringSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['expense', 'income'], default: 'expense' },
  frequency: { type: String, enum: ['weekly', 'monthly', 'yearly'], default: 'monthly' },
  nextDate: { type: Date, required: true },
  active: { type: Boolean, default: false }  // ← THIS IS THE SWITCH
}, { timestamps: true });

export default mongoose.model('Recurring', recurringSchema);