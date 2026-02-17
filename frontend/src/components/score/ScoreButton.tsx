import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';

interface ScoreButtonProps {
  onIncrement: () => Promise<void>;
  isDisabled?: boolean;
}

export const ScoreButton = ({ onIncrement, isDisabled = false }: ScoreButtonProps) => {
  const { user } = useAuthStore();
  const [isAnimating, setIsAnimating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const username = user?.username;

  const handleClick = async () => {
    if (isDisabled) return;

    // Trigger animations
    setIsAnimating(true);
    setShowConfetti(true);

    try {
      await onIncrement();
    } catch (error) {
      console.error('Failed to increment score:', error);
    }

    // Reset animations after delay
    setTimeout(() => setIsAnimating(false), 600);
    setTimeout(() => setShowConfetti(false), 2000);
  };

  // Determine button color based on user
  const buttonColor = username === 'he' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-pink-500 hover:bg-pink-600';
  const buttonShadow = username === 'he' ? 'shadow-blue-300' : 'shadow-pink-300';

  return (
    <div className="relative">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="confetti-container">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  backgroundColor: username === 'he' ?
                    ['#3B82F6', '#60A5FA', '#93C5FD'][Math.floor(Math.random() * 3)] :
                    ['#EC4899', '#F472B6', '#FBCFE8'][Math.floor(Math.random() * 3)],
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Main Button */}
      <button
        onClick={handleClick}
        disabled={isDisabled}
        className={`
          relative overflow-hidden
          min-w-[200px] md:min-w-[280px]
          px-8 md:px-12 py-6 md:py-8
          ${buttonColor}
          text-white font-black text-2xl md:text-4xl
          rounded-2xl md:rounded-3xl
          shadow-2xl ${buttonShadow}
          transform transition-all duration-300
          ${isAnimating ? 'scale-95' : 'scale-100'}
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95 cursor-pointer'}
          focus:outline-none focus:ring-4 focus:ring-offset-2
          ${username === 'he' ? 'focus:ring-blue-300' : 'focus:ring-pink-300'}
        `}
        aria-label={`Add point for ${username}`}
      >
        {/* Ripple Effect on Click */}
        {isAnimating && (
          <span className="absolute inset-0 animate-ping bg-white opacity-25 rounded-2xl md:rounded-3xl" />
        )}

        {/* Button Content */}
        <div className="relative flex items-center justify-center gap-3 md:gap-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-8 w-8 md:h-12 md:w-12 transition-transform duration-300 ${
              isAnimating ? 'rotate-180 scale-125' : 'rotate-0'
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>Add Point</span>
        </div>

        {/* Shine Effect */}
        {!isDisabled && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-20 transition-opacity duration-700 transform -skew-x-12" />
        )}
      </button>

      {/* Helper Text */}
      <p className="mt-4 text-center text-sm md:text-base text-gray-600">
        Click to add a point for <span className="font-bold capitalize">{user?.displayName || username}</span>
      </p>

      {/* CSS for Confetti Animation */}
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100%) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(400px) rotate(720deg);
            opacity: 0;
          }
        }

        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          top: -20px;
          animation: confetti-fall 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
