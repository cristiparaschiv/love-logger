import { apiService } from './api.service';
import { MemoryItem, MemoriesResponse } from '../types/memories.types';

class MemoriesService {
  async getOnThisDay(): Promise<MemoryItem[]> {
    const response = await apiService.get<MemoriesResponse>('/memories/on-this-day');
    return response.memories;
  }
}

export const memoriesService = new MemoriesService();
