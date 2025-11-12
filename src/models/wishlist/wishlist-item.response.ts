import type { WishListItemResponseRaw } from ".";


export type WishListItemResponse = Omit<WishListItemResponseRaw, "addedAt"> & {
    addedAt: Date;
};