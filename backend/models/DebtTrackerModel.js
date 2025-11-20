
import mongoose from 'mongoose';

const debtSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['owe', 'owed'], required: true }, // owe = I owe someone, owed = someone owes me
  person: { type: String, required: true }, // name of person
  amount: { type: Number, required: true },
  description: { type: String },
  dueDate: { type: Date },
  paid: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Debt', debtSchema);