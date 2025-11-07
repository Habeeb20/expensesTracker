// routes/transactionRoutes.js
import express from 'express';
import { verifyToken } from '../utils/helpers.js';
import { createTransaction,  getTransactions,
  getAnalytics } from '../controllers/transactionController.js';
import { createBudget,  getBudgets } from '../controllers/BudgetController.js';


const router = express.Router();

router.use(verifyToken);

router.post('/transaction', createTransaction);
router.get('/transactions', getTransactions);
router.get('/analytics', getAnalytics);

router.post('/budget', createBudget);
router.get('/budgets', getBudgets);

export default router;