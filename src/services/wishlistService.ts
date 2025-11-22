import { http } from "@/src/lib";
import type { AddWishListItemRequest, WishListItemResponse, WishListItemResponseRaw, WishListResponse, WishListResponseRaw } from "@/src/models";


const BASE = "/WishList";

const mapItem = (i: WishListItemResponseRaw): WishListItemResponse => ({
    ...i,
    addedAt: new Date(i.addedAt),
});
const mapWishList = (w: WishListResponseRaw): WishListResponse => ({
    ...w,
    createdAt: new Date(w.createdAt),
    items: w.items.map(mapItem),
});

export const WishListService = {
    get: () => {
        return http.get<WishListResponseRaw>(`${ BASE }`).then(r => mapWishList(r.data));
    },

    addItem: (payload: AddWishListItemRequest) => {
        return http.post<WishListResponseRaw>(`${ BASE }/items`, payload).then(r => mapWishList(r.data));
    },

    removeItem: (productId: number) => {
        return http.delete<WishListResponseRaw>(`${ BASE }/items/${ productId }`).then(r => mapWishList(r.data));
    },

    clear: () => {
        return http.post<WishListResponseRaw>(`${ BASE }/clear`).then(r => mapWishList(r.data));
    },

    moveToCart: (productId: number) => {
        return http.post<void>(`${ BASE }/items/${ productId }/move-to-cart`).then(r => r.data);
    },
};