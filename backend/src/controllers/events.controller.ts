import { Request, Response } from 'express';
import { eventService } from '../services/event.service';
import { asyncHandler } from '../utils/asyncHandler';
import { eventSchema, eventUpdateSchema } from '../utils/validator';
import { logger } from '../utils/logger';
import { broadcastEventCreated, broadcastEventUpdated, broadcastEventDeleted } from '../websocket/socket.handler';

export const getAllEvents = asyncHandler(async (_req: Request, res: Response) => {
  const events = await eventService.getAllEvents();
  return res.status(200).json({ events });
});

export const getEventById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const event = await eventService.getEventById(id);

  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  return res.status(200).json({ event });
});

export const createEvent = asyncHandler(async (req: Request, res: Response) => {
  // Validate request body
  const validatedData = eventSchema.parse(req.body);

  // Get user ID from session
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Create event
  const event = await eventService.createEvent({
    latitude: validatedData.latitude,
    longitude: validatedData.longitude,
    eventDate: new Date(validatedData.eventDate),
    note: validatedData.note,
    createdById: userId,
  });

  logger.info(`Event created: ${event.id} by user ${userId}`);

  // Broadcast to all connected clients
  broadcastEventCreated(event);

  return res.status(201).json({ event });
});

export const updateEvent = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Check if event exists
  const existingEvent = await eventService.getEventById(id);
  if (!existingEvent) {
    return res.status(404).json({ message: 'Event not found' });
  }

  // Validate request body
  const validatedData = eventUpdateSchema.parse(req.body);

  // Update event
  const updateData: any = {};
  if (validatedData.latitude !== undefined) updateData.latitude = validatedData.latitude;
  if (validatedData.longitude !== undefined) updateData.longitude = validatedData.longitude;
  if (validatedData.eventDate !== undefined) updateData.eventDate = new Date(validatedData.eventDate);
  if (validatedData.note !== undefined) updateData.note = validatedData.note;
  if (validatedData.nearestCity !== undefined) updateData.nearestCity = validatedData.nearestCity;

  const event = await eventService.updateEvent(id, updateData);

  logger.info(`Event updated: ${event.id}`);

  // Broadcast to all connected clients
  broadcastEventUpdated(event);

  return res.status(200).json({ event });
});

export const deleteEvent = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Check if event exists
  const existingEvent = await eventService.getEventById(id);
  if (!existingEvent) {
    return res.status(404).json({ message: 'Event not found' });
  }

  // Delete event
  await eventService.deleteEvent(id);

  logger.info(`Event deleted: ${id}`);

  // Broadcast to all connected clients
  broadcastEventDeleted(id);

  return res.status(204).send();
});
