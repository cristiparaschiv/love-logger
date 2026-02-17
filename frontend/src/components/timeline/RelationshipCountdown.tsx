import { useState } from 'react';
import { useRelationship } from '../../hooks/useRelationship';

export const RelationshipCountdown = () => {
  const { config, daysTogether, setStartDate, isLoading } = useRelationship();
  const [isEditing, setIsEditing] = useState(false);
  const [dateValue, setDateValue] = useState('');

  const handleSave = async () => {
    if (!dateValue) return;
    await setStartDate(new Date(dateValue).toISOString());
    setIsEditing(false);
  };

  const handleEdit = () => {
    setDateValue(config?.startDate ? new Date(config.startDate).toISOString().split('T')[0] : '');
    setIsEditing(true);
  };

  if (isLoading && !config) return null;

  return (
    <div className="bg-pink-50 border border-pink-200 rounded-xl p-6 mb-6">
      {daysTogether !== null && !isEditing ? (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-pink-800 text-sm font-medium">Together for</p>
            <p className="text-3xl font-bold text-pink-600">{daysTogether} days</p>
          </div>
          <button
            onClick={handleEdit}
            className="text-pink-400 hover:text-pink-600 text-sm transition-colors"
          >
            Edit date
          </button>
        </div>
      ) : (
        <div>
          <p className="text-pink-800 text-sm font-medium mb-2">
            {config ? 'Update your start date' : 'When did your journey begin?'}
          </p>
          <div className="flex gap-2">
            <input
              type="date"
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
              className="flex-1 px-3 py-2 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none text-sm"
            />
            <button
              onClick={handleSave}
              disabled={!dateValue}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 text-sm font-medium transition-colors"
            >
              Save
            </button>
            {isEditing && (
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-pink-600 hover:bg-pink-100 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
