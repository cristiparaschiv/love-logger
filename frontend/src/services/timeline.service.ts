import { apiService } from './api.service';
import {
  TimelineEvent,
  TimelineEventsResponse,
  TimelineEventResponse,
  CreateTimelineEventRequest,
  UpdateTimelineEventRequest,
} from '../types/timeline.types';

class TimelineService {
  private readonly BASE_PATH = '/timeline';

  async getAllEvents(): Promise<TimelineEvent[]> {
    const response = await apiService.get<TimelineEventsResponse>(this.BASE_PATH);
    return response.events;
  }

  async getEventById(id: string): Promise<TimelineEvent> {
    const response = await apiService.get<TimelineEventResponse>(`${this.BASE_PATH}/${id}`);
    return response.event;
  }

  async createEvent(data: CreateTimelineEventRequest): Promise<TimelineEvent> {
    const response = await apiService.post<TimelineEventResponse>(this.BASE_PATH, data);
    return response.event;
  }

  async updateEvent(id: string, data: UpdateTimelineEventRequest): Promise<TimelineEvent> {
    const response = await apiService.put<TimelineEventResponse>(`${this.BASE_PATH}/${id}`, data);
    return response.event;
  }

  async deleteEvent(id: string): Promise<void> {
    await apiService.delete(`${this.BASE_PATH}/${id}`);
  }
}

export const timelineService = new TimelineService();
