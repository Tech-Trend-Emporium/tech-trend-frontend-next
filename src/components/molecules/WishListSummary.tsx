"use client";

import { useState } from "react";
import { FiTrash2, FiShoppingCart } from "react-icons/fi";
import type { WishListResponse } from "@/src/models";


interface WishListSummaryProps {
    wishList: WishListResponse;
    onClearWishList: () => Promise<void>;
    onMoveAllToCart?: () => Promise<void>;
}

export const WishListSummary = ({
    wishList,
    onClearWishList,
    onMoveAllToCart,
}: WishListSummaryProps) => {
    const [isClearing, setIsClearing] = useState(false);
    const [isMovingAll, setIsMovingAll] = useState(false);

    const totalValue = wishList.items.reduce((sum, item) => sum + item.price, 0);
    const itemCount = wishList.items.length;

    const handleClear = async () => {
        if (!confirm("Are you sure you want to clear your wish list?")) return;

        setIsClearing(true);
        try {
            await onClearWishList();
        } catch {
            // Error handled in parent
        } finally {
            setIsClearing(false);
        }
    };

    const handleMoveAll = async () => {
        if (!onMoveAllToCart) return;

        setIsMovingAll(true);
        try {
            await onMoveAllToCart();
        } catch {
            // Error handled in parent
        } finally {
            setIsMovingAll(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                Wish List Summary
            </h2>

            {/* Stats */}
            <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Items</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                        {itemCount} {itemCount === 1 ? "item" : "items"}
                    </span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Total Value</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                        ${totalValue.toFixed(2)}
                    </span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Created</span>
                    <span className="text-gray-900 dark:text-gray-100">
                        {wishList.createdAt.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </span>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-700 my-4" />

            {/* Actions */}
            <div className="space-y-3">
                {onMoveAllToCart && (
                    <button
                        onClick={handleMoveAll}
                        disabled={isMovingAll || isClearing || itemCount === 0}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isMovingAll ? (
                            <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <FiShoppingCart className="w-5 h-5" />
                        )}
                        Move All to Cart
                    </button>
                )}

                <button
                    onClick={handleClear}
                    disabled={isClearing || isMovingAll || itemCount === 0}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:border-red-300 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isClearing ? (
                        <span className="inline-block w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                    ) : (
                        <FiTrash2 className="w-5 h-5" />
                    )}
                    Clear Wish List
                </button>
            </div>
        </div>
    );
};