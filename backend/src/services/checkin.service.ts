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

  async getStats(userId: string, days: number = 30) {
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

    // Build daily array (oldest first)
    const daily = dates.reverse().map((date) => {
      const entries = byDate.get(date);
      const my = entries?.find((e) => e.userId === userId);
      const partner = entries?.find((e) => e.userId !== userId);
      return {
        date,
        myMood: my?.mood ?? null,
        partnerMood: partner?.mood ?? null,
      };
    });

    // Streak: consecutive days user checked in counting back from today
    let streak = 0;
    for (let i = daily.length - 1; i >= 0; i--) {
      if (daily[i].myMood !== null) streak++;
      else break;
    }

    // Average moods
    const myMoods = daily.filter((d) => d.myMood !== null).map((d) => d.myMood!);
    const partnerMoods = daily.filter((d) => d.partnerMood !== null).map((d) => d.partnerMood!);
    const avg = (arr: number[]) => arr.length ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10 : 0;

    // Mood match: days both checked in with same mood
    const bothDays = daily.filter((d) => d.myMood !== null && d.partnerMood !== null);
    const matchDays = bothDays.filter((d) => d.myMood === d.partnerMood);
    const moodMatchPercent = bothDays.length ? Math.round((matchDays.length / bothDays.length) * 100) : 0;

    // Perfect days: both rated 4+
    const perfectDays = bothDays.filter((d) => d.myMood! >= 4 && d.partnerMood! >= 4).length;

    // Distribution
    const dist = (moods: number[]) => {
      const counts: Record<string, number> = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
      for (const m of moods) counts[String(m)]++;
      return counts;
    };

    // Insights
    const insights: string[] = [];
    if (streak >= 3) insights.push(`🔥 You're on a ${streak}-day check-in streak!`);
    if (perfectDays > 0) insights.push(`✨ ${perfectDays} perfect day${perfectDays > 1 ? 's' : ''} where you both felt great!`);
    if (moodMatchPercent >= 50 && bothDays.length >= 3) insights.push(`💞 You and your partner matched moods ${moodMatchPercent}% of the time`);

    // Best day of week
    const dayScores: Record<number, { total: number; count: number }> = {};
    for (const d of daily) {
      if (d.myMood === null) continue;
      const dow = new Date(d.date + 'T00:00:00').getDay();
      if (!dayScores[dow]) dayScores[dow] = { total: 0, count: 0 };
      dayScores[dow].total += d.myMood;
      dayScores[dow].count++;
    }
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let bestDay = -1, bestAvg = 0;
    for (const [dow, s] of Object.entries(dayScores)) {
      if (s.count >= 2) {
        const a = s.total / s.count;
        if (a > bestAvg) { bestAvg = a; bestDay = Number(dow); }
      }
    }
    if (bestDay >= 0) insights.push(`📅 ${dayNames[bestDay]}s tend to be your best days`);

    // Trend direction
    if (myMoods.length >= 5) {
      const recent = myMoods.slice(-Math.ceil(myMoods.length / 2));
      const older = myMoods.slice(0, Math.ceil(myMoods.length / 2));
      const recentAvg = avg(recent);
      const olderAvg = avg(older);
      if (recentAvg > olderAvg + 0.3) insights.push('📈 Your mood has been trending up recently!');
      else if (recentAvg < olderAvg - 0.3) insights.push('📉 Your mood has been a bit lower lately — hang in there!');
    }

    return {
      daily,
      streak,
      avgMood: { my: avg(myMoods), partner: avg(partnerMoods) },
      moodMatchPercent,
      perfectDays,
      distribution: { my: dist(myMoods), partner: dist(partnerMoods) },
      insights,
    };
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
