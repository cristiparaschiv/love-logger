import { Router } from 'express';
import authRoutes from './auth.routes';
import eventsRoutes from './events.routes';
import geocodeRoutes from './geocode.routes';
import vacationsRoutes from './vacations.routes';
import timelineRoutes from './timeline.routes';
import scoreRoutes from './score.routes';
import wishlistRoutes from './wishlist.routes';
import relationshipRoutes from './relationship.routes';
import memoriesRoutes from './memories.routes';
import notificationsRoutes from './notifications.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/events', eventsRoutes);
router.use('/geocode', geocodeRoutes);
router.use('/vacations', vacationsRoutes);
router.use('/timeline', timelineRoutes);
router.use('/score', scoreRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/relationship', relationshipRoutes);
router.use('/memories', memoriesRoutes);
router.use('/notifications', notificationsRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
