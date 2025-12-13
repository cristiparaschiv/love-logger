import { useEffect, useCallback, useState } from 'react';
import { useScoreStore } from '../store/scoreStore';
import { scoreService } from '../services/score.service';
import { websocketService } from '../services/websocket.service';
import { Score } from '../types/score.types';

export const useScore = () => {
  const { score, isLoading, error, setScore, updateScore, setLoading, setError, clearError } =
    useScoreStore();

  const [isIncrementing, setIsIncrementing] = useState(false);

  // Fetch current score
  const fetchScore = useCallback(async () => {
    setLoading(true);
    clearError();
    try {
      const fetchedScore = await scoreService.getScore();
      setScore(fetchedScore);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch score');
    } finally {
      setLoading(false);
    }
  }, [setLoading, setScore, setError, clearError]);

  // Increment score for logged-in user
  const incrementScore = useCallback(async () => {
    setIsIncrementing(true);
    clearError();
    try {
      const updatedScore = await scoreService.incrementScore();
      updateScore(updatedScore);
      return updatedScore;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to increment score';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      // Keep button disabled briefly to prevent spam
      setTimeout(() => {
        setIsIncrementing(false);
      }, 500);
    }
  }, [updateScore, setError, clearError]);

  // Reset score to 0-0 (for testing/admin)
  const resetScore = useCallback(async () => {
    clearError();
    try {
      const resetScore = await scoreService.resetScore();
      updateScore(resetScore);
      return resetScore;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to reset score';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [updateScore, setError, clearError]);

  // Setup WebSocket listener for real-time score updates
  useEffect(() => {
    const handleScoreUpdated = (data: unknown) => {
      const scoreData = data as { score: Score };
      updateScore(scoreData.score);
    };

    websocketService.on('score:updated', handleScoreUpdated);

    return () => {
      websocketService.off('score:updated', handleScoreUpdated);
    };
  }, [updateScore]);

  // Fetch score on mount
  useEffect(() => {
    fetchScore();
  }, []);

  return {
    score,
    isLoading,
    error,
    isIncrementing,
    fetchScore,
    incrementScore,
    resetScore,
    clearError,
  };
};
