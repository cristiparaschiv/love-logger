import { Score } from '@prisma/client';
import { scoreRepository } from '../repositories/score.repository';
import { logger } from '../utils/logger';

export type UserType = 'he' | 'she';

export class ScoreService {
  /**
   * Get the current score
   * Creates initial score if none exists
   */
  async getScore(): Promise<Score> {
    const score = await scoreRepository.getScore();
    logger.info(`Score fetched: He ${score.heScore} - She ${score.sheScore}`);
    return score;
  }

  /**
   * Increment score for a specific user
   * @param username - 'he' or 'she'
   */
  async incrementScore(username: UserType): Promise<Score> {
    let score: Score;

    if (username === 'he') {
      score = await scoreRepository.incrementHeScore();
      logger.info(`He scored! New score: He ${score.heScore} - She ${score.sheScore}`);
    } else if (username === 'she') {
      score = await scoreRepository.incrementSheScore();
      logger.info(`She scored! New score: He ${score.heScore} - She ${score.sheScore}`);
    } else {
      throw new Error('Invalid username. Must be "he" or "she"');
    }

    return score;
  }

  /**
   * Reset scores to 0-0
   */
  async resetScore(): Promise<Score> {
    const score = await scoreRepository.resetScore();
    logger.info('Score reset to 0-0');
    return score;
  }

  /**
   * Initialize score if it doesn't exist
   */
  async initializeScore(): Promise<Score> {
    const score = await scoreRepository.getScore();
    logger.info('Score initialized');
    return score;
  }
}

export const scoreService = new ScoreService();
