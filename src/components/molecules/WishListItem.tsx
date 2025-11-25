"use client";

import { memo, useMemo, useCallback, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiTrash2, FiShoppingCart } from "react-icons/fi";
import type { WishListItemResponse } from "@/src/models";


interface WishListItemProps {
    item: WishListItemResponse;
    productImage?: string;
    onMoveToCart: (productId: number) => Promise<void>;
    onRemove: (productId: number) => Promise<void>;
}

const WishListItemInner = ({ item, productImage, onMoveToCart, onRemove }: WishListItemProps) => {
    const router = useRouter();
    const [state, setState] = useStateFlags();

    const navigate = useCallback(() => {
        router.push(`/shoplist/${item.productId}`);
    }, [router, item.productId]);

    const formattedDate = useMemo(
        () =>
            item.addedAt.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            }),
        [item.addedAt]
    );

    const handleMoveToCart = useCallback(
        async (e: React.MouseEvent) => {
            e.stopPropagation();
            setState((s) => ({ ...s, moving: true }));
            try {
                await onMoveToCart(item.productId);
            } finally {
                setState((s) => ({ ...s, moving: false }));
            }
        },
        [onMoveToCart, item.productId, setState]
    );

    const handleRemove = useCallback(
        async (e: React.MouseEvent) => {
            e.stopPropagation();
            setState((s) => ({ ...s, removing: true }));
            try {
                await onRemove(item.productId);
            } finally {
                setState((s) => ({ ...s, removing: false }));
            }
        },
        [onRemove, item.productId, setState]
    );

    return (
        <div
            onClick={navigate}
            className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 hover:shadow-md hover:ring-gray-300 dark:hover:ring-gray-600 transition-all cursor-pointer"
        >
            {/* Product Image */}
            <div className="relative w-full sm:w-24 h-32 sm:h-24 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shrink-0">
                {productImage ? (
                    <Image
                        src={productImage ?? item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-contain p-2"
                        sizes="(max-width: 640px) 100vw, 96px"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <FiShoppingCart className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {item.name}
                </h3>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-1">
                    ${item.unitPrice.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Added {formattedDate}</p>
            </div>

            {/* Actions */}
            <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto">
                <button
                    onClick={handleMoveToCart}
                    disabled={state.moving || state.removing}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium text-sm hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {state.moving ? (
                        <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <FiShoppingCart className="w-4 h-4" />
                    )}
                    <span className="sm:hidden lg:inline">Move to Cart</span>
                </button>

                <button
                    onClick={handleRemove}
                    disabled={state.moving || state.removing}
                    className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Remove from wish list"
                >
                    {state.removing ? (
                        <span className="inline-block w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                    ) : (
                        <FiTrash2 className="w-5 h-5" />
                    )}
                </button>
            </div>
        </div>
    );
};

const useStateFlags = () => {
    const [flags, setFlags] = useState({ moving: false, removing: false });
    return [flags, setFlags] as const;
};

const areEqual = (prev: Readonly<WishListItemProps>, next: Readonly<WishListItemProps>) => {
    const a = prev.item;
    const b = next.item;
    const sameItem =
        a.productId === b.productId &&
        a.name === b.name &&
        a.unitPrice === b.unitPrice &&
        a.imageUrl === b.imageUrl &&
        a.addedAt.getTime() === b.addedAt.getTime();

    return (
        sameItem &&
        prev.productImage === next.productImage &&
        prev.onMoveToCart === next.onMoveToCart &&
        prev.onRemove === next.onRemove
    );
};

export const WishListItem = memo(WishListItemInner, areEqual);