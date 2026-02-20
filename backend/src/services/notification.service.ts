import webpush from 'web-push';
import { pushSubscriptionRepository } from '../repositories/pushSubscription.repository';
import { logger } from '../utils/logger';

const pushOptions: webpush.RequestOptions = {
  urgency: 'high',
  TTL: 60 * 60 * 24, // 24 hours
};

export class NotificationService {
  async subscribe(data: { userId: string; endpoint: string; p256dh: string; auth: string }) {
    await pushSubscriptionRepository.upsertByEndpoint(data);
    logger.info(`Push subscription saved for user ${data.userId}`);
  }

  async unsubscribe(endpoint: string) {
    await pushSubscriptionRepository.deleteByEndpoint(endpoint);
    logger.info(`Push subscription removed: ${endpoint}`);
  }

  async sendToAll(payload: { title: string; body: string; url?: string }) {
    const subscriptions = await pushSubscriptionRepository.findAll();
    if (subscriptions.length === 0) return;

    const payloadStr = JSON.stringify(payload);

    const results = await Promise.allSettled(
      subscriptions.map((sub) =>
        webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          payloadStr,
          pushOptions
        )
      )
    );

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      if (result.status === 'rejected') {
        const statusCode = (result.reason as { statusCode?: number })?.statusCode;
        if (statusCode === 400 || statusCode === 404 || statusCode === 410) {
          await pushSubscriptionRepository.deleteByEndpoint(subscriptions[i].endpoint);
          logger.info(`Removed expired push subscription: ${subscriptions[i].endpoint}`);
        } else {
          logger.error(`Push notification failed for ${subscriptions[i].endpoint}:`, result.reason);
        }
      }
    }

    logger.info(`Push notifications sent to ${subscriptions.length} subscribers`);
  }

  async sendToUsers(userIds: string[], payload: { title: string; body: string; url?: string }) {
    const subscriptions = await pushSubscriptionRepository.findByUserIds(userIds);
    if (subscriptions.length === 0) return;

    const payloadStr = JSON.stringify(payload);

    const results = await Promise.allSettled(
      subscriptions.map((sub) =>
        webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payloadStr,
          pushOptions
        )
      )
    );

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      if (result.status === 'rejected') {
        const statusCode = (result.reason as { statusCode?: number })?.statusCode;
        if (statusCode === 400 || statusCode === 404 || statusCode === 410) {
          await pushSubscriptionRepository.deleteByEndpoint(subscriptions[i].endpoint);
        } else {
          logger.error(`Push notification failed for ${subscriptions[i].endpoint}:`, result.reason);
        }
      }
    }

    logger.info(`Push notifications sent to ${subscriptions.length} subscribers for ${userIds.length} users`);
  }

  async sendToOthers(excludeUserId: string, payload: { title: string; body: string; url?: string }) {
    const subscriptions = await pushSubscriptionRepository.findExcludingUser(excludeUserId);
    if (subscriptions.length === 0) return;

    const payloadStr = JSON.stringify(payload);

    const results = await Promise.allSettled(
      subscriptions.map((sub) =>
        webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payloadStr,
          pushOptions
        )
      )
    );

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      if (result.status === 'rejected') {
        const statusCode = (result.reason as { statusCode?: number })?.statusCode;
        if (statusCode === 400 || statusCode === 404 || statusCode === 410) {
          await pushSubscriptionRepository.deleteByEndpoint(subscriptions[i].endpoint);
        } else {
          logger.error(`Push notification failed for ${subscriptions[i].endpoint}:`, result.reason);
        }
      }
    }

    logger.info(`Push notifications sent to ${subscriptions.length} other subscribers (excluding ${excludeUserId})`);
  }
}

export const notificationService = new NotificationService();
