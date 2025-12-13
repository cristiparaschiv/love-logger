import { create } from 'zustand';
import { TimelineEvent } from '../types/timeline.types';

interface TimelineState {
  events: TimelineEvent[];
  selectedEvent: TimelineEvent | null;
  isLoading: boolean;
  error: string | null;
}

interface TimelineStore extends TimelineState {
  setEvents: (events: TimelineEvent[]) => void;
  addEvent: (event: TimelineEvent) => void;
  updateEvent: (event: TimelineEvent) => void;
  removeEvent: (id: string) => void;
  setSelectedEvent: (event: TimelineEvent | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useTimelineStore = create<TimelineStore>((set) => ({
  events: [],
  selectedEvent: null,
  isLoading: false,
  error: null,

  setEvents: (events) => {
    // Sort events by date (ascending - oldest first)
    const sortedEvents = [...events].sort(
      (a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
    );
    set({ events: sortedEvents });
  },

  addEvent: (event) =>
    set((state) => {
      // Check if event already exists to prevent duplicates
      if (state.events.find((e) => e.id === event.id)) {
        return state;
      }

      // Add and sort
      const newEvents = [...state.events, event].sort(
        (a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
      );

      return { events: newEvents };
    }),

  updateEvent: (updatedEvent) =>
    set((state) => {
      const newEvents = state.events
        .map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
        .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());

      return {
        events: newEvents,
        selectedEvent:
          state.selectedEvent?.id === updatedEvent.id ? updatedEvent : state.selectedEvent,
      };
    }),

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
