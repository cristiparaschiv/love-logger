import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getScore, incrementScore, resetScore } from '../controllers/score.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/score - Get current score
router.get('/', getScore);

// POST /api/score/increment - Increment score for logged-in user
router.post('/increment', incrementScore);

// POST /api/score/reset - Reset scores to 0-0 (optional, for testing)
router.post('/reset', resetScore);

export default router;
