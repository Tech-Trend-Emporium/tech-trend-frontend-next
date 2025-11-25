"use client";

import { memo, useCallback, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AddToCartButton, FavoriteButton, WishListButton } from "@/src/components";
import { useAuth } from "@/src/auth";


export interface CardProps {
  id: string | number;
  image: string;
  title: string;
  price?: number;
  ctaText?: string;
}

const ItemCardInner = ({ id, image, title, price, ctaText }: CardProps) => {
  const isPriceVisible = typeof price === "number" && !Number.isNaN(price);
  const isProduct = isPriceVisible;
  const { auth } = useAuth();
  const router = useRouter();

  const numericId = useMemo(
    () => (typeof id === "string" ? parseInt(id, 10) : id),
    [id]
  );
  const isValidId = typeof numericId === "number" && !isNaN(numericId as number);

  const handleClick = useCallback(() => {
    if (isProduct && isValidId) router.push(`/shoplist/${numericId}`);
  }, [isProduct, isValidId, router, numericId]);

  return (
    <div
      className={`flex flex-col justify-center items-center p-5 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden 
                  hover:shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative 
                  ${isProduct && auth.isAuthenticated ? "hover:cursor-pointer" : ""}`}
      onClick={auth.isAuthenticated ? handleClick : undefined}
    >
      {/* Action Buttons */}
      {isProduct && isValidId && (
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          {auth.isAuthenticated && (
            <>
              <FavoriteButton productId={numericId as number} />
              <WishListButton productId={numericId as number} variant="card" />
              <AddToCartButton productId={numericId as number} variant="card" />
            </>
          )}
        </div>
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

      <div className="mt-2 flex flex-col items-center gap-2">
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
}

const areEqual = (prev: Readonly<CardProps>, next: Readonly<CardProps>) => {
  return (
    prev.id === next.id &&
    prev.image === next.image &&
    prev.title === next.title &&
    prev.price === next.price &&
    prev.ctaText === next.ctaText
  );
};

export const ItemCard = memo(ItemCardInner, areEqual);