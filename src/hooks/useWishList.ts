"use client";

import { useState, useEffect, useCallback } from "react";
import { WishListService } from "@/src/services";
import type { WishListResponse } from "@/src/models";


interface UseWishListReturn {
    wishList: WishListResponse | null;
    isLoading: boolean;
    error: string | null;
    itemCount: number;
    isInWishList: (productId: number) => boolean;
    addItem: (productId: number) => Promise<void>;
    removeItem: (productId: number) => Promise<void>;
    toggleItem: (productId: number) => Promise<void>;
    clearWishList: () => Promise<void>;
    moveToCart: (productId: number) => Promise<void>;
    refreshWishList: () => Promise<void>;
}

export const useWishList = (): UseWishListReturn => {
    const [wishList, setWishList] = useState<WishListResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const itemCount = wishList?.items.length ?? 0;

    const refreshWishList = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await WishListService.get();
            setWishList(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load wish list");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshWishList();
    }, [refreshWishList]);

    const isInWishList = useCallback((productId: number): boolean => {
        return wishList?.items.some(item => item.productId === productId) ?? false;
    }, [wishList]);

    const addItem = useCallback(async (productId: number) => {
        try {
            setError(null);
            const data = await WishListService.addItem({ productId });
            setWishList(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to add item");
            throw err;
        }
    }, []);

    const removeItem = useCallback(async (productId: number) => {
        try {
            setError(null);
            const data = await WishListService.removeItem(productId);
            setWishList(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to remove item");
            throw err;
        }
    }, []);

    const toggleItem = useCallback(async (productId: number) => {
        if (isInWishList(productId)) {
            await removeItem(productId);
        } else {
            await addItem(productId);
        }
    }, [isInWishList, addItem, removeItem]);

    const clearWishList = useCallback(async () => {
        try {
            setError(null);
            const data = await WishListService.clear();
            setWishList(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to clear wish list");
            throw err;
        }
    }, []);

    const moveToCart = useCallback(async (productId: number) => {
        try {
            setError(null);
            await WishListService.moveToCart(productId);
            setWishList(prev => prev ? {
                ...prev,
                items: prev.items.filter(item => item.productId !== productId)
            } : null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to move item to cart");
            throw err;
        }
    }, []);

    return {
        wishList,
        isLoading,
        error,
        itemCount,
        isInWishList,
        addItem,
        removeItem,
        toggleItem,
        clearWishList,
        moveToCart,
        refreshWishList,
    };
};