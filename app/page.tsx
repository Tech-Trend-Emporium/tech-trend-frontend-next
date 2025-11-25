"use client";

import { CarouselComponent, CategoriesSection, ProductsSection } from "@/src/components";
import { useHomeData } from "@/src/hooks";
import { memo } from "react";


const HomePageInner = () => {
  const { loading, error, topCategories, latest, bestSelling } = useHomeData();

  const safeTop = topCategories ?? [];
  const safeLatest = latest ?? [];
  const safeBest = bestSelling ?? [];

  return (
    <div className="pb-2">
      <CarouselComponent />

      <CategoriesSection loading={loading} topCategories={safeTop} />

      <ProductsSection
        title="Our Latest Arrivals"
        subtitle="Check out the newest products recently added to Tech Trend Emporium."
        loading={loading}
        products={safeLatest}
      />

      <ProductsSection
        title="Our Products (Best Sellers)"
        subtitle="The most popular items right now."
        loading={loading}
        products={safeBest}
      />

      {error && (
        <div className="text-center text-red-600 dark:text-red-400 mt-4">
          {error}
        </div>
      )}
    </div>
  );
}

export default memo(HomePageInner);