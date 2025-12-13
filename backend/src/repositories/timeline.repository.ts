import { TimelineEvent, Prisma } from '@prisma/client';
import { prisma } from '../config/database';

export class TimelineRepository {
  async findAll(): Promise<TimelineEvent[]> {
    return prisma.timelineEvent.findMany({
      orderBy: {
        eventDate: 'asc',
      },
    });
  }

  async findById(id: string): Promise<TimelineEvent | null> {
    return prisma.timelineEvent.findUnique({
      where: { id },
    });
  }

  async findByUserId(userId: string): Promise<TimelineEvent[]> {
    return prisma.timelineEvent.findMany({
      where: { createdById: userId },
      orderBy: {
        eventDate: 'asc',
      },
    });
  }

  async create(data: Prisma.TimelineEventCreateInput): Promise<TimelineEvent> {
    return prisma.timelineEvent.create({
      data,
    });
  }

  async update(id: string, data: Prisma.TimelineEventUpdateInput): Promise<TimelineEvent> {
    return prisma.timelineEvent.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<TimelineEvent> {
    return prisma.timelineEvent.delete({
      where: { id },
    });
  }

  async count(): Promise<number> {
    return prisma.timelineEvent.count();
  }
}

export const timelineRepository = new TimelineRepository();
