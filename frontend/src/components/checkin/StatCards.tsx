import { Flame, Heart, Target, Sparkles } from 'lucide-react';

interface StatCardsProps {
  streak: number;
  avgMood: { my: number; partner: number };
  moodMatchPercent: number;
  perfectDays: number;
}

export const StatCards = ({ streak, avgMood, moodMatchPercent, perfectDays }: StatCardsProps) => {
  const stats = [
    { icon: Flame, label: 'Streak', value: `${streak}d`, color: 'text-orange-500', bg: 'bg-orange-50' },
    { icon: Heart, label: 'Avg Mood', value: `${avgMood.my} / ${avgMood.partner}`, color: 'text-pink-500', bg: 'bg-pink-50' },
    { icon: Target, label: 'Mood Match', value: `${moodMatchPercent}%`, color: 'text-primary-500', bg: 'bg-primary-50' },
    { icon: Sparkles, label: 'Perfect Days', value: String(perfectDays), color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat) => (
        <div key={stat.label} className={`${stat.bg} rounded-xl p-3 flex items-center gap-3`}>
          <stat.icon className={`w-5 h-5 ${stat.color} shrink-0`} />
          <div>
            <p className="text-lg font-bold text-gray-900 leading-tight">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
