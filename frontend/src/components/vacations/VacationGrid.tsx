import { Vacation } from '../../types/vacation.types';
import { VacationCard } from './VacationCard';

interface VacationGridProps {
  vacations: Vacation[];
  onEdit: (vacation: Vacation) => void;
  onDelete: (id: string) => void;
  title?: string;
  emptyMessage?: string;
}

export const VacationGrid = ({ vacations, onEdit, onDelete, title, emptyMessage }: VacationGridProps) => {
  if (vacations.length === 0 && emptyMessage) {
    return (
      <div className="text-center py-12">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 mx-auto text-gray-300 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  if (vacations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {title && (
        <h2 className="text-2xl font-bold text-gray-900">
          {title} ({vacations.length})
        </h2>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {vacations.map((vacation) => (
          <VacationCard key={vacation.id} vacation={vacation} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
};
