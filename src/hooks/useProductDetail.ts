"use client";

import { useState, useEffect, useCallback } from "react";
import { ProductService } from "@/src/services";
import type { ProductResponse } from "@/src/models";
import type { ProductDetailData } from "@/src/components";


interface UseProductReturn {
    product: ProductDetailData | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

const toProductDetail = (data: ProductResponse): ProductDetailData => ({
    id: data.id,
    title: data.title,
    price: data.price,
    description: data.description,
    vendor: "Brand Name", 
    category: data.category,
    images: [data.imageUrl],
    ratingRate: data.ratingRate,
    count: data.count,
    freeShipping: true,
    freeReturns: true,
});

export const useProductDetail = (productId: string): UseProductReturn => {
    const [product, setProduct] = useState<ProductDetailData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProduct = useCallback(async () => {
        if (!productId) {
            setError("Invalid product ID");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const id = parseInt(productId, 10);

            if (isNaN(id)) {
                throw new Error("Invalid product ID");
            }

            const data = await ProductService.getById(id);
            setProduct(toProductDetail(data)); 
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to fetch product";
            setError(message);
            setProduct(null);
        } finally {
            setIsLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    return {
        product,
        isLoading,
        error,
        refetch: fetchProduct
    };
};