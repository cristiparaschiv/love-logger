import { CheckinHistoryEntry } from '../../types/checkin.types';
import { moodEmoji, moodColor } from './MoodPicker';
import { useAuthStore } from '../../store/authStore';

interface MoodCalendarProps {
  entries: CheckinHistoryEntry[];
}

export const MoodCalendar = ({ entries }: MoodCalendarProps) => {
  const { user } = useAuthStore();

  if (entries.length === 0) {
    return (
      <p className="text-sm text-gray-500 text-center py-4">No check-in history yet</p>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => {
        const myCheckin = entry.checkins.find((c) => c.userId === user?.id);
        const partnerCheckin = entry.checkins.find((c) => c.userId !== user?.id);
        const date = new Date(entry.date + 'T00:00:00');
        const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

        return (
          <div key={entry.date} className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500">{dayLabel}</span>
              <div className="flex gap-2">
                {myCheckin && (
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${moodColor(myCheckin.mood)}`}>
                    {moodEmoji(myCheckin.mood)} You
                  </span>
                )}
                {partnerCheckin && (
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${moodColor(partnerCheckin.mood)}`}>
                    {moodEmoji(partnerCheckin.mood)} {partnerCheckin.displayName}
                  </span>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-1">{entry.question.text}</p>
            <div className="grid grid-cols-2 gap-2">
              {myCheckin && (
                <div className="bg-primary-50 rounded p-2">
                  <p className="text-xs text-gray-700">{myCheckin.answer}</p>
                </div>
              )}
              {partnerCheckin && (
                <div className="bg-pink-50 rounded p-2">
                  <p className="text-xs text-gray-700">{partnerCheckin.answer}</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
