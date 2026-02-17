import { create } from 'zustand';
import { DailyQuestion, CheckinAnswer, CheckinHistoryEntry } from '../types/checkin.types';

interface CheckinStore {
  question: DailyQuestion | null;
  myCheckin: CheckinAnswer | null;
  partnerCheckin: CheckinAnswer | null;
  partnerCompleted: boolean;
  bothCompleted: boolean;
  history: CheckinHistoryEntry[];
  isLoading: boolean;
  error: string | null;

  setTodayData: (data: {
    question: DailyQuestion;
    myCheckin: CheckinAnswer | null;
    partnerCheckin: CheckinAnswer | null;
    partnerCompleted: boolean;
    bothCompleted: boolean;
  }) => void;
  setHistory: (entries: CheckinHistoryEntry[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCheckinStore = create<CheckinStore>((set) => ({
  question: null,
  myCheckin: null,
  partnerCheckin: null,
  partnerCompleted: false,
  bothCompleted: false,
  history: [],
  isLoading: false,
  error: null,

  setTodayData: (data) => set({
    question: data.question,
    myCheckin: data.myCheckin,
    partnerCheckin: data.partnerCheckin,
    partnerCompleted: data.partnerCompleted,
    bothCompleted: data.bothCompleted,
  }),
  setHistory: (entries) => set({ history: entries }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
