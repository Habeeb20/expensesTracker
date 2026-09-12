import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  invitee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventType: { type: mongoose.Schema.Types.ObjectId, ref: 'EventType', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
  notes: { type: String, default: '' },
}, { timestamps: true });

bookingSchema.index({ host: 1, startTime: 1 });

export default mongoose.model('Booking', bookingSchema);