import express from 'express';
import { verifyToken } from '../utils/helpers.js';
import { createTransaction,  getTransactions,
  getAnalytics } from '../controllers/transactionController.js';
import { createBudget,  deductBudget,  deleteBudget,  getBudgets, updateBudget } from '../controllers/BudgetController.js';


const router = express.Router();

router.use(verifyToken);

router.post('/budget', createBudget);
router.get('/budgets', getBudgets);
router.put("/:id", updateBudget)
router.delete("/:id", deleteBudget)
router.post('/deduct/:id',  deductBudget)



export default router;


