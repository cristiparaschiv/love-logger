interface MoodPickerProps {
  selected: number | null;
  onSelect: (mood: number) => void;
  disabled?: boolean;
}

const moods = [
  { value: 1, emoji: '😔', label: 'Tough' },
  { value: 2, emoji: '😕', label: 'Not great' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '😊', label: 'Good' },
  { value: 5, emoji: '😄', label: 'Great' },
];

export const MoodPicker = ({ selected, onSelect, disabled }: MoodPickerProps) => {
  return (
    <div className="flex justify-center gap-3">
      {moods.map((mood) => (
        <button
          key={mood.value}
          type="button"
          onClick={() => onSelect(mood.value)}
          disabled={disabled}
          className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
            selected === mood.value
              ? 'bg-primary-100 ring-2 ring-primary-500 scale-110'
              : 'bg-gray-50 hover:bg-gray-100'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <span className="text-2xl">{mood.emoji}</span>
          <span className="text-xs text-gray-600">{mood.label}</span>
        </button>
      ))}
    </div>
  );
};

export const moodEmoji = (mood: number): string => {
  return moods.find((m) => m.value === mood)?.emoji || '😐';
};

export const moodColor = (mood: number): string => {
  const colors: Record<number, string> = {
    1: 'bg-red-200',
    2: 'bg-orange-200',
    3: 'bg-yellow-200',
    4: 'bg-green-200',
    5: 'bg-emerald-300',
  };
  return colors[mood] || 'bg-gray-200';
};
