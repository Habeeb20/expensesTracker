// backend/routes/recurring.ts (New route file)
import express from 'express';
import  Recurring from '../models/reoccuring';


const router = express.Router();

router.post('/', async (req, res) => {
  const rec = new Recurring(req.body);
  await rec.save();
  res.json(rec);
});

// GET, PUT, DELETE similarly

export default router;

// Add to main app: app.use('/api/recurring', recurringRouter);