import { useState } from 'react';
import { Vacation } from '../../types/vacation.types';
import { API_CONFIG } from '../../config/api.config';

interface VacationCardProps {
  vacation: Vacation;
  onEdit: (vacation: Vacation) => void;
  onDelete: (id: string) => void;
}

export const VacationCard = ({ vacation, onEdit, onDelete }: VacationCardProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleDelete = () => {
    onDelete(vacation.id);
    setShowDeleteConfirm(false);
  };

  const getMonthYear = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const getImageUrl = () => {
    if (!vacation.photoUrl || imageError) {
      return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop';
    }
    // Get the backend base URL (remove /api suffix from API_CONFIG.BASE_URL)
    const backendBaseUrl = API_CONFIG.BASE_URL.replace(/\/api$/, '');
    // Use /uploads route for public static files (no auth required)
    return `${backendBaseUrl}/uploads${vacation.photoUrl}`;
  };

  return (
    <div className="relative group rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 aspect-[4/3]">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
        style={{
          backgroundImage: `url(${getImageUrl()})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
      </div>

      {/* Image Error Handler */}
      {vacation.photoUrl && (
        <img
          src={getImageUrl()}
          alt={vacation.location}
          onError={() => setImageError(true)}
          className="hidden"
        />
      )}

      {/* Content Overlay */}
      <div className="relative h-full flex flex-col justify-between p-4">
        {/* Top Right Actions */}
        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => onEdit(vacation)}
            className="bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-colors duration-200"
            aria-label="Edit vacation"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-red-500/90 hover:bg-red-500 text-white rounded-full p-2 shadow-lg transition-colors duration-200"
            aria-label="Delete vacation"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>

        {/* Bottom Info */}
        <div className="text-white">
          <h3 className="text-2xl font-bold mb-1 drop-shadow-lg">{vacation.location}</h3>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {getMonthYear(vacation.startDate)}
            </span>
            <span className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {vacation.durationDays} {vacation.durationDays === 1 ? 'day' : 'days'}
            </span>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-10">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Delete Vacation?</h4>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this vacation to {vacation.location}? This action cannot be undone.
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
