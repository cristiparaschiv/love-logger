import { useState, useEffect } from 'react';
import { TimelineEvent } from '../../types/timeline.types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

interface TimelineFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { eventDate: string; description: string }) => Promise<void>;
  event?: TimelineEvent | null;
  title?: string;
}

export const TimelineForm = ({
  isOpen,
  onClose,
  onSubmit,
  event,
  title = 'Add Timeline Event',
}: TimelineFormProps) => {
  const [eventDate, setEventDate] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form with event data when editing
  useEffect(() => {
    if (event) {
      // Convert ISO string to YYYY-MM-DD format for the input
      const date = new Date(event.eventDate);
      const formattedDate = date.toISOString().split('T')[0];
      setEventDate(formattedDate);
      setDescription(event.description);
    } else {
      setEventDate('');
      setDescription('');
    }
    setError(null);
  }, [event, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!eventDate || !description.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert to ISO string for API
      const isoDate = new Date(eventDate).toISOString();
      await onSubmit({
        eventDate: isoDate,
        description: description.trim(),
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save timeline event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Event Date */}
        <div>
          <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <Input
            id="eventDate"
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
            disabled={isSubmitting}
            className="w-full"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What happened on this day?"
            rows={4}
            maxLength={500}
            required
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
          />
          <div className="text-xs text-gray-500 mt-1 text-right">
            {description.length}/500 characters
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Saving...' : event ? 'Update' : 'Add Event'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
