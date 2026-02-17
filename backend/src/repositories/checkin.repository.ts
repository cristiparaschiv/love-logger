import { DailyCheckin, DailyQuestion, CheckinConfig } from '@prisma/client';
import { prisma } from '../config/database';

export class CheckinRepository {
  async getByUserAndDate(userId: string, date: string): Promise<DailyCheckin | null> {
    return prisma.dailyCheckin.findUnique({
      where: { userId_date: { userId, date } },
    });
  }

  async create(data: { userId: string; date: string; mood: number; questionId: number; answer: string }): Promise<DailyCheckin> {
    return prisma.dailyCheckin.create({ data });
  }

  async getByDate(date: string): Promise<(DailyCheckin & { user: { id: string; username: string; displayName: string | null } })[]> {
    return prisma.dailyCheckin.findMany({
      where: { date },
      include: { user: { select: { id: true, username: true, displayName: true } } },
    });
  }

  async getHistory(userId: string, limit: number): Promise<(DailyCheckin & { question: DailyQuestion })[]> {
    return prisma.dailyCheckin.findMany({
      where: { userId },
      include: { question: true },
      orderBy: { date: 'desc' },
      take: limit,
    });
  }

  async getQuestionById(id: number): Promise<DailyQuestion | null> {
    return prisma.dailyQuestion.findUnique({ where: { id } });
  }

  async countQuestions(): Promise<number> {
    return prisma.dailyQuestion.count();
  }

  async getQuestionForDate(date: string): Promise<DailyQuestion | null> {
    const total = await this.countQuestions();
    if (total === 0) return null;

    // Deterministic: day of year % total questions
    const d = new Date(date);
    const start = new Date(d.getFullYear(), 0, 0);
    const diff = d.getTime() - start.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    const index = dayOfYear % total;

    // Questions are 1-indexed (autoincrement)
    const questions = await prisma.dailyQuestion.findMany({
      orderBy: { id: 'asc' },
      skip: index,
      take: 1,
    });

    return questions[0] || null;
  }

  async getUsersWithoutCheckin(date: string): Promise<string[]> {
    const allUsers = await prisma.user.findMany({ select: { id: true } });
    const checkedIn = await prisma.dailyCheckin.findMany({
      where: { date },
      select: { userId: true },
    });
    const checkedInIds = new Set(checkedIn.map((c) => c.userId));
    return allUsers.filter((u) => !checkedInIds.has(u.id)).map((u) => u.id);
  }

  async getConfig(): Promise<CheckinConfig | null> {
    const configs = await prisma.checkinConfig.findMany({ take: 1 });
    return configs[0] || null;
  }

  async upsertConfig(notificationHour: number): Promise<CheckinConfig> {
    const existing = await this.getConfig();
    if (existing) {
      return prisma.checkinConfig.update({
        where: { id: existing.id },
        data: { notificationHour },
      });
    }
    return prisma.checkinConfig.create({
      data: { notificationHour },
    });
  }

  async getHistoryForDateRange(dates: string[]): Promise<(DailyCheckin & { question: DailyQuestion; user: { id: string; username: string; displayName: string | null } })[]> {
    return prisma.dailyCheckin.findMany({
      where: { date: { in: dates } },
      include: {
        question: true,
        user: { select: { id: true, username: true, displayName: true } },
      },
      orderBy: { date: 'desc' },
    });
  }
}

export const checkinRepository = new CheckinRepository();
