import { apiService } from './api.service';
import { RelationshipConfig, RelationshipConfigResponse } from '../types/relationship.types';

class RelationshipService {
  private readonly BASE_PATH = '/relationship';

  async getConfig(): Promise<RelationshipConfig | null> {
    const response = await apiService.get<RelationshipConfigResponse>(this.BASE_PATH);
    return response.config;
  }

  async setStartDate(startDate: string): Promise<RelationshipConfig> {
    const response = await apiService.put<RelationshipConfigResponse>(this.BASE_PATH, { startDate });
    return response.config!;
  }
}

export const relationshipService = new RelationshipService();
