"use client";

const getCategoryKey = (category?: string) => category ? `category-${category}` : "category-all";

export const getCachedData = (category?: string) => {
  const raw = sessionStorage.getItem(getCategoryKey(category));
  return raw ? JSON.parse(raw) : { products: [], skip: 0 };
};

export const saveCache = (category: string | undefined, data: any) => {
  sessionStorage.setItem(getCategoryKey(category), JSON.stringify(data));
};
