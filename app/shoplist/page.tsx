"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { FilterSorter } from "@/src/components";
import { useCategories } from "@/src/hooks/useCategories";
import { useProducts } from "@/src/hooks/useProducts";


export default function ProductPage() {
  const router = useRouter();
  const { checklistItems, selectedCategories } = useCategories();

  const onNavigate = useCallback((id: string) => {
    router.push(`/products/${id}`);
  }, [router]);

  const {
    cards, sortOption, buttonConf,
    handleSorterSelect, handleShowMore
  } = useProducts({ selectedCategories, onNavigate });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <FilterSorter
          filterItems={checklistItems}
          dataSet={cards}
          submitButton={buttonConf}
          id="Sort"
          name="Sort"
          label="Sort"
          options={["A to Z", "Z to A", "Price desc", "Price asc", "none"]}
          selected={sortOption}
          required={false}
          errorMessage={undefined}
          handleSelect={handleSorterSelect}
          onClick={handleShowMore}
        />
      </div>
    </div>
  );
}