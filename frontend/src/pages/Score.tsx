import { useState, useEffect } from 'react';
import { Layout } from '../components/common/Layout';
import { ScoreDisplay } from '../components/score/ScoreDisplay';
import { ScoreButton } from '../components/score/ScoreButton';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Button } from '../components/common/Button';
import { useScore } from '../hooks/useScore';

export const Score = () => {
  const { score, isLoading, error, isIncrementing, incrementScore, resetScore, clearError } =
    useScore();

  const [showAnimation, setShowAnimation] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Trigger animation when score changes
  useEffect(() => {
    if (score) {
      setShowAnimation(true);
      const timer = setTimeout(() => setShowAnimation(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [score?.heScore, score?.sheScore]);

  const handleIncrement = async () => {
    try {
      await incrementScore();
    } catch (err) {
      console.error('Failed to increment score:', err);
    }
  };

  const handleReset = async () => {
    try {
      await resetScore();
      setShowResetConfirm(false);
    } catch (err) {
      console.error('Failed to reset score:', err);
    }
  };

  return (
    <Layout>
      <div className="container-app py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
            Score Tracker
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            A playful competition between us
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={clearError}
                className="text-red-700 hover:text-red-900"
                aria-label="Dismiss error"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !score && (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Score Display */}
        {score && (
          <div className="space-y-8 md:space-y-12">
            {/* Scoreboard */}
            <ScoreDisplay score={score} animate={showAnimation} />

            {/* Add Point Button */}
            <div className="flex justify-center">
              <ScoreButton onIncrement={handleIncrement} isDisabled={isIncrementing} />
            </div>

            {/* Reset Button (Small, tucked away) */}
            <div className="flex justify-center mt-8">
              {!showResetConfirm ? (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  Reset Score
                </button>
              ) : (
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg">
                  <span className="text-sm text-gray-700">Are you sure?</span>
                  <Button
                    onClick={handleReset}
                    variant="danger"
                    className="text-xs px-3 py-1"
                  >
                    Yes, Reset
                  </Button>
                  <Button
                    onClick={() => setShowResetConfirm(false)}
                    variant="secondary"
                    className="text-xs px-3 py-1"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            {/* Fun Messages */}
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-6">
                <p className="text-sm md:text-base text-gray-700 italic">
                  "Competition makes us better, but love makes us complete."
                </p>
              </div>
              <p className="text-xs md:text-sm text-gray-500">
                Keep it fun, keep it light, and may the best player win!
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
