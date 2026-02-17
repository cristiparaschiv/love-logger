import { Request, Response } from 'express';
import { relationshipService } from '../services/relationship.service';
import { asyncHandler } from '../utils/asyncHandler';
import { relationshipConfigSchema } from '../utils/validator';
import { broadcastRelationshipUpdated } from '../websocket/socket.handler';

export const getRelationshipConfig = asyncHandler(async (_req: Request, res: Response) => {
  const config = await relationshipService.getConfig();
  return res.status(200).json({ config });
});

export const setRelationshipStartDate = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = relationshipConfigSchema.parse(req.body);
  const config = await relationshipService.setStartDate(new Date(validatedData.startDate));

  broadcastRelationshipUpdated(config);

  return res.status(200).json({ config });
});
