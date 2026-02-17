import { Request, Response } from 'express';
import { wishlistService } from '../services/wishlist.service';
import { asyncHandler } from '../utils/asyncHandler';
import { wishlistItemSchema, wishlistItemUpdateSchema } from '../utils/validator';
import { broadcastWishlistCreated, broadcastWishlistUpdated, broadcastWishlistDeleted } from '../websocket/socket.handler';

export const getAllWishlistItems = asyncHandler(async (_req: Request, res: Response) => {
  const items = await wishlistService.getAllItems();
  return res.status(200).json({ items });
});

export const createWishlistItem = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const validatedData = wishlistItemSchema.parse(req.body);

  const item = await wishlistService.createItem({
    title: validatedData.title,
    description: validatedData.description ?? undefined,
    createdById: userId,
  });

  broadcastWishlistCreated(item);

  return res.status(201).json({ item });
});

export const updateWishlistItem = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const validatedData = wishlistItemUpdateSchema.parse(req.body);

  const item = await wishlistService.updateItem(id, validatedData);

  broadcastWishlistUpdated(item);

  return res.status(200).json({ item });
});

export const deleteWishlistItem = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  await wishlistService.deleteItem(id);

  broadcastWishlistDeleted(id);

  return res.status(204).send();
});
