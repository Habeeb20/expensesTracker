// backend/routes/debt.js
import express from 'express';
const router = express.Router();
import Debt from '../models/DebtTrackerModel.js';
import { verifyToken } from '../utils/helpers.js';


// GET all debts
router.get('/debt', verifyToken, async (req, res) => {
  try {
    const debts = await Debt.find({ userId: req.user.id }).sort({ dueDate: 1 });
    res.json(debts);
  } catch (err) {
    res.status(500).json({ message: 'Error' });
  }
});

// POST - add debt
router.post('/debt', verifyToken, async (req, res) => {
  const { type, person, amount, description, dueDate } = req.body;
  const debt = await Debt.create({
    userId: req.user.id,
    type,
    person: person.trim(),
    amount: +amount,
    description,
    dueDate: dueDate || null,
    paid: false
  });
  res.status(201).json(debt);
});

// PUT - mark as paid
router.put('/debt/:id/paid', verifyToken, async (req, res) => {
  const debt = await Debt.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { paid: true },
    { new: true }
  );
  res.json(debt);
});

// DELETE
router.delete('/debt/:id', verifyToken, async (req, res) => {
  await Debt.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  res.json({ message: 'Deleted' });
});

export default router;