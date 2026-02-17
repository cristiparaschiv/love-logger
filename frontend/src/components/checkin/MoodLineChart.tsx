import { moodEmoji } from './MoodPicker';

interface DataPoint {
  date: string;
  myMood: number | null;
  partnerMood: number | null;
}

interface MoodLineChartProps {
  data: DataPoint[];
}

export const MoodLineChart = ({ data }: MoodLineChartProps) => {
  if (data.length === 0) return null;

  const padding = { top: 20, right: 16, bottom: 40, left: 36 };
  const width = 360;
  const height = 200;
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const xStep = data.length > 1 ? chartW / (data.length - 1) : chartW / 2;

  const toX = (i: number) => padding.left + i * xStep;
  const toY = (mood: number) => padding.top + chartH - ((mood - 1) / 4) * chartH;

  const buildPolyline = (key: 'myMood' | 'partnerMood') => {
    const segments: { points: string; dots: { x: number; y: number; mood: number }[] }[] = [];
    let current: { x: number; y: number; mood: number }[] = [];

    data.forEach((d, i) => {
      const val = d[key];
      if (val !== null) {
        current.push({ x: toX(i), y: toY(val), mood: val });
      } else if (current.length > 0) {
        segments.push({ points: current.map((p) => `${p.x},${p.y}`).join(' '), dots: current });
        current = [];
      }
    });
    if (current.length > 0) {
      segments.push({ points: current.map((p) => `${p.x},${p.y}`).join(' '), dots: current });
    }
    return segments;
  };

  const mySegments = buildPolyline('myMood');
  const partnerSegments = buildPolyline('partnerMood');

  // X-axis labels — show ~5-7 labels
  const labelStep = Math.max(1, Math.floor(data.length / 6));
  const xLabels = data
    .map((d, i) => ({ i, label: new Date(d.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }))
    .filter((_, idx) => idx % labelStep === 0 || idx === data.length - 1);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Mood Over Time</h3>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-primary-500 inline-block rounded" /> You
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-pink-400 inline-block rounded" /> Partner
          </span>
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        {[1, 2, 3, 4, 5].map((mood) => (
          <line
            key={mood}
            x1={padding.left}
            y1={toY(mood)}
            x2={width - padding.right}
            y2={toY(mood)}
            stroke="#f3f4f6"
            strokeWidth={1}
          />
        ))}

        {/* Y-axis emoji labels */}
        {[1, 2, 3, 4, 5].map((mood) => (
          <text
            key={mood}
            x={padding.left - 8}
            y={toY(mood) + 4}
            textAnchor="middle"
            fontSize={10}
          >
            {moodEmoji(mood)}
          </text>
        ))}

        {/* X-axis labels */}
        {xLabels.map(({ i, label }) => (
          <text
            key={i}
            x={toX(i)}
            y={height - 8}
            textAnchor="middle"
            fontSize={9}
            fill="#9ca3af"
          >
            {label}
          </text>
        ))}

        {/* Partner line (behind) */}
        {partnerSegments.map((seg, si) => (
          <g key={`p-${si}`}>
            <polyline points={seg.points} fill="none" stroke="#f472b6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            {seg.dots.map((dot, di) => (
              <circle key={di} cx={dot.x} cy={dot.y} r={3} fill="#f472b6" />
            ))}
          </g>
        ))}

        {/* My line (front) */}
        {mySegments.map((seg, si) => (
          <g key={`m-${si}`}>
            <polyline points={seg.points} fill="none" stroke="#7c3aed" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            {seg.dots.map((dot, di) => (
              <circle key={di} cx={dot.x} cy={dot.y} r={3} fill="#7c3aed" />
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
};
