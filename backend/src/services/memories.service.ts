import { prisma } from '../config/database';
import { logger } from '../utils/logger';

export interface MemoryItem {
  id: string;
  type: 'event' | 'timeline' | 'vacation';
  date: string;
  title: string;
  description: string | null;
  yearsAgo: number;
}

export class MemoriesService {
  async getOnThisDay(): Promise<MemoryItem[]> {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const currentYear = now.getFullYear();
    const monthDay = `${month}-${day}`;

    const [events, timelineEvents, vacations] = await Promise.all([
      prisma.$queryRaw<Array<{ id: string; event_date: string; note: string }>>`
        SELECT id, event_date, note FROM events
        WHERE strftime('%m-%d', event_date) = ${monthDay}
        AND strftime('%Y', event_date) != ${String(currentYear)}
      `,
      prisma.$queryRaw<Array<{ id: string; event_date: string; description: string }>>`
        SELECT id, event_date, description FROM timeline_events
        WHERE strftime('%m-%d', event_date) = ${monthDay}
        AND strftime('%Y', event_date) != ${String(currentYear)}
      `,
      prisma.$queryRaw<Array<{ id: string; start_date: string; location: string }>>`
        SELECT id, start_date, location FROM vacations
        WHERE strftime('%m-%d', start_date) = ${monthDay}
        AND strftime('%Y', start_date) != ${String(currentYear)}
      `,
    ]);

    const memories: MemoryItem[] = [
      ...events.map((e) => ({
        id: e.id,
        type: 'event' as const,
        date: e.event_date,
        title: e.note,
        description: null,
        yearsAgo: currentYear - new Date(e.event_date).getFullYear(),
      })),
      ...timelineEvents.map((e) => ({
        id: e.id,
        type: 'timeline' as const,
        date: e.event_date,
        title: e.description,
        description: null,
        yearsAgo: currentYear - new Date(e.event_date).getFullYear(),
      })),
      ...vacations.map((v) => ({
        id: v.id,
        type: 'vacation' as const,
        date: v.start_date,
        title: v.location,
        description: null,
        yearsAgo: currentYear - new Date(v.start_date).getFullYear(),
      })),
    ];

    memories.sort((a, b) => b.yearsAgo - a.yearsAgo);

    logger.info(`On This Day: found ${memories.length} memories for ${monthDay}`);
    return memories;
  }
}

export const memoriesService = new MemoriesService();
