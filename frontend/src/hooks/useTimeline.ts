import { useEffect, useCallback } from 'react';
import { useTimelineStore } from '../store/timelineStore';
import { timelineService } from '../services/timeline.service';
import { websocketService } from '../services/websocket.service';
import {
  TimelineEvent,
  CreateTimelineEventRequest,
  UpdateTimelineEventRequest,
} from '../types/timeline.types';

export const useTimeline = () => {
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
  } = useTimelineStore();

  // Fetch all timeline events
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    clearError();
    try {
      const fetchedEvents = await timelineService.getAllEvents();
      setEvents(fetchedEvents);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch timeline events');
    } finally {
      setLoading(false);
    }
  }, [setLoading, setEvents, setError, clearError]);

  // Create a new timeline event
  const createEvent = useCallback(
    async (data: CreateTimelineEventRequest) => {
      setLoading(true);
      clearError();
      try {
        const newEvent = await timelineService.createEvent(data);
        addEvent(newEvent);
        return newEvent;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to create timeline event';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, addEvent, setError, clearError]
  );

  // Update a timeline event
  const updateEventById = useCallback(
    async (id: string, data: UpdateTimelineEventRequest) => {
      setLoading(true);
      clearError();
      try {
        const updatedEvent = await timelineService.updateEvent(id, data);
        updateEvent(updatedEvent);
        return updatedEvent;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to update timeline event';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, updateEvent, setError, clearError]
  );

  // Delete a timeline event
  const deleteEvent = useCallback(
    async (id: string) => {
      setLoading(true);
      clearError();
      try {
        await timelineService.deleteEvent(id);
        removeEvent(id);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to delete timeline event';
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
    const handleTimelineCreated = (data: unknown) => {
      const eventData = data as { event: TimelineEvent };
      addEvent(eventData.event);
    };

    const handleTimelineUpdated = (data: unknown) => {
      const eventData = data as { event: TimelineEvent };
      updateEvent(eventData.event);
    };

    const handleTimelineDeleted = (data: unknown) => {
      const eventData = data as { id: string };
      removeEvent(eventData.id);
    };

    websocketService.on('timeline:created', handleTimelineCreated);
    websocketService.on('timeline:updated', handleTimelineUpdated);
    websocketService.on('timeline:deleted', handleTimelineDeleted);

    return () => {
      websocketService.off('timeline:created', handleTimelineCreated);
      websocketService.off('timeline:updated', handleTimelineUpdated);
      websocketService.off('timeline:deleted', handleTimelineDeleted);
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
