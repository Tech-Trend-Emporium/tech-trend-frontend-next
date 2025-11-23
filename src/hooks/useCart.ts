"use client";

import { useState, useEffect, useCallback } from "react";
import { CartService } from "@/src/services";
import type { CartResponse, AddCartItemRequest, UpdateCartItemRequest } from "@/src/models";


interface UseCartReturn {
    cart: CartResponse | null;
    isLoading: boolean;
    error: string | null;
    itemCount: number;
    addItem: (req: AddCartItemRequest) => Promise<void>;
    updateQuantity: (req: UpdateCartItemRequest) => Promise<void>;
    removeItem: (productId: number) => Promise<void>;
    clearCart: () => Promise<void>;
    applyCoupon: (code: string) => Promise<void>;
    removeCoupon: () => Promise<void>;
    refreshCart: () => Promise<void>;
}

export const useCart = (): UseCartReturn => {
    const [cart, setCart] = useState<CartResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

    const refreshCart = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await CartService.get();
            setCart(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load cart");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    const addItem = useCallback(async (req: AddCartItemRequest) => {
        try {
            setError(null);
            const data = await CartService.addItem(req);
            setCart(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to add item");
            throw err;
        }
    }, []);

    const updateQuantity = useCallback(async (req: UpdateCartItemRequest) => {
        try {
            setError(null);
            const data = await CartService.updateQuantity(req);
            setCart(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update quantity");
            throw err;
        }
    }, []);

    const removeItem = useCallback(async (productId: number) => {
        try {
            setError(null);
            const data = await CartService.removeItem(productId);
            setCart(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to remove item");
            throw err;
        }
    }, []);

    const clearCart = useCallback(async () => {
        try {
            setError(null);
            const data = await CartService.clear();
            setCart(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to clear cart");
            throw err;
        }
    }, []);

    const applyCoupon = useCallback(async (code: string) => {
        try {
            setError(null);
            const data = await CartService.applyCoupon({ couponCode: code });
            setCart(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Invalid coupon code");
            throw err;
        }
    }, []);

    const removeCoupon = useCallback(async () => {
        try {
            setError(null);
            const data = await CartService.removeCoupon();
            setCart(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to remove coupon");
            throw err;
        }
    }, []);

    return {
        cart, isLoading, error, itemCount,
        addItem, updateQuantity, removeItem,
        clearCart, applyCoupon, removeCoupon, refreshCart,
    };
};