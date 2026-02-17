import { RelationshipConfig } from '@prisma/client';
import { relationshipRepository } from '../repositories/relationship.repository';
import { logger } from '../utils/logger';

export class RelationshipService {
  async getConfig(): Promise<RelationshipConfig | null> {
    return relationshipRepository.get();
  }

  async setStartDate(startDate: Date): Promise<RelationshipConfig> {
    const config = await relationshipRepository.upsert(startDate);
    logger.info(`Relationship start date set to: ${startDate.toISOString()}`);
    return config;
  }
}

export const relationshipService = new RelationshipService();
