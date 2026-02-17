import { Request, Response } from 'express';
import { timelineService } from '../services/timeline.service';
import { asyncHandler } from '../utils/asyncHandler';
import { timelineEventSchema, timelineEventUpdateSchema } from '../utils/validator';
import { logger } from '../utils/logger';
import {
  broadcastTimelineCreated,
  broadcastTimelineUpdated,
  broadcastTimelineDeleted,
} from '../websocket/socket.handler';
import { notificationService } from '../services/notification.service';
import { prisma } from '../config/database';

export const getAllTimelineEvents = asyncHandler(async (_req: Request, res: Response) => {
  const events = await timelineService.getAllEvents();
  return res.status(200).json({ events });
});

export const getTimelineEventById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const event = await timelineService.getEventById(id);

  if (!event) {
    return res.status(404).json({ message: 'Timeline event not found' });
  }

  return res.status(200).json({ event });
});

export const createTimelineEvent = asyncHandler(async (req: Request, res: Response) => {
  // Get user ID from session
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Validate request body
  const validatedData = timelineEventSchema.parse(req.body);

  // Create timeline event
  const event = await timelineService.createEvent({
    eventDate: new Date(validatedData.eventDate),
    description: validatedData.description,
    createdById: userId,
  });

  logger.info(`Timeline event created: ${event.id} by user ${userId}`);

  // Broadcast to all connected clients
  broadcastTimelineCreated(event);

  // Send push notification to partner
  const actor = await prisma.user.findUnique({ where: { id: userId }, select: { displayName: true, username: true } });
  const name = actor?.displayName || actor?.username || 'Your partner';
  notificationService.sendToOthers(userId, {
    title: 'New Timeline Event',
    body: `${name} added a new memory`,
    url: '/timeline',
  }).catch(() => {});

  return res.status(201).json({ event });
});

export const updateTimelineEvent = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Check if timeline event exists
  const existingEvent = await timelineService.getEventById(id);
  if (!existingEvent) {
    return res.status(404).json({ message: 'Timeline event not found' });
  }

  // Validate request body
  const validatedData = timelineEventUpdateSchema.parse(req.body);

  // Build update data
  const updateData: any = {};
  if (validatedData.eventDate !== undefined) {
    updateData.eventDate = new Date(validatedData.eventDate);
  }
  if (validatedData.description !== undefined) {
    updateData.description = validatedData.description;
  }

  // Update timeline event
  const event = await timelineService.updateEvent(id, updateData);

  logger.info(`Timeline event updated: ${event.id}`);

  // Broadcast to all connected clients
  broadcastTimelineUpdated(event);

  return res.status(200).json({ event });
});

export const deleteTimelineEvent = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Check if timeline event exists
  const existingEvent = await timelineService.getEventById(id);
  if (!existingEvent) {
    return res.status(404).json({ message: 'Timeline event not found' });
  }

  // Delete timeline event
  await timelineService.deleteEvent(id);

  logger.info(`Timeline event deleted: ${id}`);

  // Broadcast to all connected clients
  broadcastTimelineDeleted(id);

  return res.status(204).send();
});
