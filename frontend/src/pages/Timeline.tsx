import { useState } from 'react';
import { Layout } from '../components/common/Layout';
import { TimelineView } from '../components/timeline/TimelineView';
import { TimelineForm } from '../components/timeline/TimelineForm';
import { RelationshipCountdown } from '../components/timeline/RelationshipCountdown';
import { OnThisDay } from '../components/timeline/OnThisDay';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Button } from '../components/common/Button';
import { useTimeline } from '../hooks/useTimeline';
import { TimelineEvent } from '../types/timeline.types';

export const Timeline = () => {
  const {
    events,
    isLoading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    clearError,
  } = useTimeline();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);

  const handleAddEvent = () => {
    setEditingEvent(null);
    setIsFormOpen(true);
  };

  const handleEditEvent = (event: TimelineEvent) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: { eventDate: string; description: string }) => {
    if (editingEvent) {
      await updateEvent(editingEvent.id, data);
    } else {
      await createEvent(data);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = async (id: string) => {
    await deleteEvent(id);
  };

  return (
    <Layout>
      <div className="container-app py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Our Story</h1>
            <p className="text-gray-600">A timeline of our journey together</p>
          </div>
          <Button
            onClick={handleAddEvent}
            variant="primary"
            className="shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 inline-block"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Event
          </Button>
        </div>

        {/* Relationship Countdown */}
        <RelationshipCountdown />

        {/* On This Day Memories */}
        <OnThisDay />

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={clearError}
              className="text-red-700 hover:text-red-900"
              aria-label="Dismiss error"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && events.length === 0 && (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Timeline */}
        {!isLoading && (
          <div className="max-w-6xl mx-auto">
            <TimelineView
              events={events}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
            />
          </div>
        )}

        {/* Add/Edit Event Form */}
        <TimelineForm
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          event={editingEvent}
          title={editingEvent ? 'Edit Timeline Event' : 'Add Timeline Event'}
        />
      </div>
    </Layout>
  );
};
