import { create } from 'zustand';
import { Score } from '../types/score.types';

interface ScoreState {
  score: Score | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

interface ScoreStore extends ScoreState {
  setScore: (score: Score) => void;
  updateScore: (score: Score) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useScoreStore = create<ScoreStore>((set) => ({
  score: null,
  isLoading: false,
  error: null,
  lastUpdated: null,

  setScore: (score) =>
    set({
      score,
      lastUpdated: new Date(),
    }),

  updateScore: (score) =>
    set({
      score,
      lastUpdated: new Date(),
    }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),
}));
