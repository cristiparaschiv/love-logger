import { create } from 'zustand';
import { RelationshipConfig } from '../types/relationship.types';

interface RelationshipStore {
  config: RelationshipConfig | null;
  isLoading: boolean;
  setConfig: (config: RelationshipConfig | null) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useRelationshipStore = create<RelationshipStore>((set) => ({
  config: null,
  isLoading: false,
  setConfig: (config) => set({ config }),
  setLoading: (isLoading) => set({ isLoading }),
}));
