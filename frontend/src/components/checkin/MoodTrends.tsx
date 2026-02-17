import { useState, useEffect } from 'react';
import { checkinApiService } from '../../services/checkin.service';
import { CheckinStats } from '../../types/checkin.types';
import { MoodLineChart } from './MoodLineChart';
import { StatCards } from './StatCards';
import { MoodDistribution } from './MoodDistribution';
import { InsightCards } from './InsightCards';
import { Loader2 } from 'lucide-react';

const ranges = [
  { label: '7d', days: 7 },
  { label: '30d', days: 30 },
  { label: '90d', days: 90 },
] as const;

export const MoodTrends = () => {
  const [days, setDays] = useState(30);
  const [stats, setStats] = useState<CheckinStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    checkinApiService.getStats(days).then((data) => {
      if (!cancelled) {
        setStats(data);
        setLoading(false);
      }
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [days]);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!stats || stats.daily.every((d) => d.myMood === null && d.partnerMood === null)) {
    return (
      <p className="text-sm text-gray-500 text-center py-8">No check-in data for this period yet</p>
    );
  }

  return (
    <div className="space-y-4">
      {/* Range selector */}
      <div className="flex justify-center gap-1 bg-gray-100 rounded-lg p-1 w-fit mx-auto">
        {ranges.map((r) => (
          <button
            key={r.days}
            onClick={() => setDays(r.days)}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              days === r.days
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <StatCards
        streak={stats.streak}
        avgMood={stats.avgMood}
        moodMatchPercent={stats.moodMatchPercent}
        perfectDays={stats.perfectDays}
      />

      <MoodLineChart data={stats.daily} />

      <MoodDistribution my={stats.distribution.my} partner={stats.distribution.partner} />

      <InsightCards insights={stats.insights} />
    </div>
  );
};
