import { WishlistItem, Prisma } from '@prisma/client';
import { prisma } from '../config/database';

export class WishlistRepository {
  async findAll(): Promise<WishlistItem[]> {
    return prisma.wishlistItem.findMany({
      orderBy: [
        { completed: 'asc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async findById(id: string): Promise<WishlistItem | null> {
    return prisma.wishlistItem.findUnique({ where: { id } });
  }

  async create(data: Prisma.WishlistItemCreateInput): Promise<WishlistItem> {
    return prisma.wishlistItem.create({ data });
  }

  async update(id: string, data: Prisma.WishlistItemUpdateInput): Promise<WishlistItem> {
    return prisma.wishlistItem.update({ where: { id }, data });
  }

  async delete(id: string): Promise<WishlistItem> {
    return prisma.wishlistItem.delete({ where: { id } });
  }
}

export const wishlistRepository = new WishlistRepository();
