import { apiService } from './api.service';
import { Score, ScoreResponse } from '../types/score.types';

class ScoreService {
  /**
   * Get current score
   */
  async getScore(): Promise<Score> {
    const response = await apiService.get<ScoreResponse>('/score');
    return response.score;
  }

  /**
   * Increment score for the logged-in user
   */
  async incrementScore(): Promise<Score> {
    const response = await apiService.post<ScoreResponse>('/score/increment', {});
    return response.score;
  }

  /**
   * Reset score to 0-0 (for testing)
   */
  async resetScore(): Promise<Score> {
    const response = await apiService.post<ScoreResponse>('/score/reset', {});
    return response.score;
  }
}

export const scoreService = new ScoreService();
