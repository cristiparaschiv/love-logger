import { Request, Response } from 'express';
import { geocodingService } from '../services/geocoding.service';
import { asyncHandler } from '../utils/asyncHandler';
import { z } from 'zod';

const reverseGeocodeSchema = z.object({
  lat: z.string().transform((val) => parseFloat(val)),
  lon: z.string().transform((val) => parseFloat(val)),
});

const searchSchema = z.object({
  q: z.string().min(1, 'Query is required'),
  limit: z.string().optional().transform((val) => (val ? parseInt(val) : 5)),
});

export const reverseGeocode = asyncHandler(async (req: Request, res: Response) => {
  // Validate query parameters
  const { lat, lon } = reverseGeocodeSchema.parse(req.query);

  // Validate coordinates
  if (lat < -90 || lat > 90) {
    return res.status(400).json({ message: 'Latitude must be between -90 and 90' });
  }
  if (lon < -180 || lon > 180) {
    return res.status(400).json({ message: 'Longitude must be between -180 and 180' });
  }

  // Reverse geocode
  const result = await geocodingService.reverseGeocode(lat, lon);

  if (!result) {
    return res.status(404).json({ message: 'Location not found' });
  }

  return res.status(200).json(result);
});

export const search = asyncHandler(async (req: Request, res: Response) => {
  // Validate query parameters
  const { q, limit } = searchSchema.parse(req.query);

  // Search for locations
  const results = await geocodingService.search(q, limit);

  return res.status(200).json({ results });
});
