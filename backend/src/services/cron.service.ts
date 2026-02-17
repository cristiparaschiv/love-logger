import cron from 'node-cron';
import { prisma } from '../config/database';
import { notificationService } from './notification.service';
import { checkinRepository } from '../repositories/checkin.repository';
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

  // Hourly — check-in reminder notifications
  cron.schedule('0 * * * *', async () => {
    try {
      const config = await checkinRepository.getConfig();
      const notificationHour = config?.notificationHour ?? 20;
      const currentHour = new Date().getHours();

      if (currentHour !== notificationHour) return;

      const today = new Date().toISOString().split('T')[0];
      const missingUserIds = await checkinRepository.getUsersWithoutCheckin(today);

      if (missingUserIds.length > 0) {
        await notificationService.sendToUsers(missingUserIds, {
          title: 'Evening Check-in',
          body: "How was your day? Share your mood and answer today's question!",
          url: '/checkin',
        });
        logger.info(`Checkin reminder sent to ${missingUserIds.length} users`);
      }
    } catch (error) {
      logger.error('Checkin reminder cron failed:', error);
    }
  });

  logger.info('Cron jobs started');
}
