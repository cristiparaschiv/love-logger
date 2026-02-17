import { Score } from '../../types/score.types';

interface ScoreDisplayProps {
  score: Score;
  animate?: boolean;
  heName?: string;
  sheName?: string;
}

export const ScoreDisplay = ({ score, animate = false, heName = 'He', sheName = 'She' }: ScoreDisplayProps) => {
  const heWinning = score.heScore > score.sheScore;
  const sheWinning = score.sheScore > score.heScore;
  const isTied = score.heScore === score.sheScore;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Scoreboard */}
      <div
        className={`relative bg-gradient-to-br from-pink-50 to-blue-50 rounded-3xl shadow-2xl p-8 md:p-12 transition-all duration-500 ${
          animate ? 'scale-105' : 'scale-100'
        }`}
      >
        {/* Labels */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex-1 text-center">
            <h2
              className={`text-2xl md:text-4xl font-bold transition-all duration-300 ${
                heWinning
                  ? 'text-blue-600 scale-110 drop-shadow-lg'
                  : isTied
                  ? 'text-blue-500'
                  : 'text-gray-400'
              }`}
            >
              {heName}
            </h2>
          </div>
          <div className="px-4 md:px-8">
            <span className="text-4xl md:text-6xl font-black text-gray-300">-</span>
          </div>
          <div className="flex-1 text-center">
            <h2
              className={`text-2xl md:text-4xl font-bold transition-all duration-300 ${
                sheWinning
                  ? 'text-pink-600 scale-110 drop-shadow-lg'
                  : isTied
                  ? 'text-pink-500'
                  : 'text-gray-400'
              }`}
            >
              {sheName}
            </h2>
          </div>
        </div>

        {/* Score Numbers */}
        <div className="flex justify-between items-center">
          <div className="flex-1 text-center">
            <div
              className={`inline-flex items-center justify-center w-32 h-32 md:w-48 md:h-48 rounded-full transition-all duration-500 ${
                heWinning
                  ? 'bg-blue-500 text-white shadow-xl shadow-blue-300 scale-110'
                  : 'bg-white text-blue-600 shadow-lg'
              } ${animate && heWinning ? 'animate-bounce' : ''}`}
            >
              <span className="text-5xl md:text-7xl font-black">{score.heScore}</span>
            </div>
          </div>

          {/* VS Divider */}
          <div className="px-4 md:px-8">
            <div className="flex flex-col items-center">
              <span className="text-xs md:text-sm font-semibold text-gray-400 uppercase tracking-wider">
                vs
              </span>
            </div>
          </div>

          <div className="flex-1 text-center">
            <div
              className={`inline-flex items-center justify-center w-32 h-32 md:w-48 md:h-48 rounded-full transition-all duration-500 ${
                sheWinning
                  ? 'bg-pink-500 text-white shadow-xl shadow-pink-300 scale-110'
                  : 'bg-white text-pink-600 shadow-lg'
              } ${animate && sheWinning ? 'animate-bounce' : ''}`}
            >
              <span className="text-5xl md:text-7xl font-black">{score.sheScore}</span>
            </div>
          </div>
        </div>

        {/* Status Message */}
        <div className="mt-8 text-center">
          {heWinning && (
            <p className="text-xl md:text-2xl font-bold text-blue-600 animate-pulse">
              {heName} is winning!
            </p>
          )}
          {sheWinning && (
            <p className="text-xl md:text-2xl font-bold text-pink-600 animate-pulse">
              {sheName} is winning!
            </p>
          )}
          {isTied && (
            <p className="text-xl md:text-2xl font-bold text-purple-600">It's a tie!</p>
          )}
        </div>

        {/* Last Updated */}
        <div className="mt-4 text-center">
          <p className="text-xs md:text-sm text-gray-500">
            Last updated: {new Date(score.updatedAt).toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};
