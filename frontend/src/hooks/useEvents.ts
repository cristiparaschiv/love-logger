import { useEffect, useCallback } from 'react';
import { useEventStore } from '../store/eventStore';
import { eventService } from '../services/event.service';
import { websocketService } from '../services/websocket.service';
import { Event, CreateEventRequest, UpdateEventRequest } from '../types/event.types';

export const useEvents = () => {
  const {
    events,
    selectedEvent,
    isLoading,
    error,
    setEvents,
    addEvent,
    updateEvent,
    removeEvent,
    setSelectedEvent,
    setLoading,
    setError,
    clearError,
  } = useEventStore();

  // Fetch all events
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    clearError();
    try {
      const fetchedEvents = await eventService.getAllEvents();
      setEvents(fetchedEvents);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  }, [setLoading, setEvents, setError, clearError]);

  // Create a new event
  const createEvent = useCallback(
    async (data: CreateEventRequest) => {
      setLoading(true);
      clearError();
      try {
        const newEvent = await eventService.createEvent(data);
        addEvent(newEvent);
        return newEvent;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to create event';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, addEvent, setError, clearError]
  );

  // Update an event
  const updateEventById = useCallback(
    async (id: string, data: UpdateEventRequest) => {
      setLoading(true);
      clearError();
      try {
        const updatedEvent = await eventService.updateEvent(id, data);
        updateEvent(updatedEvent);
        return updatedEvent;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to update event';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, updateEvent, setError, clearError]
  );

  // Delete an event
  const deleteEvent = useCallback(
    async (id: string) => {
      setLoading(true);
      clearError();
      try {
        await eventService.deleteEvent(id);
        removeEvent(id);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to delete event';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, removeEvent, setError, clearError]
  );

  // Setup WebSocket listeners for real-time updates
  useEffect(() => {
    const handleEventCreated = (data: unknown) => {
      const eventData = data as { event: Event };
      addEvent(eventData.event);
    };

    const handleEventUpdated = (data: unknown) => {
      const eventData = data as { event: Event };
      updateEvent(eventData.event);
    };

    const handleEventDeleted = (data: unknown) => {
      const eventData = data as { id: string };
      removeEvent(eventData.id);
    };

    websocketService.on('event:created', handleEventCreated);
    websocketService.on('event:updated', handleEventUpdated);
    websocketService.on('event:deleted', handleEventDeleted);

    return () => {
      websocketService.off('event:created', handleEventCreated);
      websocketService.off('event:updated', handleEventUpdated);
      websocketService.off('event:deleted', handleEventDeleted);
    };
  }, [addEvent, updateEvent, removeEvent]);

  // Fetch events on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    selectedEvent,
    isLoading,
    error,
    fetchEvents,
    createEvent,
    updateEvent: updateEventById,
    deleteEvent,
    setSelectedEvent,
    clearError,
  };
};
