import { Event } from '@prisma/client';
import { eventRepository } from '../repositories/event.repository';
import { geocodingService } from './geocoding.service';
import { logger } from '../utils/logger';

export interface CreateEventData {
  latitude: number;
  longitude: number;
  eventDate: Date;
  note: string;
  createdById: string;
}

export interface UpdateEventData {
  latitude?: number;
  longitude?: number;
  eventDate?: Date;
  note?: string;
  nearestCity?: string | null;
}

export class EventService {
  async getAllEvents(): Promise<Event[]> {
    return eventRepository.findAll();
  }

  async getEventById(id: string): Promise<Event | null> {
    return eventRepository.findById(id);
  }

  async createEvent(data: CreateEventData): Promise<Event> {
    // Auto-detect nearest city from coordinates
    let nearestCity: string | null = null;
    try {
      const geocodeResult = await geocodingService.reverseGeocode(data.latitude, data.longitude);
      if (geocodeResult) {
        nearestCity = geocodeResult.city;
      }
    } catch (error) {
      logger.warn('Failed to geocode event location:', error);
      // Continue without city name
    }

    const event = await eventRepository.create({
      ...data,
      nearestCity,
    });

    return event;
  }

  async updateEvent(id: string, data: UpdateEventData): Promise<Event> {
    // If coordinates changed, update nearest city
    let updateData = { ...data };

    if (data.latitude !== undefined && data.longitude !== undefined) {
      try {
        const geocodeResult = await geocodingService.reverseGeocode(data.latitude, data.longitude);
        if (geocodeResult) {
          updateData.nearestCity = geocodeResult.city;
        }
      } catch (error) {
        logger.warn('Failed to geocode updated location:', error);
      }
    }

    const event = await eventRepository.update(id, updateData);
    return event;
  }

  async deleteEvent(id: string): Promise<Event> {
    return eventRepository.delete(id);
  }

  async getEventsByUserId(userId: string): Promise<Event[]> {
    return eventRepository.findByUserId(userId);
  }

  async getEventsByDateRange(startDate: Date, endDate: Date): Promise<Event[]> {
    return eventRepository.findByDateRange(startDate, endDate);
  }
}

export const eventService = new EventService();
