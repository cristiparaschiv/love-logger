import { Request, Response } from 'express';
import { notificationService } from '../services/notification.service';
import { asyncHandler } from '../utils/asyncHandler';
import { pushSubscribeSchema, pushUnsubscribeSchema } from '../utils/validator';
import { getVapidPublicKey } from '../config/vapid';

export const getVapidKey = asyncHandler(async (_req: Request, res: Response) => {
  return res.status(200).json({ publicKey: getVapidPublicKey() });
});

export const subscribe = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const validatedData = pushSubscribeSchema.parse(req.body);

  await notificationService.subscribe({
    userId,
    endpoint: validatedData.endpoint,
    p256dh: validatedData.keys.p256dh,
    auth: validatedData.keys.auth,
  });

  return res.status(200).json({ message: 'Subscribed' });
});

export const unsubscribe = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = pushUnsubscribeSchema.parse(req.body);
  await notificationService.unsubscribe(validatedData.endpoint);
  return res.status(200).json({ message: 'Unsubscribed' });
});
