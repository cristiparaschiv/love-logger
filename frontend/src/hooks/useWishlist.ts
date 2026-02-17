import { useCallback, useEffect } from 'react';
import { useWishlistStore } from '../store/wishlistStore';
import { wishlistService } from '../services/wishlist.service';
import { websocketService } from '../services/websocket.service';
import { CreateWishlistItemRequest, UpdateWishlistItemRequest, WishlistItem } from '../types/wishlist.types';

export const useWishlist = () => {
  const {
    items,
    isLoading,
    error,
    setItems,
    addItem,
    updateItem,
    removeItem,
    setLoading,
    setError,
    clearError,
  } = useWishlistStore();

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await wishlistService.getAllItems();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  }, [setItems, setLoading, setError]);

  const createItem = useCallback(
    async (data: CreateWishlistItemRequest) => {
      try {
        const item = await wishlistService.createItem(data);
        addItem(item);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create item');
        throw err;
      }
    },
    [addItem, setError]
  );

  const updateItemById = useCallback(
    async (id: string, data: UpdateWishlistItemRequest) => {
      try {
        const item = await wishlistService.updateItem(id, data);
        updateItem(item);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update item');
        throw err;
      }
    },
    [updateItem, setError]
  );

  const deleteItem = useCallback(
    async (id: string) => {
      try {
        await wishlistService.deleteItem(id);
        removeItem(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete item');
        throw err;
      }
    },
    [removeItem, setError]
  );

  useEffect(() => {
    const handleCreated = (data: unknown) => addItem((data as { item: WishlistItem }).item);
    const handleUpdated = (data: unknown) => updateItem((data as { item: WishlistItem }).item);
    const handleDeleted = (data: unknown) => removeItem((data as { id: string }).id);

    websocketService.on('wishlist:created', handleCreated);
    websocketService.on('wishlist:updated', handleUpdated);
    websocketService.on('wishlist:deleted', handleDeleted);

    return () => {
      websocketService.off('wishlist:created', handleCreated);
      websocketService.off('wishlist:updated', handleUpdated);
      websocketService.off('wishlist:deleted', handleDeleted);
    };
  }, [addItem, updateItem, removeItem]);

  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    isLoading,
    error,
    fetchItems,
    createItem,
    updateItem: updateItemById,
    deleteItem,
    clearError,
  };
};
