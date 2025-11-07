// routes/categoryRoutes.js
import express from 'express';
import { verifyToken } from '../utils/helpers.js';

import { getCategories, createCategory } from '../controllers/categoryController.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', getCategories);
router.post('/', createCategory);

export default router;