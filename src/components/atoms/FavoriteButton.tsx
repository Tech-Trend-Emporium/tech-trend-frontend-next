"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { isFavorite, toggleFavorite, onFavoritesChanged } from "@/src/utils";


interface FavoriteButtonProps {
    productId: number;
    className?: string;
}

const FavoriteButtonInner = ({ productId, className = "" }: FavoriteButtonProps) => {
    const [favorite, setFavorite] = useState(false);

    useEffect(() => {
        const update = () => setFavorite(isFavorite(productId));
        update();
        const unsubscribe = onFavoritesChanged(update);
        return unsubscribe;
    }, [productId]);

    const handleToggle = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setFavorite(toggleFavorite(productId));
    }, [productId]);

    return (
        <button
            onClick={handleToggle}
            className={`p-2 rounded-full bg-white/90 dark:bg-gray-700/90 
        hover:bg-white dark:hover:bg-gray-600 transition-all duration-200 
        shadow-sm hover:shadow-md cursor-pointer ${className}`}
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-5 h-5 transition-colors duration-200 ${favorite ? "fill-red-500 stroke-red-500" : "fill-none stroke-gray-600 dark:stroke-gray-300"
                    }`}
                viewBox="0 0 24 24"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
        </button>
    );
};

const areEqualFav = (prev: Readonly<FavoriteButtonProps>, next: Readonly<FavoriteButtonProps>) => {
    return prev.productId === next.productId && prev.className === next.className;
};

export const FavoriteButton = memo(FavoriteButtonInner, areEqualFav);