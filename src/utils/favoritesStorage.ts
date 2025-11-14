"use client";

let _favoritesCache: Set<number> | null = null;

export const storageKey = "favorites";
const FAVORITES_EVENT = "favorites-changed";

const emitFavoritesChanged = () => {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent(FAVORITES_EVENT));
    }
};

export const onFavoritesChanged = (callback: () => void) => {
    if (typeof window !== "undefined") {
        window.addEventListener(FAVORITES_EVENT, callback);
        return () => window.removeEventListener(FAVORITES_EVENT, callback);
    }

    return () => { };
};

export const readFavoritesFromStorage = (): number[] => {
    try {
        const stored = localStorage.getItem(storageKey);
        if (!stored || stored === "null") {
            return [];
        }

        const parsed = JSON.parse(stored);
        return Array.isArray(parsed)
            ? parsed.filter((id) => typeof id === "number" && !isNaN(id))
            : [];
    } catch {
        return [];
    }
};

export const writeFavoritesToStorage = (favorites: number[]) => {
    try {
        const validFavorites = favorites.filter(
            (id) => typeof id === "number" && !isNaN(id)
        );

        localStorage.setItem(storageKey, JSON.stringify(validFavorites));
        emitFavoritesChanged();
    } catch (e) {
        console.error("Error writing favorites to storage:", e);
    }
};

export const initializeFavorites = (): Set<number> => {
    const stored = readFavoritesFromStorage();
    _favoritesCache = new Set(stored);

    return _favoritesCache;
};

export const getFavorites = (): Set<number> => {
    if (_favoritesCache === null) {
        return initializeFavorites();
    }

    return _favoritesCache;
};

export const isFavorite = (productId: number): boolean => {
    if (typeof productId !== "number" || isNaN(productId)) {
        return false;
    }

    return getFavorites().has(productId);
};

export const addFavorite = (productId: number): void => {
    if (typeof productId !== "number" || isNaN(productId)) {
        console.error("Cannot add invalid product ID:", productId);
        return;
    }

    const favorites = getFavorites();
    favorites.add(productId);
    writeFavoritesToStorage(Array.from(favorites));
};

export const removeFavorite = (productId: number): void => {
    if (typeof productId !== "number" || isNaN(productId)) {
        console.error("Cannot remove invalid product ID:", productId);
        return;
    }

    const favorites = getFavorites();
    favorites.delete(productId);
    writeFavoritesToStorage(Array.from(favorites));
};

export const toggleFavorite = (productId: number): boolean => {
    if (typeof productId !== "number" || isNaN(productId)) {
        console.error("Cannot toggle invalid product ID:", productId);
        return false;
    }

    const favorites = getFavorites();
    const willBeFavorite = !favorites.has(productId);

    if (willBeFavorite) {
        favorites.add(productId);
    } else {
        favorites.delete(productId);
    }

    writeFavoritesToStorage(Array.from(favorites));
    return willBeFavorite;
};

export const clearFavorites = (): void => {
    _favoritesCache = new Set();
    
    try {
        localStorage.removeItem(storageKey);
        emitFavoritesChanged();
    } catch (e) {
        console.error("Error clearing favorites:", e);
    }
};

export const getFavoritesArray = (): number[] => {
    return Array.from(getFavorites());
};

export const getFavoritesCount = (): number => {
    return getFavorites().size;
};
