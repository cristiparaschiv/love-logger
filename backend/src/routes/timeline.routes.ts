import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  getAllTimelineEvents,
  getTimelineEventById,
  createTimelineEvent,
  updateTimelineEvent,
  deleteTimelineEvent,
} from '../controllers/timeline.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/timeline - Get all timeline events
router.get('/', getAllTimelineEvents);

// GET /api/timeline/:id - Get timeline event by ID
router.get('/:id', getTimelineEventById);

// POST /api/timeline - Create new timeline event
router.post('/', createTimelineEvent);

// PUT /api/timeline/:id - Update timeline event
router.put('/:id', updateTimelineEvent);

// DELETE /api/timeline/:id - Delete timeline event
router.delete('/:id', deleteTimelineEvent);

export default router;
