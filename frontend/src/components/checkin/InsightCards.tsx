interface InsightCardsProps {
  insights: string[];
}

export const InsightCards = ({ insights }: InsightCardsProps) => {
  if (insights.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-700">Insights</h3>
      {insights.map((insight, i) => (
        <div key={i} className="bg-gradient-to-r from-primary-50 to-pink-50 rounded-xl px-4 py-3">
          <p className="text-sm text-gray-700">{insight}</p>
        </div>
      ))}
    </div>
  );
};
