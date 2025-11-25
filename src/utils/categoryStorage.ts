"use client";


type CacheEntry = {
  products: unknown[];
  skip: number;
};

const CATEGORY_ALL = "category-all" as const;
export const getCategoryKey = (category?: string) => (category ? `category-${category}` : CATEGORY_ALL);

export const hasWindow = () => typeof window !== "undefined";
export const getStore = () => (hasWindow() ? window.sessionStorage : null);

export const getCachedData = (category?: string): CacheEntry => {
  const store = getStore();
  if (!store) return { products: [], skip: 0 };

  try {
    const raw = store.getItem(getCategoryKey(category));
    if (!raw) return { products: [], skip: 0 };
    const parsed = JSON.parse(raw) as CacheEntry;
    
    if (!parsed || !Array.isArray(parsed.products) || typeof parsed.skip !== "number") {
      return { products: [], skip: 0 };
    }

    return parsed;
  } catch {
    return { products: [], skip: 0 };
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const saveCache = (category: string | undefined, data: CacheEntry | any) => {
  const store = getStore();
  if (!store) return;
  try {
    store.setItem(getCategoryKey(category), JSON.stringify(data));
  } catch { }
};