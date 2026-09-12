import mongoose from 'mongoose';

const eventTypeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  slug: { type: String, required: true },
  duration: { type: Number, required: true }, // minutes
  bufferBefore: { type: Number, default: 0 },
  bufferAfter: { type: Number, default: 0 },
  minNoticeHours: { type: Number, default: 1 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

eventTypeSchema.index({ user: 1, slug: 1 }, { unique: true });

export default mongoose.model('EventType', eventTypeSchema);