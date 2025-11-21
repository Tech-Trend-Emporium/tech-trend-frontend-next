"use client";

import { useCallback, useEffect, useState } from "react";
import { FilterSorter } from "@/src/components/organisms/FilterSorterV1";
import { CardProps } from "@/src/components";
import { CategoryService, ProductService } from "@/src/services"; 
import { ProductResponse } from "@/src/models";
import { getCachedData, saveCache } from "../../src/utils/cachedData";
import { mapdProducts} from "../../src/utils/produtsTools";
import { useRouter } from "next/navigation";
import router from "next/router";

interface filterFieldProps {
  id: string,
  label: string,
  name: string
}

export default function ProductPage() {
  const [filterFields, setFilterFields] = useState<filterFieldProps[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<CardProps[]>([]);
  const [sortOption, setSortOption] = useState<string>("");
  const [buttonConf, setButtonConf] = useState({
    text: "Show more",
    disabled: false,
    isLoading: false,
  });

  const router = useRouter();

  const take = 6;

  const sortProducts = (items: CardProps[], option: string) => {
  switch (option) {
    case "A to Z":
      return [...items].sort((a, b) => a.title.localeCompare(b.title));

    case "Z to A":
      return [...items].sort((a, b) => b.title.localeCompare(a.title));

    case "Price asc":
      return [...items].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));

    case "Price desc":
      return [...items].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));

    case "none":
    default:
      return items; 
  }
};



  const fetchProducts = async (category?: string) => {
    const cached = getCachedData(category);

    const response = await ProductService.list({
      skip: cached.skip,
      take,
      category,
    });

    const updated = {
      products: [...cached.products, ...response.items],
      skip: cached.skip + take,
    };

    saveCache(category, updated);

    return { newProducts: response.items, fullData: updated };
  };

  const applyCategoryFilter = useCallback(async () => {

    if (selectedCategories.length === 0) {
      let cached = getCachedData(undefined);

      if (cached.products.length === 0) {
        await fetchProducts(undefined);
        cached = getCachedData(undefined);
      }

      setProducts(
      sortProducts(mapdProducts(cached.products), sortOption).map((p) => ({...p,onClick: () => router.push(`/products/${p.id}`)})));
    }
    else {
    let combined: ProductResponse[] = [];

    for (const category of selectedCategories) {
      let cached = getCachedData(category);

      if (cached.products.length === 0) {
        await fetchProducts(category);
        cached = getCachedData(category);
      }

      combined = [...combined, ...cached.products];
    }
    
    setProducts(
    sortProducts(mapdProducts(combined), sortOption).map((p) => ({...p,onClick: () => router.push(`/products/${p.id}`)})));
  }
    setButtonConf((prev) => ({ ...prev, disabled: false }));
  }, [selectedCategories]);

  useEffect(() => {
    applyCategoryFilter();
  }, [applyCategoryFilter]);

  const handleShowMore = async () => {
    setButtonConf((prev) => ({ ...prev, isLoading: true }));

    let combined: ProductResponse[] = [];
    let noMoreData = false;

    if (selectedCategories.length === 0) {
      const { newProducts, fullData } = await fetchProducts(undefined);

      combined = fullData.products;
      noMoreData = newProducts.length < take;
    } else {
      for (const category of selectedCategories) {
        const { newProducts, fullData } = await fetchProducts(category);
        combined = [...combined, ...fullData.products];

        if (newProducts.length < take) {
          noMoreData = true;
        }
      }
    }

    setProducts(
    sortProducts(mapdProducts(combined), sortOption).map((p) => ({...p,onClick: () => router.push(`/products/${p.id}`)})));

    setButtonConf({
      text: "Show more",
      disabled: noMoreData,
      isLoading: false,
    });
  };

  const loadCategories =  async () => {
    try {
      const data = await CategoryService.list({ skip: 0, take });
      const mapped = data.items.map((category) => ({
        id: category.name,
        label: category.name,
        name: category.name,
      }));
      setFilterFields(mapped);
    } catch(err){
      console.log(err);
    }
  } 
  useEffect(() => {
    loadCategories();
  }, []);

  const handleCheckChange = (id: string, checked: boolean) => {
    setSelectedCategories((prev) =>
      checked ? [...prev, id] : prev.filter((c) => c !== id)
    );
  };

  const checklistItems = filterFields.map((item) => ({
    ...item,
    checked: selectedCategories.includes(item.id),
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      handleCheckChange(item.id, e.target.checked),
  }));

  const handleSorterSelect = (value: string) => {
  setSortOption(value);
  
  setProducts((prev) => sortProducts(prev, value));
  
};


  return (
    <FilterSorter
      filterItems={checklistItems}
      dataSet={products}
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
  );
}


