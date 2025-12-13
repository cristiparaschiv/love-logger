import { Request, Response } from 'express';
import { vacationService } from '../services/vacation.service';
import { asyncHandler } from '../utils/asyncHandler';
import { vacationSchema, vacationUpdateSchema } from '../utils/validator';
import { logger } from '../utils/logger';
import {
  broadcastVacationCreated,
  broadcastVacationUpdated,
  broadcastVacationDeleted,
} from '../websocket/socket.handler';

export const getAllVacations = asyncHandler(async (_req: Request, res: Response) => {
  const vacations = await vacationService.getAllVacations();
  return res.status(200).json({ vacations });
});

export const getUpcomingVacations = asyncHandler(async (_req: Request, res: Response) => {
  const vacations = await vacationService.getUpcomingVacations();
  return res.status(200).json({ vacations });
});

export const getPastVacations = asyncHandler(async (_req: Request, res: Response) => {
  const vacations = await vacationService.getPastVacations();
  return res.status(200).json({ vacations });
});

export const getVacationById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const vacation = await vacationService.getVacationById(id);

  if (!vacation) {
    return res.status(404).json({ message: 'Vacation not found' });
  }

  return res.status(200).json({ vacation });
});

export const createVacation = asyncHandler(async (req: Request, res: Response) => {
  // Get user ID from session
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Parse and validate the text fields from multipart/form-data
  const bodyData = {
    location: req.body.location,
    startDate: req.body.startDate,
    durationDays: parseInt(req.body.durationDays, 10),
  };

  // Validate request body
  const validatedData = vacationSchema.parse(bodyData);

  // Get uploaded file if present
  const photoFile = req.file;

  // Create vacation
  const vacation = await vacationService.createVacation(
    {
      location: validatedData.location,
      startDate: new Date(validatedData.startDate),
      durationDays: validatedData.durationDays,
      createdById: userId,
    },
    photoFile
  );

  logger.info(`Vacation created: ${vacation.id} by user ${userId}`);

  // Broadcast to all connected clients
  broadcastVacationCreated(vacation);

  return res.status(201).json({ vacation });
});

export const updateVacation = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Check if vacation exists
  const existingVacation = await vacationService.getVacationById(id);
  if (!existingVacation) {
    return res.status(404).json({ message: 'Vacation not found' });
  }

  // Parse and validate the text fields from multipart/form-data
  const bodyData: any = {};
  if (req.body.location !== undefined) bodyData.location = req.body.location;
  if (req.body.startDate !== undefined) bodyData.startDate = req.body.startDate;
  if (req.body.durationDays !== undefined) bodyData.durationDays = parseInt(req.body.durationDays, 10);

  // Validate request body
  const validatedData = vacationUpdateSchema.parse(bodyData);

  // Build update data
  const updateData: any = {};
  if (validatedData.location !== undefined) updateData.location = validatedData.location;
  if (validatedData.startDate !== undefined) updateData.startDate = new Date(validatedData.startDate);
  if (validatedData.durationDays !== undefined) updateData.durationDays = validatedData.durationDays;

  // Get uploaded file if present
  const photoFile = req.file;

  // Update vacation
  const vacation = await vacationService.updateVacation(id, updateData, photoFile);

  logger.info(`Vacation updated: ${vacation.id}`);

  // Broadcast to all connected clients
  broadcastVacationUpdated(vacation);

  return res.status(200).json({ vacation });
});

export const deleteVacation = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Check if vacation exists
  const existingVacation = await vacationService.getVacationById(id);
  if (!existingVacation) {
    return res.status(404).json({ message: 'Vacation not found' });
  }

  // Delete vacation
  await vacationService.deleteVacation(id);

  logger.info(`Vacation deleted: ${id}`);

  // Broadcast to all connected clients
  broadcastVacationDeleted(id);

  return res.status(204).send();
});
