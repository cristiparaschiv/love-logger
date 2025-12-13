import { Score, Prisma } from '@prisma/client';
import { prisma } from '../config/database';

export class ScoreRepository {
  /**
   * Get the singleton score record
   * Creates one if it doesn't exist (0-0 score)
   */
  async getScore(): Promise<Score> {
    // Try to find existing score
    const score = await prisma.score.findFirst();

    if (score) {
      return score;
    }

    // Create initial score if none exists
    return this.createInitialScore();
  }

  /**
   * Create initial score record (0-0)
   */
  async createInitialScore(): Promise<Score> {
    return prisma.score.create({
      data: {
        heScore: 0,
        sheScore: 0,
      },
    });
  }

  /**
   * Increment he's score by 1
   */
  async incrementHeScore(): Promise<Score> {
    const score = await this.getScore();

    return prisma.score.update({
      where: { id: score.id },
      data: {
        heScore: {
          increment: 1,
        },
      },
    });
  }

  /**
   * Increment she's score by 1
   */
  async incrementSheScore(): Promise<Score> {
    const score = await this.getScore();

    return prisma.score.update({
      where: { id: score.id },
      data: {
        sheScore: {
          increment: 1,
        },
      },
    });
  }

  /**
   * Reset scores to 0-0
   */
  async resetScore(): Promise<Score> {
    const score = await this.getScore();

    return prisma.score.update({
      where: { id: score.id },
      data: {
        heScore: 0,
        sheScore: 0,
      },
    });
  }

  /**
   * Update score directly (for advanced operations)
   */
  async update(id: string, data: Prisma.ScoreUpdateInput): Promise<Score> {
    return prisma.score.update({
      where: { id },
      data,
    });
  }
}

export const scoreRepository = new ScoreRepository();
