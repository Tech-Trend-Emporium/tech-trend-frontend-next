import { describe, test, expect, vi, beforeEach } from "vitest";
import {
  getAuth,
  setAuthCache,
  readFromStorage,
  writeToStorage,
  clearStorage,
  clearAuth,
  setAuth,
  authStorageKey,
} from "@/src/utils/authStorage";

// ----------------------------
// Mock localStorage
// ----------------------------
const mockStorage: Record<string, string> = {};

beforeEach(() => {
  // Limpia el mock del almacenamiento en cada prueba
  for (const key in mockStorage) delete mockStorage[key];

  // Resetea localStorage
  vi.stubGlobal("localStorage", {
    getItem: vi.fn((key: string) => mockStorage[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      mockStorage[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete mockStorage[key];
    }),
  });

  // Limpia cache interna
  setAuthCache(null);
});

// ----------------------------
// Tests getAuth / setAuthCache
// ----------------------------
describe("getAuth & setAuthCache", () => {
  test("should return null initially", () => {
    expect(getAuth()).toBe(null);
  });

  test("should set and retrieve auth cache value", () => {
    setAuthCache({ user: "Kevin" });
    expect(getAuth()).toEqual({ user: "Kevin" });
  });
});

// ----------------------------
// Tests readFromStorage
// ----------------------------
describe("readFromStorage", () => {
  test("should return parsed value when storage contains valid JSON", () => {
    mockStorage[authStorageKey] = JSON.stringify({ token: "123" });

    const result = readFromStorage();
    expect(result).toEqual({ token: "123" });
  });

  test("should return null when key does not exist", () => {
    const result = readFromStorage();
    expect(result).toBe(null);
  });

  test("should return null when JSON is invalid (failure case)", () => {
    mockStorage[authStorageKey] = "{ invalid json";

    const result = readFromStorage();
    expect(result).toBe(null);
  });
});

// ----------------------------
// Tests writeToStorage
// ----------------------------
describe("writeToStorage", () => {
  test("should write JSON string to localStorage", () => {
    writeToStorage({ name: "Kevin" });

    expect(localStorage.setItem).toHaveBeenCalledWith(
      authStorageKey,
      JSON.stringify({ name: "Kevin" })
    );

    expect(mockStorage[authStorageKey]).toBe(JSON.stringify({ name: "Kevin" }));
  });

  test("should fail silently if localStorage throws (failure case)", () => {
    (localStorage.setItem as any).mockImplementation(() => {
      throw new Error("storage error");
    });

    // Should NOT throw
    expect(() => writeToStorage({})).not.toThrow();
  });
});

// ----------------------------
// Tests clearStorage
// ----------------------------
describe("clearStorage", () => {
  test("should remove key from localStorage", () => {
    mockStorage[authStorageKey] = "123";

    clearStorage();

    expect(localStorage.removeItem).toHaveBeenCalledWith(authStorageKey);
    expect(mockStorage[authStorageKey]).toBeUndefined();
  });

  test("should fail silently if localStorage throws (failure case)", () => {
    (localStorage.removeItem as any).mockImplementation(() => {
      throw new Error("fail");
    });

    expect(() => clearStorage()).not.toThrow();
  });
});

// ----------------------------
// Tests setAuth
// ----------------------------
describe("setAuth", () => {
  test("should set cache and storage", () => {
    setAuth({ token: "abc" });

    expect(getAuth()).toEqual({ token: "abc" });
    expect(mockStorage[authStorageKey]).toBe(JSON.stringify({ token: "abc" }));
  });
});

// ----------------------------
// Tests clearAuth
// ----------------------------
describe("clearAuth", () => {
  test("should clear cache and storage", () => {
    setAuth({ token: "xyz" });

    clearAuth();

    expect(getAuth()).toBe(null);
    expect(mockStorage[authStorageKey]).toBeUndefined();
  });
});
