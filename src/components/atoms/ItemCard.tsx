"use client";

import { isFavorite, onFavoritesChanged, toggleFavorite } from "@/src/utils";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";


interface CardProps {
  id: string | number;
  image: string;
  title: string;
  price?: number; 
  ctaText?: string;
}

export const ItemCard = ({ id, image, title, price, ctaText }: CardProps) => {
  const isPriceVisible = typeof price === "number" && !Number.isNaN(price);
  const isProduct = isPriceVisible;

  const [favorite, setFavorite] = useState(() => {
    if (isProduct && id && typeof id === "number") {
      return isFavorite(id);
    }
    return false;
  });

  const updateFavoriteState = useCallback(() => {
    if (isProduct && id && typeof id === "number") {
      setFavorite(isFavorite(id));
    }
  }, [id, isProduct]);

  useEffect(() => {
    if (!isProduct || !id) return;

    // Schedule the state update asynchronously to avoid calling setState synchronously within the effect
    Promise.resolve().then(updateFavoriteState);

    const unsubscribe = onFavoritesChanged(updateFavoriteState);
    return unsubscribe;
  }, [updateFavoriteState]);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!id || typeof id !== "number") {
      console.error("Cannot toggle: Invalid product ID:", id);
      return;
    }
    
    const newState = toggleFavorite(id);
    setFavorite(newState);
  };

  return (
    <div className="flex flex-col justify-center items-center p-5 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden 
                  hover:shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative">
      
      {isProduct && (
        <button
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-gray-700/90 
                      hover:bg-white dark:hover:bg-gray-600 transition-all duration-200 
                      shadow-sm hover:shadow-md z-10"
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-5 h-5 transition-colors duration-200 ${
              favorite 
                ? "fill-red-500 stroke-red-500" 
                : "fill-none stroke-gray-600 dark:stroke-gray-300"
            }`}
            viewBox="0 0 24 24"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      )}

      <div className="relative w-full h-48 p-2">
        <Image
          src={image}
          alt={title}
          fill
          className="object-contain"
          sizes="(max-width: 640px) 100vw, 33vw"
          loading="lazy"
        />
      </div>

      <div className="flex flex-col items-center gap-2">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 text-center">
          {title}
        </h3>

        {isPriceVisible ? (
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
            ${price!.toFixed(2)}
          </span>
        ) : (
          <span className="text-xs uppercase tracking-wide bg-gray-900/10 text-gray-800 dark:bg-gray-600 dark:text-gray-100 px-3 py-1 rounded-full">
            {ctaText ?? "Explore"}
          </span>
        )}
      </div>
    </div>
  );
};