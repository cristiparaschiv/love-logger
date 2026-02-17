import { Request, Response } from 'express';
import { memoriesService } from '../services/memories.service';
import { asyncHandler } from '../utils/asyncHandler';

export const getOnThisDay = asyncHandler(async (_req: Request, res: Response) => {
  const memories = await memoriesService.getOnThisDay();
  return res.status(200).json({ memories });
});
