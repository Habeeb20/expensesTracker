// backend/routes/networth.js
import express from 'express';

import { verifyToken } from '../utils/helpers.js';
import { deletenetwort, edit, getNetWorth, postNetWorth } from '../controllers/networtController.js';
const router = express.Router();
router.use(verifyToken);
// GET all net worth items
router.get('/networth', getNetWorth 
)
// POST - add new asset or liability
router.post('/networth',  postNetWorth
)
// BONUS: Add these too (users will want them later)
router.put('/networth/:id',	edit
)
router.delete('/networth/:id', deletenetwort
)

export default router;