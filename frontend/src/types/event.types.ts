export interface Event {
  id: string;
  latitude: number;
  longitude: number;
  eventDate: string;
  note: string;
  nearestCity: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventRequest {
  latitude: number;
  longitude: number;
  eventDate: string;
  note: string;
}

export interface UpdateEventRequest {
  latitude?: number;
  longitude?: number;
  eventDate?: string;
  note?: string;
  nearestCity?: string | null;
}

export interface EventsResponse {
  events: Event[];
}

export interface EventResponse {
  event: Event;
}

export interface ReverseGeocodeResult {
  city: string;
  country: string;
  displayName: string;
}

export interface SearchResult {
  displayName: string;
  lat: number;
  lon: number;
  type: string;
}

export interface SearchResultsResponse {
  results: SearchResult[];
}

export interface EventState {
  events: Event[];
  selectedEvent: Event | null;
  isLoading: boolean;
  error: string | null;
}
