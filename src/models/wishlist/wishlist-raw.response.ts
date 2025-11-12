import type { WishListItemResponseRaw } from ".";


export interface WishListResponseRaw {
    id: number;
    userId: number;
    createdAt: string; 
    items: WishListItemResponseRaw[];
}