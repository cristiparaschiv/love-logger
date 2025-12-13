import { prisma } from '../config/database';
import { Event } from '@prisma/client';

export class EventRepository {
  async findAll(): Promise<Event[]> {
    return prisma.event.findMany({
      orderBy: {
        eventDate: 'desc',
      },
    });
  }

  async findById(id: string): Promise<Event | null> {
    return prisma.event.findUnique({
      where: { id },
    });
  }

  async create(data: {
    latitude: number;
    longitude: number;
    eventDate: Date;
    note: string;
    nearestCity?: string | null;
    createdById: string;
  }): Promise<Event> {
    return prisma.event.create({
      data,
    });
  }

  async update(
    id: string,
    data: {
      latitude?: number;
      longitude?: number;
      eventDate?: Date;
      note?: string;
      nearestCity?: string | null;
    }
  ): Promise<Event> {
    return prisma.event.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Event> {
    return prisma.event.delete({
      where: { id },
    });
  }

  async findByUserId(userId: string): Promise<Event[]> {
    return prisma.event.findMany({
      where: {
        createdById: userId,
      },
      orderBy: {
        eventDate: 'desc',
      },
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Event[]> {
    return prisma.event.findMany({
      where: {
        eventDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        eventDate: 'desc',
      },
    });
  }
}

export const eventRepository = new EventRepository();
