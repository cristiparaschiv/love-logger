import { TimelineEvent } from '../../types/timeline.types';
import { TimelineItem } from './TimelineItem';

interface TimelineViewProps {
  events: TimelineEvent[];
  onEdit: (event: TimelineEvent) => void;
  onDelete: (id: string) => void;
}

export const TimelineView = ({ events, onEdit, onDelete }: TimelineViewProps) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-block p-6 bg-pink-50 rounded-full mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-pink-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Story Awaits</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Start documenting your journey together. Add your first milestone to begin creating your
          beautiful timeline.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical Timeline Line (Desktop only) */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-200 via-rose-300 to-pink-200 transform -translate-x-1/2"></div>

      {/* Vertical Timeline Line (Mobile) */}
      <div className="md:hidden absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-200 via-rose-300 to-pink-200"></div>

      {/* Timeline Items */}
      <div className="relative">
        {events.map((event, index) => (
          <TimelineItem
            key={event.id}
            event={event}
            index={index}
            totalEvents={events.length}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Timeline End Marker */}
      <div className="flex justify-center md:justify-center">
        <div className="w-6 h-6 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full shadow-lg ring-4 ring-white md:ml-0 -ml-2"></div>
      </div>
    </div>
  );
};
