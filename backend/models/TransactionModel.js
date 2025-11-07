import mongoose from "mongoose";


const TransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User',required: true },
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  amount: Number,
  type: { type: String, enum: ['income', 'expense'] },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  description: String,
  date: { type: Date, default: Date.now },
  tags: [String],
  attachment: String,
  splitWith: [{ user: mongoose.Schema.Types.ObjectId, amount: Number }],
  recurring: {
    isRecurring: { type: Boolean, default: false },
    interval: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly'] },
    endDate: Date,
    lastGenerated: Date,
  },
});


export default mongoose.model('Transaction', TransactionSchema);