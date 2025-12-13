export interface TimelineEvent {
  id: string;
  eventDate: string;
  description: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTimelineEventRequest {
  eventDate: string;
  description: string;
}

export interface UpdateTimelineEventRequest {
  eventDate?: string;
  description?: string;
}

export interface TimelineEventsResponse {
  events: TimelineEvent[];
}

export interface TimelineEventResponse {
  event: TimelineEvent;
}
