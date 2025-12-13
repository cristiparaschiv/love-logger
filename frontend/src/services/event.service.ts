import { apiService } from './api.service';
import {
  Event,
  CreateEventRequest,
  UpdateEventRequest,
  EventsResponse,
  EventResponse,
  ReverseGeocodeResult,
  SearchResultsResponse,
} from '../types/event.types';

class EventService {
  async getAllEvents(): Promise<Event[]> {
    const response = await apiService.get<EventsResponse>('/events');
    return response.events;
  }

  async getEventById(id: string): Promise<Event> {
    const response = await apiService.get<EventResponse>(`/events/${id}`);
    return response.event;
  }

  async createEvent(data: CreateEventRequest): Promise<Event> {
    const response = await apiService.post<EventResponse>('/events', data);
    return response.event;
  }

  async updateEvent(id: string, data: UpdateEventRequest): Promise<Event> {
    const response = await apiService.put<EventResponse>(`/events/${id}`, data);
    return response.event;
  }

  async deleteEvent(id: string): Promise<void> {
    await apiService.delete(`/events/${id}`);
  }

  async reverseGeocode(lat: number, lon: number): Promise<ReverseGeocodeResult> {
    return apiService.get<ReverseGeocodeResult>(`/geocode/reverse?lat=${lat}&lon=${lon}`);
  }

  async searchLocations(query: string, limit: number = 5): Promise<SearchResultsResponse> {
    return apiService.get<SearchResultsResponse>(`/geocode/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  }
}

export const eventService = new EventService();
