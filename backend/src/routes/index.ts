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
import checkinRoutes from './checkin.routes';
import { authenticate } from '../middleware/auth.middleware';
import { prisma } from '../config/database';

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
router.use('/checkin', checkinRoutes);

// Users endpoint - returns both users with display names
router.get('/users', authenticate, async (_req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, username: true, displayName: true },
    orderBy: { username: 'asc' },
  });
  res.json({ users });
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
