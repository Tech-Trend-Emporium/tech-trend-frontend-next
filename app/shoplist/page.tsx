"use client";

import { memo, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ButtonVariant, FilterSorter } from "@/src/components";
import { useCategories, useProducts } from "@/src/hooks";


const ProductPageInner = () => {
  const router = useRouter();
  const { checklistItems, selectedCategories } = useCategories();

  const onNavigate = useCallback((id: string) => {
    router.push(`/shoplist/${id}`);
  }, [router]);

  const {
    cards,        
    sortOption,
    buttonConf,   
    handleSorterSelect,
    handleShowMore,
  } = useProducts({ selectedCategories, onNavigate });

  const filterItemsMemo = useMemo(() => checklistItems ?? [], [checklistItems]);
  const cardsMemo = useMemo(() => cards ?? [], [cards]);
  const submitButtonMemo = useMemo(() => buttonConf, [buttonConf]);

  const sortOptions = useMemo(
    () => ["A to Z", "Z to A", "Price desc", "Price asc", "Default"],
    []
  );

  type Btn = { text: string; disabled?: boolean; isLoading?: boolean; variant?: ButtonVariant; };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-10 sm:py-12">
        <FilterSorter
          filterItems={filterItemsMemo}
          dataSet={cardsMemo}
          submitButton={submitButtonMemo as Btn}
          id="Sort"
          name="Sort"
          label="Sort by"
          options={sortOptions}
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

export default memo(ProductPageInner);