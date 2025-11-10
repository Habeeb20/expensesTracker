import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
const UserSchema = new mongoose.Schema({
    userId: {
    type: String,
    required: true,
    unique: true,
    default: uuidv4,
  },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: 'user' },
  password: String,
  currency: { type: String, default: 'NGN' },
  theme: { type: String, default: 'light' },
  household: { type: mongoose.Schema.Types.ObjectId, ref: 'Household' },
});

export default mongoose.model('User', UserSchema);