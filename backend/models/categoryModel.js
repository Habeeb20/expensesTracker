// models/Category.js
import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  icon: String,
  color: String,
  budget: { type: Number, default: 0 } // optional per-category budget
});

export default mongoose.model('Category', CategorySchema);