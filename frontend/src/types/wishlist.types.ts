export interface WishlistItem {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  completedAt: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWishlistItemRequest {
  title: string;
  description?: string;
}

export interface UpdateWishlistItemRequest {
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface WishlistItemsResponse {
  items: WishlistItem[];
}

export interface WishlistItemResponse {
  item: WishlistItem;
}
