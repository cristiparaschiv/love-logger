import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { reverseGeocode, search } from '../controllers/geocode.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/geocode/reverse?lat=48.8566&lon=2.3522
router.get('/reverse', reverseGeocode);

// GET /api/geocode/search?q=Paris
router.get('/search', search);

export default router;
