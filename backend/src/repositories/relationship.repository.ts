import { RelationshipConfig } from '@prisma/client';
import { prisma } from '../config/database';

export class RelationshipRepository {
  async get(): Promise<RelationshipConfig | null> {
    return prisma.relationshipConfig.findFirst();
  }

  async upsert(startDate: Date): Promise<RelationshipConfig> {
    const existing = await this.get();
    if (existing) {
      return prisma.relationshipConfig.update({
        where: { id: existing.id },
        data: { startDate },
      });
    }
    return prisma.relationshipConfig.create({
      data: { startDate },
    });
  }
}

export const relationshipRepository = new RelationshipRepository();
