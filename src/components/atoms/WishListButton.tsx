"use client";

import { useState } from "react";
import { useWishList } from "@/src/hooks";
import { useAuth } from "@/src/auth";
import { FiGift } from "react-icons/fi";


interface WishListButtonProps {
    productId: number;
    variant?: "icon" | "card" | "full";
    className?: string;
}

export const WishListButton = ({
    productId,
    variant = "icon",
    className = ""
}: WishListButtonProps) => {
    const { auth } = useAuth();
    const { isInWishList, toggleItem } = useWishList();
    const [isLoading, setIsLoading] = useState(false);

    const isInList = isInWishList(productId);

    const handleClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        if (!auth.isAuthenticated) return;

        setIsLoading(true);
        try {
            await toggleItem(productId);
        } catch {
            // Error handled in hook
        } finally {
            setIsLoading(false);
        }
    };

    if (!auth.isAuthenticated) return null;

    if (variant === "icon" || variant === "card") {
        return (
            <button
                onClick={handleClick}
                disabled={isLoading}
                className={`p-2 rounded-full transition-all duration-200 cursor-pointer
                ${isInList
                                ? "bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400"
                                : "bg-white/90 dark:bg-gray-700/90 text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400"
                            }
                ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-110"}
                ${className}`}
                aria-label={isInList ? "Remove from wish list" : "Add to wish list"}
            >
                <FiGift className={`w-5 h-5 ${isLoading ? "animate-pulse" : ""}`} />
            </button>
        );
    }

    return (
        <button
            onClick={handleClick}
            disabled={isLoading}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer
                ${isInList
                            ? "bg-purple-600 text-white hover:bg-purple-700"
                            : "bg-white/90 dark:bg-gray-700/90 text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400"
                        }
                ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
                ${className}`}
        >
            <FiGift className={`w-5 h-5 ${isLoading ? "animate-pulse" : ""}`} />
            <span>{isInList ? "In Wish List" : "Add to Wish List"}</span>
        </button>
    );
};