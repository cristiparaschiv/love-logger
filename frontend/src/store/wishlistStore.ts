import { create } from 'zustand';
import { WishlistItem } from '../types/wishlist.types';

interface WishlistStore {
  items: WishlistItem[];
  isLoading: boolean;
  error: string | null;
  setItems: (items: WishlistItem[]) => void;
  addItem: (item: WishlistItem) => void;
  updateItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

const sortItems = (items: WishlistItem[]) =>
  [...items].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

export const useWishlistStore = create<WishlistStore>((set) => ({
  items: [],
  isLoading: false,
  error: null,

  setItems: (items) => set({ items: sortItems(items) }),
  addItem: (item) =>
    set((state) => {
      if (state.items.find((i) => i.id === item.id)) return state;
      return { items: sortItems([...state.items, item]) };
    }),
  updateItem: (updatedItem) =>
    set((state) => ({
      items: sortItems(state.items.map((i) => (i.id === updatedItem.id ? updatedItem : i))),
    })),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
