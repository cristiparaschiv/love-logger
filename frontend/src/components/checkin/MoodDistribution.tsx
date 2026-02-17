import { moodEmoji } from './MoodPicker';

interface MoodDistributionProps {
  my: Record<string, number>;
  partner: Record<string, number>;
}

export const MoodDistribution = ({ my, partner }: MoodDistributionProps) => {
  const myTotal = Object.values(my).reduce((a, b) => a + b, 0);
  const partnerTotal = Object.values(partner).reduce((a, b) => a + b, 0);

  if (myTotal === 0 && partnerTotal === 0) return null;

  const moods = ['5', '4', '3', '2', '1'];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Mood Distribution</h3>
      <div className="space-y-2">
        {moods.map((mood) => {
          const myPct = myTotal > 0 ? Math.round((my[mood] / myTotal) * 100) : 0;
          const partnerPct = partnerTotal > 0 ? Math.round((partner[mood] / partnerTotal) * 100) : 0;

          return (
            <div key={mood} className="flex items-center gap-2">
              <span className="text-sm w-6 text-center">{moodEmoji(Number(mood))}</span>
              <div className="flex-1 flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                  <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-400 rounded-full transition-all duration-500"
                      style={{ width: `${myPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 w-7 text-right">{myPct}%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-pink-300 rounded-full transition-all duration-500"
                      style={{ width: `${partnerPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 w-7 text-right">{partnerPct}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-primary-400 rounded-full" /> You
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-pink-300 rounded-full" /> Partner
        </span>
      </div>
    </div>
  );
};
