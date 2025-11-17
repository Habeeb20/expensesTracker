// backend/routes/forecast.ts

import express from 'express';
import { getProbability, getNext7Days, getRiskAlerts } from '../controllers/forcastController.js';
import { verifyToken } from '../utils/helpers.js';

const router = express.Router();

router.use(verifyToken);
router.get('/probability/:userId', getProbability);
router.get('/next7days/:userId', getNext7Days);
router.get('/risks/:userId', getRiskAlerts); // Extra for badges

export default router;

