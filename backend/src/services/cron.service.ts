import cron from 'node-cron';
import { prisma } from '../config/database';
import { notificationService } from './notification.service';
import { logger } from '../utils/logger';

export function startCronJobs() {
  // Daily at 9AM — check for upcoming events
  cron.schedule('0 9 * * *', async () => {
    try {
      const now = new Date();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const monthDay = `${month}-${day}`;

      // Also check 7 days from now
      const future = new Date(now);
      future.setDate(future.getDate() + 7);
      const futureMonth = String(future.getMonth() + 1).padStart(2, '0');
      const futureDay = String(future.getDate()).padStart(2, '0');
      const futureMonthDay = `${futureMonth}-${futureDay}`;

      const [todayTimeline, todayVacations, upcomingTimeline, upcomingVacations] = await Promise.all([
        prisma.$queryRaw<Array<{ description: string }>>`
          SELECT description FROM timeline_events
          WHERE strftime('%m-%d', event_date) = ${monthDay}
          AND strftime('%Y', event_date) != ${String(now.getFullYear())}
        `,
        prisma.$queryRaw<Array<{ location: string }>>`
          SELECT location FROM vacations
          WHERE strftime('%m-%d', start_date) = ${monthDay}
          AND strftime('%Y', start_date) != ${String(now.getFullYear())}
        `,
        prisma.$queryRaw<Array<{ description: string }>>`
          SELECT description FROM timeline_events
          WHERE strftime('%m-%d', event_date) = ${futureMonthDay}
          AND strftime('%Y', event_date) != ${String(now.getFullYear())}
        `,
        prisma.$queryRaw<Array<{ location: string }>>`
          SELECT location FROM vacations
          WHERE strftime('%m-%d', start_date) = ${futureMonthDay}
          AND strftime('%Y', start_date) != ${String(now.getFullYear())}
        `,
      ]);

      const todayCount = todayTimeline.length + todayVacations.length;
      const upcomingCount = upcomingTimeline.length + upcomingVacations.length;

      if (todayCount > 0) {
        await notificationService.sendToAll({
          title: 'On This Day',
          body: `You have ${todayCount} ${todayCount === 1 ? 'memory' : 'memories'} from this day!`,
          url: '/timeline',
        });
      }

      if (upcomingCount > 0) {
        await notificationService.sendToAll({
          title: 'Coming Up in 7 Days',
          body: `${upcomingCount} ${upcomingCount === 1 ? 'anniversary' : 'anniversaries'} coming up next week!`,
          url: '/timeline',
        });
      }

      logger.info(`Cron: ${todayCount} today, ${upcomingCount} upcoming memories`);
    } catch (error) {
      logger.error('Cron job failed:', error);
    }
  });

  logger.info('Cron jobs started');
}
