import { describe, it, expect, beforeEach, vi } from "vitest";
import { getCachedData, hasWindow as fnWindow, saveCache } from "@/src/utils/categoryStorage";

const CATEGORY_ALL = "category-all";

describe("categoryStorage utils", () => {
  beforeEach(() => {
    // Reset sessionStorage mock
    vi.restoreAllMocks();
    Object.defineProperty(window, "sessionStorage", {
      value: {
        storage: {} as Record<string, string>,
        getItem(key: string) {
          return this.storage[key] ?? null;
        },
        setItem(key: string, value: string) {
          this.storage[key] = value;
        },
        clear() {
          this.storage = {};
        },
      },
      writable: true,
    });

    window.sessionStorage.clear();
  });

  // ------------------------------------
  // getCachedData
  // ------------------------------------

  it("returns empty result when window is not available", () => {
    const spy = vi.spyOn(globalThis, "window", "get")
  .mockReturnValue(undefined as any);

    const result = getCachedData("test");

    expect(result).toEqual({ products: [], skip: 0 });

  });

  it("returns default empty structure if key does not exist", () => {
    const result = getCachedData("non-existent");
    expect(result).toEqual({ products: [], skip: 0 });
  });

  it("returns parsed data when cache exists and is valid", () => {
    const entry = { products: ["p1", "p2"], skip: 10 };
    window.sessionStorage.setItem("category-food", JSON.stringify(entry));

    const result = getCachedData("food");

    expect(result).toEqual(entry);
  });

  it("returns empty structure when stored value is invalid JSON", () => {
    window.sessionStorage.setItem("category-bad", "NOT_JSON");

    const result = getCachedData("bad");

    expect(result).toEqual({ products: [], skip: 0 });
  });

  it("returns empty structure when parsed value is not a valid CacheEntry", () => {
    window.sessionStorage.setItem("category-x", JSON.stringify({ foo: true }));

    const result = getCachedData("x");

    expect(result).toEqual({ products: [], skip: 0 });
  });

  it("returns empty structure when products is not an array", () => {
    window.sessionStorage.setItem(
      "category-test",
      JSON.stringify({ products: "not-array", skip: 5 })
    );

    const result = getCachedData("test");

    expect(result).toEqual({ products: [], skip: 0 });
  });

  it("returns empty structure when skip is not a number", () => {
    window.sessionStorage.setItem(
      "category-test",
      JSON.stringify({ products: [], skip: "wrong" })
    );

    const result = getCachedData("test");

    expect(result).toEqual({ products: [], skip: 0 });
  });

  it('uses "category-all" key when no category is provided', () => {
    const entry = { products: ["a"], skip: 2 };

    window.sessionStorage.setItem(CATEGORY_ALL, JSON.stringify(entry));

    const result = getCachedData();

    expect(result).toEqual(entry);
  });

  // ------------------------------------
  // saveCache
  // ------------------------------------

  it("stores data correctly in sessionStorage", () => {
    const data = { products: ["p1"], skip: 3 };

    saveCache("mens", data);

    const stored = window.sessionStorage.getItem("category-mens");

    expect(stored).toBe(JSON.stringify(data));
  });


  it("uses 'category-all' key when saving with undefined category", () => {
    const data = { products: ["c"], skip: 5 };

    saveCache(undefined, data);

    expect(window.sessionStorage.getItem(CATEGORY_ALL)).toBe(
      JSON.stringify(data)
    );
  });
});
