import express from 'express';
import { verifyToken } from '../utils/helpers.js';
import { setAvailability, createEventType,
  getHostSchedule,
  getAvailableSlots,
  createBooking,
  getMyBookings,
  cancelBooking, } from '../controllers/schedullingController.js';


const router = express.Router();
router.use(verifyToken);

router.post('/availability', setAvailability);
router.post('/event-types', createEventType);
router.get('/host/:userId', getHostSchedule);
router.get('/slots', getAvailableSlots);
router.post('/book', createBooking);
router.get('/my-bookings', getMyBookings);
router.post('/bookings/:id/cancel', cancelBooking);

export default router;