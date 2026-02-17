import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getToday, submit, getHistory, getStats, getConfig, updateConfig } from '../controllers/checkin.controller';

const router = Router();

router.use(authenticate);

router.get('/today', getToday);
router.post('/submit', submit);
router.get('/history', getHistory);
router.get('/stats', getStats);
router.get('/config', getConfig);
router.put('/config', updateConfig);

export default router;
