"use client";

import { useEffect, useState } from "react";
import type { ProductResponse } from "@/src/models";
import { getFavoritesArray, onFavoritesChanged } from "@/src/utils";
import { ProductService } from "@/src/services";


interface UseFavoritesReturn {
    favoriteProducts: ProductResponse[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export const useFavorites = (): UseFavoritesReturn => {
    const [favoriteProducts, setFavoriteProducts] = useState<ProductResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadFavorites = async () => {
        try {
            setLoading(true);
            setError(null);

            const favoriteIds = getFavoritesArray();

            if (favoriteIds.length === 0) {
                setFavoriteProducts([]);
                setLoading(false);
                return;
            }

            const productPromises = favoriteIds.map((id) =>
                ProductService.getById(id).catch((err) => {
                    console.error(`Error loading product ${id}:`, err);
                    return null;
                })
            );

            const loadedProducts = await Promise.all(productPromises);
            const validProducts = loadedProducts.filter((p): p is ProductResponse => p !== null);

            setFavoriteProducts(validProducts);
        } catch (err) {
            console.error("Error loading favorites:", err);
            setError("Can't load favorite products. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFavorites();

        const unsubscribe = onFavoritesChanged(() => {
            loadFavorites();
        });

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "favorites") {
                loadFavorites();
            }
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            unsubscribe();
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    return {
        favoriteProducts,
        loading,
        error,
        refetch: loadFavorites,
    };
};