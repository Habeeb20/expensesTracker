
import Availability from '../models/calendyAvailabilty.js';

import EventType from '../models/EventType.js';
import Booking from '../models/Booking.js';

// Host sets/updates their weekly availability (replaces the full week each call)
export const setAvailability = async (req, res) => {
  try {
    const { weeklyHours } = req.body; // [{ dayOfWeek, startTime, endTime }]
    await Availability.deleteMany({ user: req.user.id });
    const created = await Availability.insertMany(
      weeklyHours.map((h) => ({ ...h, user: req.user.id }))
    );
    res.status(201).json(created);
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error' });
  }
};

export const createEventType = async (req, res) => {
  try {
    const { title, slug, duration, bufferBefore, bufferAfter, minNoticeHours } = req.body;
    const eventType = await EventType.create({
      user: req.user.id,
      title,
      slug,
      duration,
      bufferBefore: bufferBefore || 0,
      bufferAfter: bufferAfter || 0,
      minNoticeHours: minNoticeHours || 1,
    });
    res.status(201).json(eventType);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getHostSchedule = async (req, res) => {
  try {
    const { userId } = req.params;
    const weeklyHours = await Availability.find({ user: userId, isActive: true });
    const eventTypes = await EventType.find({ user: userId, isActive: true });
    res.json({ weeklyHours, eventTypes });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Compute open slots for a host on a given date
export const getAvailableSlots = async (req, res) => {
  try {
    const { userId, eventTypeId, date } = req.query; // date: "2026-09-15"
    const eventType = await EventType.findById(eventTypeId);
    if (!eventType) return res.status(404).json({ message: 'Event type not found' });

    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getDay();

    const availability = await Availability.findOne({ user: userId, dayOfWeek, isActive: true });
    if (!availability) return res.json({ slots: [] });

    const [startH, startM] = availability.startTime.split(':').map(Number);
    const [endH, endM] = availability.endTime.split(':').map(Number);

    const windowStart = new Date(targetDate);
    windowStart.setHours(startH, startM, 0, 0);
    const windowEnd = new Date(targetDate);
    windowEnd.setHours(endH, endM, 0, 0);

    const dayStart = new Date(targetDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(targetDate);
    dayEnd.setHours(23, 59, 59, 999);

    const existingBookings = await Booking.find({
      host: userId,
      status: 'confirmed',
      startTime: { $gte: dayStart, $lte: dayEnd },
    });

    const slotMs = eventType.duration * 60 * 1000;
    const bufferMs = (eventType.bufferBefore + eventType.bufferAfter) * 60 * 1000;
    const minNoticeMs = eventType.minNoticeHours * 60 * 60 * 1000;
    const now = new Date();

    const slots = [];
    let cursor = new Date(windowStart);

    while (cursor.getTime() + slotMs <= windowEnd.getTime()) {
      const slotStart = new Date(cursor);
      const slotEnd = new Date(cursor.getTime() + slotMs);

      const tooSoon = slotStart.getTime() - now.getTime() < minNoticeMs;
      const conflicts = existingBookings.some((b) => {
        const bStart = new Date(b.startTime).getTime() - bufferMs;
        const bEnd = new Date(b.endTime).getTime() + bufferMs;
        return slotStart.getTime() < bEnd && slotEnd.getTime() > bStart;
      });

      if (!tooSoon && !conflicts) {
        slots.push(slotStart.toISOString());
      }
      cursor = new Date(cursor.getTime() + slotMs);
    }

    res.json({ slots });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { hostId, eventTypeId, startTime, notes } = req.body;
    const eventType = await EventType.findById(eventTypeId);
    if (!eventType) return res.status(404).json({ message: 'Event type not found' });

    const start = new Date(startTime);
    const end = new Date(start.getTime() + eventType.duration * 60 * 1000);

    // Re-check the slot is still free at write time (prevents race-condition double-booking)
    const conflict = await Booking.findOne({
      host: hostId,
      status: 'confirmed',
      startTime: { $lt: end },
      endTime: { $gt: start },
    });
    if (conflict) return res.status(409).json({ message: 'This slot was just booked. Please pick another.' });

    const booking = await Booking.create({
      host: hostId,
      invitee: req.user.id,
      eventType: eventTypeId,
      startTime: start,
      endTime: end,
      notes: notes || '',
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const asHost = await Booking.find({ host: req.user.id, status: 'confirmed' })
      .populate('invitee', 'first_name email')
      .populate('eventType', 'title duration')
      .sort({ startTime: 1 });
    const asInvitee = await Booking.find({ invitee: req.user.id, status: 'confirmed' })
      .populate('host', 'first_name email')
      .populate('eventType', 'title duration')
      .sort({ startTime: 1 });
    res.json({ asHost, asInvitee });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    const isParty = [booking.host.toString(), booking.invitee.toString()].includes(req.user.id);
    if (!isParty) return res.status(403).json({ message: 'Not authorized' });

    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};