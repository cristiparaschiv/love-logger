import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export const eventSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  eventDate: z.string().datetime().or(z.date()),
  note: z.string().min(1, 'Note is required').max(1000, 'Note must be less than 1000 characters'),
  nearestCity: z.string().optional().nullable(),
});

export const eventUpdateSchema = z.object({
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  eventDate: z.string().datetime().or(z.date()).optional(),
  note: z
    .string()
    .min(1, 'Note is required')
    .max(1000, 'Note must be less than 1000 characters')
    .optional(),
  nearestCity: z.string().optional().nullable(),
});

export const vacationSchema = z.object({
  location: z.string().min(1, 'Location is required').max(200),
  startDate: z.string().datetime().or(z.date()),
  durationDays: z.number().int().min(1).max(365),
});

export const vacationUpdateSchema = z.object({
  location: z.string().min(1).max(200).optional(),
  startDate: z.string().datetime().or(z.date()).optional(),
  durationDays: z.number().int().min(1).max(365).optional(),
});

export const timelineEventSchema = z.object({
  eventDate: z.string().datetime().or(z.date()),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters'),
});

export const timelineEventUpdateSchema = z.object({
  eventDate: z.string().datetime().or(z.date()).optional(),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters')
    .optional(),
});

export const scoreIncrementSchema = z.object({
  user: z.enum(['he', 'she']),
});

export const wishlistItemSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(500).optional().nullable(),
});

export const wishlistItemUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(500).optional().nullable(),
  completed: z.boolean().optional(),
});

export const relationshipConfigSchema = z.object({
  startDate: z.string().datetime().or(z.date()),
});

export const updateProfileSchema = z.object({
  displayName: z.string().min(1, 'Display name is required').max(50, 'Display name must be less than 50 characters'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(4, 'New password must be at least 4 characters').max(100),
});

export const pushSubscribeSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string(),
  }),
});

export const pushUnsubscribeSchema = z.object({
  endpoint: z.string().url(),
});

export const checkinSubmitSchema = z.object({
  mood: z.number().int().min(1).max(5),
  answer: z.string().min(1, 'Answer is required').max(500, 'Answer must be less than 500 characters'),
});

export const checkinConfigSchema = z.object({
  notificationHour: z.number().int().min(0).max(23),
});
