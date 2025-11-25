"use client";

import { memo, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useWishList } from "@/src/hooks";
import { useCart } from "@/src/hooks";
import { WishListItem, WishListSummary, EmptyWishList } from "@/src/components";
import { FiArrowLeft } from "react-icons/fi";


const WishListPageInner = () => {
    const router = useRouter();
    const { wishList, isLoading, error, removeItem, moveToCart, clearWishList } = useWishList();
    const { refreshCart } = useCart();

    const items = useMemo(() => wishList?.items ?? [], [wishList]);
    const hasItems = items.length > 0;

    const handleMoveToCart = useCallback(
        async (productId: number) => {
            await moveToCart(productId);
            await refreshCart();
        },
        [moveToCart, refreshCart]
    );

    const handleMoveAllToCart = useCallback(async () => {
        if (!hasItems) return;
        for (const it of items) {
            await moveToCart(it.productId);
        }
        await refreshCart();
    }, [hasItems, items, moveToCart, refreshCart]);

    const handleRemove = useCallback((productId: number) => removeItem(productId), [removeItem]);

    // Loading
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-10">
                <div className="max-w-6xl mx-auto animate-pulse">
                    <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                    <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-8" />
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-28 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                            ))}
                        </div>
                        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
                    </div>
                </div>
            </div>
        );
    }

    // Error
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Something went wrong</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors mb-4"
                    >
                        <FiArrowLeft className="w-4 h-4" />
                        Continue Shopping
                    </button>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">My Wish List</h1>
                    {hasItems && (
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            {items.length} item{items.length !== 1 ? "s" : ""} saved for later
                        </p>
                    )}
                </div>

                {/* Content */}
                {hasItems ? (
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
                        {/* Items */}
                        <div className="space-y-4">
                            {items.map((item) => (
                                <WishListItem
                                    key={item.productId}
                                    item={item}
                                    onMoveToCart={handleMoveToCart}
                                    onRemove={handleRemove}
                                    productImage={item.imageUrl}
                                />
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="lg:sticky lg:top-8 h-fit">
                            <WishListSummary
                                wishList={wishList!}
                                onClearWishList={clearWishList}
                                onMoveAllToCart={handleMoveAllToCart}
                            />
                        </div>
                    </div>
                ) : (
                    <EmptyWishList />
                )}
            </div>
        </div>
    );
}

export default memo(WishListPageInner);