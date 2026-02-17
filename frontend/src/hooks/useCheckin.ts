import { useCallback, useEffect } from 'react';
import { useCheckinStore } from '../store/checkinStore';
import { checkinApiService } from '../services/checkin.service';
import { websocketService } from '../services/websocket.service';

export const useCheckin = () => {
  const {
    question,
    myCheckin,
    partnerCheckin,
    partnerCompleted,
    bothCompleted,
    history,
    isLoading,
    error,
    setTodayData,
    setHistory,
    setLoading,
    setError,
  } = useCheckinStore();

  const fetchToday = useCallback(async () => {
    setLoading(true);
    try {
      const data = await checkinApiService.getToday();
      setTodayData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load check-in');
    } finally {
      setLoading(false);
    }
  }, [setTodayData, setLoading, setError]);

  const submitCheckin = useCallback(
    async (mood: number, answer: string) => {
      try {
        const data = await checkinApiService.submit(mood, answer);
        setTodayData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to submit check-in');
        throw err;
      }
    },
    [setTodayData, setError]
  );

  const fetchHistory = useCallback(
    async (days: number = 30) => {
      try {
        const data = await checkinApiService.getHistory(days);
        setHistory(data.entries);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load history');
      }
    },
    [setHistory, setError]
  );

  // Listen for partner's checkin via websocket
  useEffect(() => {
    const handleCheckinSubmitted = () => {
      // Re-fetch today's data to get reveal if both completed
      fetchToday();
    };

    websocketService.on('checkin:submitted', handleCheckinSubmitted);
    return () => {
      websocketService.off('checkin:submitted', handleCheckinSubmitted);
    };
  }, [fetchToday]);

  // Fetch on mount
  useEffect(() => {
    fetchToday();
  }, []);

  return {
    question,
    myCheckin,
    partnerCheckin,
    partnerCompleted,
    bothCompleted,
    history,
    isLoading,
    error,
    fetchToday,
    submitCheckin,
    fetchHistory,
  };
};
