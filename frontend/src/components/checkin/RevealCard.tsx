import { useEffect, useState } from 'react';
import { CheckinAnswer, DailyQuestion } from '../../types/checkin.types';
import { moodEmoji } from './MoodPicker';

interface RevealCardProps {
  question: DailyQuestion;
  myCheckin: CheckinAnswer;
  partnerCheckin: CheckinAnswer;
}

export const RevealCard = ({ question, myCheckin, partnerCheckin }: RevealCardProps) => {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const moodMatch = myCheckin.mood === partnerCheckin.mood;

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-5 transition-all duration-500 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {moodMatch && (
        <div className="text-center mb-4 p-3 bg-green-50 rounded-lg">
          <span className="text-lg">Your moods match! {moodEmoji(myCheckin.mood)}</span>
        </div>
      )}

      <p className="text-sm font-medium text-gray-500 mb-4">{question.text}</p>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-center">
            <span className="text-2xl">{moodEmoji(myCheckin.mood)}</span>
            <p className="text-xs text-gray-500 mt-1">You</p>
          </div>
          <div className="bg-primary-50 rounded-lg p-3">
            <p className="text-sm text-gray-800">{myCheckin.answer}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-center">
            <span className="text-2xl">{moodEmoji(partnerCheckin.mood)}</span>
            <p className="text-xs text-gray-500 mt-1">Partner</p>
          </div>
          <div className="bg-pink-50 rounded-lg p-3">
            <p className="text-sm text-gray-800">{partnerCheckin.answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
