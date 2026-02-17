import { apiService } from './api.service';
import { WishlistItem, WishlistItemsResponse, WishlistItemResponse, CreateWishlistItemRequest, UpdateWishlistItemRequest } from '../types/wishlist.types';

class WishlistService {
  private readonly BASE_PATH = '/wishlist';

  async getAllItems(): Promise<WishlistItem[]> {
    const response = await apiService.get<WishlistItemsResponse>(this.BASE_PATH);
    return response.items;
  }

  async createItem(data: CreateWishlistItemRequest): Promise<WishlistItem> {
    const response = await apiService.post<WishlistItemResponse>(this.BASE_PATH, data);
    return response.item;
  }

  async updateItem(id: string, data: UpdateWishlistItemRequest): Promise<WishlistItem> {
    const response = await apiService.put<WishlistItemResponse>(`${this.BASE_PATH}/${id}`, data);
    return response.item;
  }

  async deleteItem(id: string): Promise<void> {
    await apiService.delete(`${this.BASE_PATH}/${id}`);
  }
}

export const wishlistService = new WishlistService();
