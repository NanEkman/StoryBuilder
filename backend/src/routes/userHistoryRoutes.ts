import { Router } from 'express';
import { createUserHistory, getUserHistoryByUser } from '../controllers/userHistoryController';

const router = Router();

// POST /user-history
router.post('/', createUserHistory);

// GET /user-history/:user_id
router.get('/:user_id', getUserHistoryByUser);

export default router;
