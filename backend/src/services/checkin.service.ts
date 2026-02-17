import { checkinRepository } from '../repositories/checkin.repository';
import { logger } from '../utils/logger';

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
}

export class CheckinService {
  async getTodayStatus(userId: string) {
    const date = getTodayDate();
    const question = await checkinRepository.getQuestionForDate(date);
    if (!question) throw new Error('No questions available');

    const allCheckins = await checkinRepository.getByDate(date);
    const myCheckin = allCheckins.find((c) => c.userId === userId);
    const partnerCheckins = allCheckins.filter((c) => c.userId !== userId);
    const partnerCheckin = partnerCheckins[0] || null;
    const bothCompleted = !!myCheckin && !!partnerCheckin;

    return {
      question: {
        id: question.id,
        text: question.text,
        type: question.type,
        options: question.options ? JSON.parse(question.options) : null,
      },
      myCheckin: myCheckin
        ? { mood: myCheckin.mood, answer: myCheckin.answer }
        : null,
      partnerCheckin: bothCompleted && partnerCheckin
        ? { mood: partnerCheckin.mood, answer: partnerCheckin.answer }
        : null,
      partnerCompleted: !!partnerCheckin,
      bothCompleted,
    };
  }

  async submitCheckin(userId: string, mood: number, answer: string) {
    const date = getTodayDate();
    const question = await checkinRepository.getQuestionForDate(date);
    if (!question) throw new Error('No questions available');

    const existing = await checkinRepository.getByUserAndDate(userId, date);
    if (existing) throw new Error('Already checked in today');

    const checkin = await checkinRepository.create({
      userId,
      date,
      mood,
      questionId: question.id,
      answer,
    });

    logger.info(`User ${userId} submitted daily checkin for ${date}`);
    return checkin;
  }

  async getHistory(days: number = 30) {
    const dates: string[] = [];
    const now = new Date();
    for (let i = 0; i < days; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }

    const checkins = await checkinRepository.getHistoryForDateRange(dates);

    // Group by date
    const byDate = new Map<string, typeof checkins>();
    for (const c of checkins) {
      const arr = byDate.get(c.date) || [];
      arr.push(c);
      byDate.set(c.date, arr);
    }

    return dates
      .filter((date) => byDate.has(date))
      .map((date) => {
        const entries = byDate.get(date)!;
        return {
          date,
          question: { text: entries[0].question.text, type: entries[0].question.type },
          checkins: entries.map((e) => ({
            userId: e.userId,
            displayName: e.user.displayName || e.user.username,
            mood: e.mood,
            answer: e.answer,
          })),
        };
      });
  }

  async getConfig() {
    const config = await checkinRepository.getConfig();
    return { notificationHour: config?.notificationHour ?? 20 };
  }

  async setNotificationHour(hour: number) {
    const config = await checkinRepository.upsertConfig(hour);
    return { notificationHour: config.notificationHour };
  }
}

export const checkinService = new CheckinService();
