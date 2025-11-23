"use client";

import { useState } from "react";
import { useCart } from "@/src/hooks/useCart";


interface AddToCartButtonProps {
    productId: number;
    quantity?: number;
    variant?: "icon" | "full" | "card";
    className?: string;
}

export const AddToCartButton = ({
    productId,
    quantity = 1,
    variant = "full",
    className = ""
}: AddToCartButtonProps) => {
    const { addItem } = useCart();
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setIsLoading(true);
        try {
            await addItem({ productId, quantity });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 2000);
        } catch {
            // Error handled by hook
        } finally {
            setIsLoading(false);
        }
    };

    // Card variant - matches FavoriteButton style
    if (variant === "card") {
        return (
            <button
                onClick={handleAddToCart}
                disabled={isLoading}
                className={`p-2 rounded-full bg-white/90 dark:bg-gray-700/90 
                    hover:bg-white dark:hover:bg-gray-600 transition-all duration-200 
                    shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50 
                    disabled:cursor-not-allowed ${className}`}
                aria-label="Add to cart"
            >
                {isLoading ? (
                    <svg className="animate-spin w-5 h-5 text-gray-600 dark:text-gray-300" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                ) : success ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-green-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-gray-600 dark:text-gray-300"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                )}
            </button>
        );
    }

    // Icon variant
    if (variant === "icon") {
        return (
            <button
                onClick={handleAddToCart}
                disabled={isLoading}
                className={`p-2 rounded-lg transition-all ${success
                        ? "bg-green-500 text-white"
                        : "bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 hover:bg-gray-700 dark:hover:bg-gray-300"
                    } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
                aria-label="Add to cart"
            >
                {isLoading ? (
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                ) : success ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                )}
            </button>
        );
    }

    // Full variant (default)
    return (
        <button
            onClick={handleAddToCart}
            disabled={isLoading}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${success
                    ? "bg-green-500 text-white"
                    : "bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 hover:bg-gray-700 dark:hover:bg-gray-300"
                } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
            {isLoading ? (
                <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Adding...
                </>
            ) : success ? (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Added!
                </>
            ) : (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                    Add to Cart
                </>
            )}
        </button>
    );
};