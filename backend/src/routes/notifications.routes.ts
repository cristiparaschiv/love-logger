import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getVapidKey, subscribe, unsubscribe } from '../controllers/notifications.controller';

const router = Router();

router.get('/vapid-public-key', getVapidKey);

router.post('/subscribe', authenticate, subscribe);
router.post('/unsubscribe', authenticate, unsubscribe);

export default router;
