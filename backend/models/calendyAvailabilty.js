import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dayOfWeek: { type: Number, required: true, min: 0, max: 6 }, // 0 = Sunday
  startTime: { type: String, required: true }, // "09:00"
  endTime: { type: String, required: true },   // "17:00"
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

availabilitySchema.index({ user: 1, dayOfWeek: 1 });

export default mongoose.model('Availability', availabilitySchema);