import { create } from 'zustand';
import { Event, EventState } from '../types/event.types';

interface EventStore extends EventState {
  setEvents: (events: Event[]) => void;
  addEvent: (event: Event) => void;
  updateEvent: (event: Event) => void;
  removeEvent: (id: string) => void;
  setSelectedEvent: (event: Event | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useEventStore = create<EventStore>((set) => ({
  events: [],
  selectedEvent: null,
  isLoading: false,
  error: null,

  setEvents: (events) => set({ events }),

  addEvent: (event) =>
    set((state) => {
      // Check if event already exists to prevent duplicates
      if (state.events.find((e) => e.id === event.id)) {
        return state;
      }
      return {
        events: [event, ...state.events].sort(
          (a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
        ),
      };
    }),

  updateEvent: (updatedEvent) =>
    set((state) => ({
      events: state.events.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)),
      selectedEvent:
        state.selectedEvent?.id === updatedEvent.id ? updatedEvent : state.selectedEvent,
    })),

  removeEvent: (id) =>
    set((state) => ({
      events: state.events.filter((event) => event.id !== id),
      selectedEvent: state.selectedEvent?.id === id ? null : state.selectedEvent,
    })),

  setSelectedEvent: (event) => set({ selectedEvent: event }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),
}));
