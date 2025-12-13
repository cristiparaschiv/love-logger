import { useEffect, useState } from 'react';
import { Vacation } from '../../types/vacation.types';

interface CountdownProps {
  vacation: Vacation;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const Countdown = ({ vacation }: CountdownProps) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const startDate = new Date(vacation.startDate).getTime();
      const difference = startDate - now;

      if (difference > 0) {
        setTimeRemaining({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [vacation.startDate]);

  return (
    <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg shadow-lg p-4 sm:p-6 md:p-8 text-white">
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Next Vacation</h2>
        <p className="text-lg sm:text-xl opacity-90">{vacation.location}</p>
        <p className="text-xs sm:text-sm opacity-75 mt-1">
          {new Date(vacation.startDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        <div className="text-center">
          <div className="bg-white bg-opacity-20 rounded-lg p-2 sm:p-3 md:p-4 backdrop-blur-sm">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold">{timeRemaining.days}</div>
            <div className="text-[10px] sm:text-xs md:text-sm uppercase tracking-tight sm:tracking-wide mt-0.5 sm:mt-1">
              <span className="hidden sm:inline">Days</span>
              <span className="sm:hidden">Days</span>
            </div>
          </div>
        </div>
        <div className="text-center">
          <div className="bg-white bg-opacity-20 rounded-lg p-2 sm:p-3 md:p-4 backdrop-blur-sm">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold">{timeRemaining.hours}</div>
            <div className="text-[10px] sm:text-xs md:text-sm uppercase tracking-tight sm:tracking-wide mt-0.5 sm:mt-1">
              <span className="hidden sm:inline">Hours</span>
              <span className="sm:hidden">Hrs</span>
            </div>
          </div>
        </div>
        <div className="text-center">
          <div className="bg-white bg-opacity-20 rounded-lg p-2 sm:p-3 md:p-4 backdrop-blur-sm">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold">{timeRemaining.minutes}</div>
            <div className="text-[10px] sm:text-xs md:text-sm uppercase tracking-tight sm:tracking-wide mt-0.5 sm:mt-1">
              <span className="hidden sm:inline">Minutes</span>
              <span className="sm:hidden">Min</span>
            </div>
          </div>
        </div>
        <div className="text-center">
          <div className="bg-white bg-opacity-20 rounded-lg p-2 sm:p-3 md:p-4 backdrop-blur-sm">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold">{timeRemaining.seconds}</div>
            <div className="text-[10px] sm:text-xs md:text-sm uppercase tracking-tight sm:tracking-wide mt-0.5 sm:mt-1">
              <span className="hidden sm:inline">Seconds</span>
              <span className="sm:hidden">Sec</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 sm:mt-6 text-center">
        <p className="text-sm sm:text-base md:text-lg">
          {vacation.durationDays} {vacation.durationDays === 1 ? 'day' : 'days'} of adventure awaits!
        </p>
      </div>
    </div>
  );
};
