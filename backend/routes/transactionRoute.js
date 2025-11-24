// routes/transactionRoutes.js
import express from 'express';
import { verifyToken } from '../utils/helpers.js';
import { createTransaction,  getTransactions,
  getAnalytics, deleteATransaction, deleteAllTransactions  } from '../controllers/transactionController.js';
import { createBudget,  deductBudget,  deleteBudget,  getBudgets, updateBudget} from '../controllers/BudgetController.js';


const router = express.Router();

router.use(verifyToken);

router.post('/transaction', createTransaction);
router.get('/transactions', getTransactions);
router.get('/analytics', getAnalytics);

router.post('/budgets', createBudget);
router.get('/budgets', getBudgets);
router.put("/:id", updateBudget)
router.delete("/:id", deleteBudget)
router.post('/deduct/:id',  deductBudget)


router.delete('/transaction/:id', deleteATransaction )

router.delete('/transactions/all', deleteAllTransactions);



export default router;


