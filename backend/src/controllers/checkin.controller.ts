import { Request, Response } from 'express';
import { checkinService } from '../services/checkin.service';
import { asyncHandler } from '../utils/asyncHandler';
import { checkinSubmitSchema, checkinConfigSchema } from '../utils/validator';
import { broadcastCheckinSubmitted } from '../websocket/socket.handler';
import { notificationService } from '../services/notification.service';

export const getToday = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const data = await checkinService.getTodayStatus(userId);
  return res.status(200).json(data);
});

export const submit = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const { mood, answer } = checkinSubmitSchema.parse(req.body);

  const checkin = await checkinService.submitCheckin(userId, mood, answer);

  broadcastCheckinSubmitted({ userId, date: checkin.date });

  await notificationService.sendToOthers(userId, {
    title: 'Partner Checked In',
    body: 'Your partner has completed their daily check-in! Complete yours to see their answers.',
    url: '/checkin',
  });

  // Return updated today status
  const data = await checkinService.getTodayStatus(userId);
  return res.status(201).json(data);
});

export const getHistory = asyncHandler(async (req: Request, res: Response) => {
  const days = Math.min(parseInt(req.query.days as string) || 30, 365);
  const data = await checkinService.getHistory(days);
  return res.status(200).json({ entries: data });
});

export const getConfig = asyncHandler(async (_req: Request, res: Response) => {
  const config = await checkinService.getConfig();
  return res.status(200).json(config);
});

export const updateConfig = asyncHandler(async (req: Request, res: Response) => {
  const { notificationHour } = checkinConfigSchema.parse(req.body);
  const config = await checkinService.setNotificationHour(notificationHour);
  return res.status(200).json(config);
});
