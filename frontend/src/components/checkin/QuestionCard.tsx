import { DailyQuestion } from '../../types/checkin.types';

interface QuestionCardProps {
  question: DailyQuestion;
  answer: string;
  onAnswerChange: (answer: string) => void;
  disabled?: boolean;
}

export const QuestionCard = ({ question, answer, onAnswerChange, disabled }: QuestionCardProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-lg font-medium text-gray-900 mb-4">{question.text}</p>

      {question.type === 'options' && question.options ? (
        <div className="grid grid-cols-2 gap-2">
          {question.options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onAnswerChange(option)}
              disabled={disabled}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-all ${
                answer === option
                  ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-500'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {option}
            </button>
          ))}
        </div>
      ) : (
        <textarea
          value={answer}
          onChange={(e) => onAnswerChange(e.target.value)}
          disabled={disabled}
          placeholder="Type your answer..."
          maxLength={500}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm resize-none disabled:opacity-50"
        />
      )}
    </div>
  );
};
