import { PushSubscription } from '@prisma/client';
import { prisma } from '../config/database';

export class PushSubscriptionRepository {
  async upsertByEndpoint(data: { userId: string; endpoint: string; p256dh: string; auth: string }): Promise<PushSubscription> {
    return prisma.pushSubscription.upsert({
      where: { endpoint: data.endpoint },
      update: { userId: data.userId, p256dh: data.p256dh, auth: data.auth },
      create: data,
    });
  }

  async findAll(): Promise<PushSubscription[]> {
    return prisma.pushSubscription.findMany();
  }

  async findExcludingUser(userId: string): Promise<PushSubscription[]> {
    return prisma.pushSubscription.findMany({ where: { userId: { not: userId } } });
  }

  async deleteByEndpoint(endpoint: string): Promise<void> {
    await prisma.pushSubscription.deleteMany({ where: { endpoint } });
  }
}

export const pushSubscriptionRepository = new PushSubscriptionRepository();
