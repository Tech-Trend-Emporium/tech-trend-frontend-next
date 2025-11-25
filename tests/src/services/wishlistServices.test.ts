import { describe, it, expect, vi, beforeEach } from "vitest";
import { WishListService } from "@/src/services/wishlistService";

// Mock manual de http
vi.mock("@/src/lib", () => ({
    http: {
        get: vi.fn(),
        post: vi.fn(),
        delete: vi.fn(),
    },
}));

import { http } from "@/src/lib";

// ------------------------------------------------------
// Datos de prueba
// ------------------------------------------------------
const rawItem = {
    productId: 10,
    name: "Keyboard",
    imageUrl: "img.jpg",
    unitPrice: 120,
    addedAt: "2024-01-10T12:00:00.000Z",
};

const rawWishList = {
    id: 1,
    userId: 99,
    createdAt: "2024-01-01T09:00:00.000Z",
    items: [rawItem],
};

const mappedItem = {
    ...rawItem,
    addedAt: new Date(rawItem.addedAt),
};

const mappedWishList = {
    ...rawWishList,
    createdAt: new Date(rawWishList.createdAt),
    items: [mappedItem],
};

describe("WishListService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ------------------------------------------------------
    // GET
    // ------------------------------------------------------
    it("get → returns mapped wishlist", async () => {
        (http.get as any).mockResolvedValue({ data: rawWishList });

        const result = await WishListService.get();

        expect(http.get).toHaveBeenCalledWith("/WishList");
        expect(result).toEqual(mappedWishList);
    });

    it("get → throws error", async () => {
        (http.get as any).mockRejectedValue(new Error("GET_ERR"));
        await expect(WishListService.get()).rejects.toThrow("GET_ERR");
    });

    // ------------------------------------------------------
    // ADD ITEM
    // ------------------------------------------------------
    it("addItem → posts payload and returns mapped wishlist", async () => {
        (http.post as any).mockResolvedValue({ data: rawWishList });

        const payload = { productId: 10 };
        const result = await WishListService.addItem(payload);

        expect(http.post).toHaveBeenCalledWith("/WishList/items", payload);
        expect(result).toEqual(mappedWishList);
    });

    it("addItem → throws error", async () => {
        (http.post as any).mockRejectedValue(new Error("ADD_ERR"));

        await expect(WishListService.addItem({ productId: 1 })).rejects.toThrow("ADD_ERR");
    });

    // ------------------------------------------------------
    // REMOVE ITEM
    // ------------------------------------------------------
    it("removeItem → deletes and returns mapped wishlist", async () => {
        (http.delete as any).mockResolvedValue({ data: rawWishList });

        const result = await WishListService.removeItem(10);

        expect(http.delete).toHaveBeenCalledWith("/WishList/items/10");
        expect(result).toEqual(mappedWishList);
    });

    it("removeItem → throws error", async () => {
        (http.delete as any).mockRejectedValue(new Error("REMOVE_ERR"));

        await expect(WishListService.removeItem(5)).rejects.toThrow("REMOVE_ERR");
    });

    // ------------------------------------------------------
    // CLEAR
    // ------------------------------------------------------
    it("clear → posts and returns mapped wishlist", async () => {
        (http.post as any).mockResolvedValue({ data: rawWishList });

        const result = await WishListService.clear();

        expect(http.post).toHaveBeenCalledWith("/WishList/clear");
        expect(result).toEqual(mappedWishList);
    });

    it("clear → throws error", async () => {
        (http.post as any).mockRejectedValue(new Error("CLEAR_ERR"));

        await expect(WishListService.clear()).rejects.toThrow("CLEAR_ERR");
    });

    // ------------------------------------------------------
    // MOVE TO CART
    // ------------------------------------------------------
    it("moveToCart → posts and returns void", async () => {
        (http.post as any).mockResolvedValue({ data: undefined });

        const result = await WishListService.moveToCart(20);

        expect(http.post).toHaveBeenCalledWith("/WishList/items/20/move-to-cart");
        expect(result).toBe(undefined);
    });

    it("moveToCart → throws error", async () => {
        (http.post as any).mockRejectedValue(new Error("MOVE_ERR"));

        await expect(WishListService.moveToCart(33)).rejects.toThrow("MOVE_ERR");
    });
});
