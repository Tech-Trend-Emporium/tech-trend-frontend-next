"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { ButtonVariant, FilterSorter } from "@/src/components";
import { useCategories, useProducts } from "@/src/hooks";


export default function ProductPage() {
  const router = useRouter();
  const { checklistItems, selectedCategories } = useCategories();

  const onNavigate = useCallback((id: string) => {
    router.push(`/shoplist/${id}`);
  }, [router]);

  const {
    cards, sortOption, buttonConf,
    handleSorterSelect, handleShowMore
  } = useProducts({ selectedCategories, onNavigate });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-10 sm:py-12">
        <FilterSorter
          filterItems={checklistItems}
          dataSet={cards}
          submitButton={buttonConf as { text: string; disabled?: boolean; isLoading?: boolean; variant?: ButtonVariant; }}
          id="Sort"
          name="Sort"
          label="Sort by"
          options={["A to Z", "Z to A", "Price desc", "Price asc", "Default"]}
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