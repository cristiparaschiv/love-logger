import { WishlistItem } from '@prisma/client';
import { wishlistRepository } from '../repositories/wishlist.repository';
import { logger } from '../utils/logger';

export interface CreateWishlistItemData {
  title: string;
  description?: string;
  createdById: string;
}

export interface UpdateWishlistItemData {
  title?: string;
  description?: string | null;
  completed?: boolean;
}

export class WishlistService {
  async getAllItems(): Promise<WishlistItem[]> {
    return wishlistRepository.findAll();
  }

  async getItemById(id: string): Promise<WishlistItem | null> {
    return wishlistRepository.findById(id);
  }

  async createItem(data: CreateWishlistItemData): Promise<WishlistItem> {
    const item = await wishlistRepository.create({
      title: data.title,
      description: data.description,
      createdBy: { connect: { id: data.createdById } },
    });
    logger.info(`Wishlist item created: ${item.id}`);
    return item;
  }

  async updateItem(id: string, data: UpdateWishlistItemData): Promise<WishlistItem> {
    const existing = await wishlistRepository.findById(id);
    if (!existing) throw new Error('Wishlist item not found');

    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.completed !== undefined) {
      updateData.completed = data.completed;
      updateData.completedAt = data.completed ? new Date() : null;
    }

    const item = await wishlistRepository.update(id, updateData);
    logger.info(`Wishlist item updated: ${item.id}`);
    return item;
  }

  async deleteItem(id: string): Promise<WishlistItem> {
    const existing = await wishlistRepository.findById(id);
    if (!existing) throw new Error('Wishlist item not found');
    const deleted = await wishlistRepository.delete(id);
    logger.info(`Wishlist item deleted: ${id}`);
    return deleted;
  }
}

export const wishlistService = new WishlistService();
