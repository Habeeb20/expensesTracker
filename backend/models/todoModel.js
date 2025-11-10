import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  dueDate: Date,
  repeat: { type: String, enum: ['none', 'daily', 'weekly', 'monthly'], default: 'none' },
  notify: { type: Boolean, default: true },
  completed: { type: Boolean, default: false },
});

export default mongoose.model('Todo', TodoSchema);