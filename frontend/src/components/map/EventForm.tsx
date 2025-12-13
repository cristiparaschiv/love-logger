import { useState, useEffect } from 'react';
import { Event } from '../../types/event.types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

interface EventFormProps {
  event?: Event | null;
  latitude: number;
  longitude: number;
  nearestCity?: string;
  onSubmit: (data: { note: string; eventDate: string; latitude: number; longitude: number }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const EventForm = ({
  event,
  latitude,
  longitude,
  nearestCity,
  onSubmit,
  onCancel,
  isLoading = false,
}: EventFormProps) => {
  const [note, setNote] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [errors, setErrors] = useState<{ note?: string; eventDate?: string }>({});

  useEffect(() => {
    if (event) {
      setNote(event.note);
      // Convert to datetime-local format
      const date = new Date(event.eventDate);
      const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setEventDate(localDate);
    } else {
      // Set current date/time for new events
      const now = new Date();
      const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setEventDate(localDate);
      setNote('');
    }
  }, [event]);

  const validate = () => {
    const newErrors: { note?: string; eventDate?: string } = {};

    if (!note.trim()) {
      newErrors.note = 'Note is required';
    } else if (note.length > 1000) {
      newErrors.note = 'Note must be less than 1000 characters';
    }

    if (!eventDate) {
      newErrors.eventDate = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Convert local datetime to ISO string
    const isoDate = new Date(eventDate).toISOString();

    onSubmit({
      note: note.trim(),
      eventDate: isoDate,
      latitude,
      longitude,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Location info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Location</h3>
        <div className="space-y-1 text-sm text-gray-600">
          {nearestCity && <p className="font-medium text-gray-900">{nearestCity}</p>}
          <p>
            Lat: {latitude.toFixed(6)}, Lng: {longitude.toFixed(6)}
          </p>
        </div>
      </div>

      {/* Date input */}
      <div>
        <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-1">
          Date & Time
        </label>
        <Input
          id="eventDate"
          type="datetime-local"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          error={errors.eventDate}
        />
      </div>

      {/* Note input */}
      <div>
        <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
          Note
        </label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
          placeholder="What made this moment special?"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
            errors.note ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.note && <p className="text-red-500 text-sm mt-1">{errors.note}</p>}
        <p className="text-sm text-gray-500 mt-1">{note.length}/1000 characters</p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? 'Saving...' : event ? 'Update Event' : 'Create Event'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
