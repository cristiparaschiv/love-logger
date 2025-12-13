import { useState } from 'react';
import { TimelineEvent } from '../../types/timeline.types';

interface TimelineItemProps {
  event: TimelineEvent;
  index: number;
  totalEvents: number;
  onEdit: (event: TimelineEvent) => void;
  onDelete: (id: string) => void;
}

export const TimelineItem = ({ event, index, onEdit, onDelete }: TimelineItemProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isEven = index % 2 === 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleDelete = () => {
    onDelete(event.id);
    setShowDeleteConfirm(false);
  };

  return (
    <div className="relative flex items-center mb-12 md:mb-16">
      {/* Desktop: Alternating left/right layout */}
      <div className="hidden md:flex w-full items-center">
        {/* Left side content (odd items) */}
        {!isEven && (
          <div className="w-5/12 text-right pr-8 animate-fade-in-right">
            <div className="bg-white rounded-lg shadow-md p-5 group hover:shadow-xl transition-all duration-300 border-2 border-pink-100">
              <div className="text-sm text-rose-600 font-semibold mb-2">{formatDate(event.eventDate)}</div>
              <p className="text-gray-800 text-base leading-relaxed">{event.description}</p>

              {/* Action buttons (appear on hover) */}
              <div className="mt-4 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => onEdit(event)}
                  className="px-3 py-1.5 bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-md text-sm transition-colors duration-200"
                  aria-label="Edit event"
                >
                  Edit
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-md text-sm transition-colors duration-200"
                  aria-label="Delete event"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Center: Heart icon on timeline */}
        <div className="w-2/12 flex justify-center relative z-10">
          <div className="relative">
            {/* Heart icon */}
            <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white transform hover:scale-110 transition-transform duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-white"
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
          </div>
        </div>

        {/* Right side content (even items) */}
        {isEven && (
          <div className="w-5/12 pl-8 animate-fade-in-left">
            <div className="bg-white rounded-lg shadow-md p-5 group hover:shadow-xl transition-all duration-300 border-2 border-pink-100">
              <div className="text-sm text-rose-600 font-semibold mb-2">{formatDate(event.eventDate)}</div>
              <p className="text-gray-800 text-base leading-relaxed">{event.description}</p>

              {/* Action buttons (appear on hover) */}
              <div className="mt-4 flex justify-start gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => onEdit(event)}
                  className="px-3 py-1.5 bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-md text-sm transition-colors duration-200"
                  aria-label="Edit event"
                >
                  Edit
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-md text-sm transition-colors duration-200"
                  aria-label="Delete event"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty space for alignment */}
        {!isEven && <div className="w-5/12"></div>}
        {isEven && <div className="w-5/12"></div>}
      </div>

      {/* Mobile: Single column layout */}
      <div className="flex md:hidden w-full">
        {/* Heart icon */}
        <div className="flex-shrink-0 mr-4">
          <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
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
        </div>

        {/* Content */}
        <div className="flex-grow">
          <div className="bg-white rounded-lg shadow-md p-4 border-2 border-pink-100">
            <div className="text-sm text-rose-600 font-semibold mb-2">{formatDate(event.eventDate)}</div>
            <p className="text-gray-800 text-sm leading-relaxed mb-3">{event.description}</p>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(event)}
                className="px-3 py-1.5 bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-md text-sm transition-colors duration-200"
                aria-label="Edit event"
              >
                Edit
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-md text-sm transition-colors duration-200"
                aria-label="Delete event"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-2xl">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Delete Timeline Event?</h4>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this timeline event? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
