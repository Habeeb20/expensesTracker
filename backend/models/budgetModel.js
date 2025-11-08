import mongoose from "mongoose"

const BudgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  category: {
    type: String,
    required: true,
    trim: true
  },
  limit: {
    type: Number,
    required: true,
    min: 0
  },
  spent: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  dueDate: { type: Date, }, // NEW
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },

}, {
  timestamps: true
});

export default  mongoose.model('Budget', BudgetSchema);