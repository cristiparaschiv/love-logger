import { TimelineEvent } from '@prisma/client';
import { timelineRepository } from '../repositories/timeline.repository';
import { logger } from '../utils/logger';

export interface CreateTimelineEventData {
  eventDate: Date;
  description: string;
  createdById: string;
}

export interface UpdateTimelineEventData {
  eventDate?: Date;
  description?: string;
}

export class TimelineService {
  async getAllEvents(): Promise<TimelineEvent[]> {
    return timelineRepository.findAll();
  }

  async getEventById(id: string): Promise<TimelineEvent | null> {
    return timelineRepository.findById(id);
  }

  async getEventsByUserId(userId: string): Promise<TimelineEvent[]> {
    return timelineRepository.findByUserId(userId);
  }

  async createEvent(data: CreateTimelineEventData): Promise<TimelineEvent> {
    const event = await timelineRepository.create({
      eventDate: data.eventDate,
      description: data.description,
      createdBy: {
        connect: { id: data.createdById },
      },
    });

    logger.info(`Timeline event created: ${event.id}`);
    return event;
  }

  async updateEvent(id: string, data: UpdateTimelineEventData): Promise<TimelineEvent> {
    const existingEvent = await timelineRepository.findById(id);
    if (!existingEvent) {
      throw new Error('Timeline event not found');
    }

    const event = await timelineRepository.update(id, {
      ...(data.eventDate !== undefined && { eventDate: data.eventDate }),
      ...(data.description !== undefined && { description: data.description }),
    });

    logger.info(`Timeline event updated: ${event.id}`);
    return event;
  }

  async deleteEvent(id: string): Promise<TimelineEvent> {
    const event = await timelineRepository.findById(id);
    if (!event) {
      throw new Error('Timeline event not found');
    }

    const deleted = await timelineRepository.delete(id);
    logger.info(`Timeline event deleted: ${id}`);
    return deleted;
  }

  async getEventsCount(): Promise<number> {
    return timelineRepository.count();
  }
}

export const timelineService = new TimelineService();
