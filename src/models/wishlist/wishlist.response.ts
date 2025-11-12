import type { WishListItemResponse, WishListResponseRaw } from ".";


export type WishListResponse = Omit<WishListResponseRaw, "createdAt" | "items"> & {
    createdAt: Date;
    items: WishListItemResponse[];
};