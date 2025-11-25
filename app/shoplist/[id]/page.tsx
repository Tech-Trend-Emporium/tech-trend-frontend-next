"use client";

import { memo, useCallback, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProductDetail } from "@/src/components";
import { useCart, useProductDetail } from "@/src/hooks";
import { FiArrowLeft } from "react-icons/fi";


const ProductDetailPageInner = () => {
    const router = useRouter();
    const { id } = useParams<{ id: string }>();
    const { product, isLoading, error } = useProductDetail(id);
    const { addItem } = useCart();

    const [quantity, setQuantity] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [addToCartError, setAddToCartError] = useState<string | null>(null);

    const handleQuantityChange = useCallback((newQuantity: number) => {
        if (newQuantity >= 1 && newQuantity <= 99) setQuantity(newQuantity);
    }, []);

    const handleAddToCart = useCallback(async () => {
        if (!product) return;
        setIsAddingToCart(true);
        setAddToCartError(null);
        try {
            await addItem({ productId: product.id, quantity });
        } catch (err) {
            setAddToCartError(err instanceof Error ? err.message : "Failed to add to cart");
        } finally {
            setIsAddingToCart(false);
        }
    }, [product, quantity, addItem]);

    const handleGoBack = useCallback(() => router.back(), [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-6 sm:py-10">
                    <div className="animate-pulse">
                        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-8" />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                            <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-2xl" />
                            <div className="space-y-4">
                                <div className="h-10 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
                                <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                                <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded" />
                                <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
                                <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-lg mt-8" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
                <div className="text-center">
                    <svg className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Product not found</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {error || "The product you're looking for doesn't exist or has been removed."}
                    </p>
                    <button
                        onClick={handleGoBack}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 rounded-lg hover:opacity-90 transition-opacity"
                    >
                        <FiArrowLeft className="w-4 h-4" />
                        Go back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-6 sm:py-10">
                <nav className="mb-6 sm:mb-8">
                    <button
                        onClick={handleGoBack}
                        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                    >
                        <FiArrowLeft className="w-4 h-4" />
                        Back to products
                    </button>
                </nav>

                <ProductDetail
                    product={product}
                    quantity={quantity}
                    isAddingToCart={isAddingToCart}
                    addToCartError={addToCartError}
                    onQuantityChange={handleQuantityChange}
                    onAddToCart={handleAddToCart}
                />
            </div>
        </div>
    );
}

export default memo(ProductDetailPageInner);