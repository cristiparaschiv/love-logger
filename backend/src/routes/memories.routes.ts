import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getOnThisDay } from '../controllers/memories.controller';

const router = Router();

router.use(authenticate);

router.get('/on-this-day', getOnThisDay);

export default router;
