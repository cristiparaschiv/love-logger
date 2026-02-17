import { Request, Response } from 'express';
import { scoreService } from '../services/score.service';
import { asyncHandler } from '../utils/asyncHandler';
import { logger } from '../utils/logger';
import { broadcastScoreUpdated } from '../websocket/socket.handler';
import { notificationService } from '../services/notification.service';
import { prisma } from '../config/database';

/**
 * GET /api/score
 * Get the current score
 */
export const getScore = asyncHandler(async (_req: Request, res: Response) => {
  const score = await scoreService.getScore();
  return res.status(200).json({ score });
});

/**
 * POST /api/score/increment
 * Increment score for the logged-in user
 */
export const incrementScore = asyncHandler(async (req: Request, res: Response) => {
  // Get username from session
  const username = req.user?.username as 'he' | 'she' | undefined;

  if (!username) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Validate username
  if (username !== 'he' && username !== 'she') {
    return res.status(400).json({ message: 'Invalid user type' });
  }

  // Increment score for this user
  const score = await scoreService.incrementScore(username);

  logger.info(`Score incremented by ${username}: He ${score.heScore} - She ${score.sheScore}`);

  // Broadcast to all connected clients
  broadcastScoreUpdated(score);

  // Send push notification to partner
  const actor = await prisma.user.findUnique({ where: { id: req.user!.id }, select: { displayName: true, username: true } });
  const name = actor?.displayName || actor?.username || 'Your partner';
  notificationService.sendToOthers(req.user!.id, {
    title: 'Score Updated',
    body: `${name} scored a point!`,
    url: '/score',
  }).catch(() => {});

  return res.status(200).json({ score });
});

/**
 * POST /api/score/reset
 * Reset scores to 0-0 (optional endpoint for testing/admin)
 */
export const resetScore = asyncHandler(async (_req: Request, res: Response) => {
  const score = await scoreService.resetScore();

  logger.info('Score reset to 0-0');

  // Broadcast to all connected clients
  broadcastScoreUpdated(score);

  return res.status(200).json({ score });
});
