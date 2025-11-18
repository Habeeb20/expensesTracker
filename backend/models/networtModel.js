// backend/models/NetWorth.js
import mongoose from 'mongoose';

const netWorthSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['asset', 'liability']
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

const NetWorth = mongoose.model('NetWorth', netWorthSchema);
export default NetWorth;