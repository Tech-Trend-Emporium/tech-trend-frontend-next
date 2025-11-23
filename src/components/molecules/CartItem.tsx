"use client";

import { useState } from "react";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import type { CartItemResponse } from "@/src/models";
import Image from "next/image";


interface CartItemProps {
    item: CartItemResponse;
    onUpdateQuantity: (productId: number, quantity: number) => Promise<void>;
    onRemove: (productId: number) => Promise<void>;
}

export const CartItem = ({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);

    const handleQuantityChange = async (delta: number) => {
        const newQty = item.quantity + delta;
        if (newQty < 1) return;
        setIsUpdating(true);
        try {
            await onUpdateQuantity(item.productId, newQty);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleRemove = async () => {
        setIsRemoving(true);
        try {
            await onRemove(item.productId);
        } finally {
            setIsRemoving(false);
        }
    };

    const formatPrice = (price: number) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);

    return (
        <div className={`flex flex-col sm:flex-row gap-4 p-4 sm:p-5 bg-white dark:bg-gray-800/80 rounded-xl shadow-sm ring-1 ring-gray-200 dark:ring-gray-700/60 transition-opacity ${isRemoving ? "opacity-50" : ""}`}>
            {/* Product Image Placeholder */}
            <div className="w-full sm:w-24 h-32 sm:h-24 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center shrink-0">
                <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={96}
                    height={96}
                    className="w-20 h-20 object-contain"
                />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {item.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Unit price: {formatPrice(item.unitPrice)}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center rounded-lg ring-1 ring-gray-200 dark:ring-gray-600">
                        <button
                            onClick={() => handleQuantityChange(-1)}
                            disabled={isUpdating || item.quantity <= 1}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            aria-label="Decrease quantity"
                        >
                            <FiMinus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 min-w-12 text-center">
                            {isUpdating ? "..." : item.quantity}
                        </span>
                        <button
                            onClick={() => handleQuantityChange(1)}
                            disabled={isUpdating}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            aria-label="Increase quantity"
                        >
                            <FiPlus className="w-4 h-4" />
                        </button>
                    </div>

                    <button
                        onClick={handleRemove}
                        disabled={isRemoving}
                        className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                        aria-label="Remove item"
                    >
                        <FiTrash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Line Total */}
            <div className="text-right sm:text-right flex sm:flex-col justify-between sm:justify-start items-center sm:items-end">
                <span className="text-sm text-gray-500 dark:text-gray-400 sm:hidden">Total:</span>
                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {formatPrice(item.lineTotal)}
                </span>
            </div>
        </div>
    );
};