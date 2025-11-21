"use client";

import { Button, CarouselComponent, ItemCard } from "@/src/components";
import { useHomeData } from "@/src/hooks";


export default function HomePage() {
  const { loading, error, topCategories, latest, bestSelling } = useHomeData();

  return (
    <div className="pb-2">
      <CarouselComponent />
      {/* Categories section */}
      <div className="mt-12 mb-12">
        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-200">
          Categories
        </h2>
        <span className="text-gray-600 dark:text-gray-400 flex justify-center mt-2 px-4 text-center">
          These are the most populated categories in Tech Trend Emporium.
        </span>
        <div className="flex justify-center">
          <Button variant="outline" className="mt-4 hover:cursor-pointer">
            Shop All
          </Button>
        </div>

        <div className="w-full mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 md:px-12 mx-auto max-w-6xl">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-52 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
              ))
            : topCategories.map((c) => (
                <ItemCard
                  id={c.name}
                  key={c.name}
                  image={c.imageUrl}
                  title={c.name}
                  ctaText="Shop now"
                />
              ))}
        </div>
      </div>

      {/* Latest Arrivals */}
      <div className="mt-12 mb-12">
        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-200">
          Our Latest Arrivals
        </h2>
        <span className="text-gray-600 dark:text-gray-400 flex justify-center mt-2 px-4 text-center">
          Check out the newest products recently added to Tech Trend Emporium.
        </span>

        <div className="mb-6 mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 md:px-12 mx-auto max-w-7xl">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-72 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
              ))
            : latest.map((p) => (
                <ItemCard
                  id={p.id}
                  key={p.id}
                  image={p.imageUrl}
                  title={p.title}
                  price={p.price}
                />
              ))}
        </div>
      </div>

      {/* Our Products: Top 3 best-selling (proxy: ratingRate) */}
      <div className="mt-12 mb-12">
        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-200">
          Our Products (Best Sellers)
        </h2>
        <span className="text-gray-600 dark:text-gray-400 flex justify-center mt-2 px-4 text-center">
          The most popular items right now.
        </span>

        <div className="mb-6 mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 md:px-12 mx-auto max-w-7xl">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-72 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
              ))
            : bestSelling.map((p) => (
                <ItemCard
                  id={p.id}
                  key={p.id}
                  image={p.imageUrl}
                  title={p.title}
                  price={p.price}
                />
              ))}
        </div>
      </div>

      {error && (
        <div className="text-center text-red-600 dark:text-red-400 mt-4">
          {error}
        </div>
      )}
    </div>
  );
};