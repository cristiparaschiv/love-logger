import { create } from 'zustand';
import { Vacation, VacationState } from '../types/vacation.types';

interface VacationStore extends VacationState {
  setVacations: (vacations: Vacation[]) => void;
  addVacation: (vacation: Vacation) => void;
  updateVacation: (vacation: Vacation) => void;
  removeVacation: (id: string) => void;
  setSelectedVacation: (vacation: Vacation | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  categorizeVacations: (vacations: Vacation[]) => void;
}

export const useVacationStore = create<VacationStore>((set) => ({
  vacations: [],
  upcomingVacations: [],
  pastVacations: [],
  selectedVacation: null,
  isLoading: false,
  error: null,

  setVacations: (vacations) => {
    const now = new Date();
    const upcoming = vacations
      .filter((v) => new Date(v.startDate) >= now)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    const past = vacations
      .filter((v) => new Date(v.startDate) < now)
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

    set({
      vacations,
      upcomingVacations: upcoming,
      pastVacations: past,
    });
  },

  addVacation: (vacation) =>
    set((state) => {
      // Check if vacation already exists to prevent duplicates
      if (state.vacations.find((v) => v.id === vacation.id)) {
        return state;
      }

      const newVacations = [vacation, ...state.vacations];
      const now = new Date();
      const upcoming = newVacations
        .filter((v) => new Date(v.startDate) >= now)
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      const past = newVacations
        .filter((v) => new Date(v.startDate) < now)
        .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

      return {
        vacations: newVacations,
        upcomingVacations: upcoming,
        pastVacations: past,
      };
    }),

  updateVacation: (updatedVacation) =>
    set((state) => {
      const newVacations = state.vacations.map((vacation) =>
        vacation.id === updatedVacation.id ? updatedVacation : vacation
      );

      const now = new Date();
      const upcoming = newVacations
        .filter((v) => new Date(v.startDate) >= now)
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      const past = newVacations
        .filter((v) => new Date(v.startDate) < now)
        .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

      return {
        vacations: newVacations,
        upcomingVacations: upcoming,
        pastVacations: past,
        selectedVacation:
          state.selectedVacation?.id === updatedVacation.id ? updatedVacation : state.selectedVacation,
      };
    }),

  removeVacation: (id) =>
    set((state) => {
      const newVacations = state.vacations.filter((vacation) => vacation.id !== id);
      const now = new Date();
      const upcoming = newVacations
        .filter((v) => new Date(v.startDate) >= now)
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      const past = newVacations
        .filter((v) => new Date(v.startDate) < now)
        .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

      return {
        vacations: newVacations,
        upcomingVacations: upcoming,
        pastVacations: past,
        selectedVacation: state.selectedVacation?.id === id ? null : state.selectedVacation,
      };
    }),

  setSelectedVacation: (vacation) => set({ selectedVacation: vacation }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  categorizeVacations: (vacations) => {
    const now = new Date();
    const upcoming = vacations
      .filter((v) => new Date(v.startDate) >= now)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    const past = vacations
      .filter((v) => new Date(v.startDate) < now)
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

    set({
      upcomingVacations: upcoming,
      pastVacations: past,
    });
  },
}));
