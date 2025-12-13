import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { asyncHandler } from '../utils/asyncHandler';

export const validateBody = (schema: ZodSchema) => {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    req.body = schema.parse(req.body);
    next();
  });
};

export const validateQuery = (schema: ZodSchema) => {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    req.query = schema.parse(req.query);
    next();
  });
};

export const validateParams = (schema: ZodSchema) => {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    req.params = schema.parse(req.params);
    next();
  });
};
