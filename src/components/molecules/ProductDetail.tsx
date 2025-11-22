"use client";

import Image from "next/image";
import { useState } from "react";
import { Button, FavoriteButton, QuantitySelector } from "@/src/components";
import { FiShare2 } from "react-icons/fi";


export interface ProductDetailData {
    id: number;
    title: string;
    price: number;
    description: string;
    vendor: string;
    category: string;
    images: string[];
    ratingRate?: number;
    count?: number;
    freeShipping?: boolean;
    freeReturns?: boolean;
}

export interface ProductDetailProps {
    product: ProductDetailData;
    quantity: number;
    isAddingToCart?: boolean;
    addToCartError?: string | null;
    onQuantityChange: (quantity: number) => void;
    onAddToCart: () => void;
}

export const ProductDetail = ({
    product,
    quantity,
    isAddingToCart = false,
    addToCartError,
    onQuantityChange,
    onAddToCart,
}: ProductDetailProps) => {
    const [selectedImage, setSelectedImage] = useState(0);
    const hasMultipleImages = product.images.length > 1;

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.title,
                    text: product.description,
                    url: window.location.href,
                });
            } catch {
                // User cancelled or share failed silently
            }
        } else {
            // Fallback: copy to clipboard
            await navigator.clipboard.writeText(window.location.href);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
            {/* Image Gallery */}
            <div className="flex flex-col-reverse sm:flex-row gap-4">
                {/* Thumbnails */}
                {hasMultipleImages && (
                    <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:max-h-[600px] pb-2 sm:pb-0 sm:pr-2 scrollbar-thin">
                        {product.images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedImage(idx)}
                                className={`relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700
                                    ring-2 transition-all ${selectedImage === idx
                                        ? "ring-gray-900 dark:ring-gray-100"
                                        : "ring-transparent hover:ring-gray-300 dark:hover:ring-gray-600"
                                    }`}
                            >
                                <Image
                                    src={img}
                                    alt={`${product.title} thumbnail ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="96px"
                                />
                            </button>
                        ))}
                    </div>
                )}

                {/* Main Image */}
                <div className="flex-1 relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm">
                    <Image
                        src={product.images[selectedImage]}
                        alt={product.title}
                        fill
                        className="object-contain p-4 sm:p-8"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority
                    />
                </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-2">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">
                        {product.title}
                    </h1>
                    <div className="flex items-center gap-1 shrink-0">
                        <FavoriteButton productId={product.id} />
                        <button
                            onClick={handleShare}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Share product"
                        >
                            <FiShare2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Price */}
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                    ${product.price.toFixed(2)}
                </p>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 italic">
                    {product.description}
                </p>

                {/* Error message */}
                {addToCartError && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-sm text-red-600 dark:text-red-400">{addToCartError}</p>
                    </div>
                )}

                {/* Add to Cart Row */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4 mb-6">
                    <div className="flex-1">
                        <Button
                            variant="dark"
                            fullWidth
                            onClick={onAddToCart}
                            disabled={isAddingToCart}
                            isLoading={isAddingToCart}
                            className="h-12 sm:h-14 text-base sm:text-lg font-semibold"
                        >
                            Add to Cart - ${(product.price * quantity).toFixed(2)}
                        </Button>
                    </div>
                    <QuantitySelector
                        quantity={quantity}
                        onChange={onQuantityChange}
                    />
                </div>

                {/* Shipping Info */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
                    {product.freeShipping !== false && (
                        <span className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                            Free standard shipping
                        </span>
                    )}
                    {product.freeReturns !== false && (
                        <span
                            className="flex items-center gap-1.5"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                            </svg>
                            Free Returns
                        </span>
                    )}
                </div>

                {/* Rating (optional) */}
                {product.ratingRate !== undefined && (
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                        key={star}
                                        className={`w-5 h-5 ${star <= Math.round(product.ratingRate!)
                                                ? "text-yellow-400"
                                                : "text-gray-300 dark:text-gray-600"
                                            }`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {product.ratingRate.toFixed(1)} ({product.count} reviews)
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};