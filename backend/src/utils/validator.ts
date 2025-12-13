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
