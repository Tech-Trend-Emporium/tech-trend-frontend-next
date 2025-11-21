"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ProductService } from "@/src/services";
import { ProductResponse } from "@/src/models";
import { CardProps } from "@/src/components";
import { sortCards, SortOption } from "../lib/sorter";
import { getCachedData, saveCache, toCards } from "../utils";


const TAKE = 6 as const;

const mergeUniqueById = (arrays: ProductResponse[][]): ProductResponse[] => {
    const seen = new Set<string>();
    const out: ProductResponse[] = [];
    for (const arr of arrays) {
        for (const it of arr) {
            if (seen.has((it.id).toString())) continue;
            seen.add((it.id).toString());
            out.push(it);
        }
    }
    return out;
};

export const useProducts = (params: {
    selectedCategories: string[];
    onNavigate: (id: string) => void;
}) => {
    const { selectedCategories, onNavigate } = params;
    const onNavigateRef = useRef(onNavigate);
    useEffect(() => {
        onNavigateRef.current = onNavigate;
    }, [onNavigate]);

    const [cards, setCards] = useState<CardProps[]>([]);
    const [sortOption, setSortOption] = useState<SortOption>("none");
    const [buttonConf, setButtonConf] = useState({
        text: "Show more",
        disabled: false,
        isLoading: false,
    });

    const fetchAndCache = useCallback(async (category?: string) => {
        const cached = getCachedData(category);
        const response = await ProductService.list({ skip: cached.skip, take: TAKE, category });
        const updated = { products: [...cached.products, ...response.items], skip: cached.skip + TAKE };
        saveCache(category, updated);
        return { newItems: response.items as ProductResponse[], allItems: updated.products as ProductResponse[] };
    }, []);

    const ensureWarm = useCallback(async (category?: string) => {
        const cached = getCachedData(category);
        if (cached.products.length === 0) await fetchAndCache(category);
        return getCachedData(category).products;
    }, [fetchAndCache]);

    const refresh = useCallback(async () => {
        if (selectedCategories.length === 0) {
            const all = await ensureWarm(undefined);
            setCards(sortCards(toCards(all as ProductResponse[], (id) => onNavigateRef.current(id)), sortOption));
            setButtonConf((p) => ({ ...p, disabled: all.length < TAKE }));
            return;
        }

        const buckets: ProductResponse[][] = [];
        for (const c of selectedCategories) buckets.push(await ensureWarm(c) as ProductResponse[]);
        const combined = mergeUniqueById(buckets);
        setCards(sortCards(toCards(combined, onNavigate), sortOption));

        let disable = false;
        for (const c of selectedCategories) {
            const cached = getCachedData(c);
            if (cached.products.length % TAKE !== 0) {
                disable = true;
                break;
            }
        }
        setButtonConf((p) => ({ ...p, disabled: disable }));
    }, [selectedCategories, ensureWarm, onNavigate, sortOption]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            await refresh();
            if (cancelled) return;
        })();
        return () => {
            cancelled = true;
        };
    }, [refresh]);

    const handleShowMore = useCallback(async () => {
        setButtonConf((p) => ({ ...p, isLoading: true }));

        let nextAll: ProductResponse[] = [];
        let disable = false;

        if (selectedCategories.length === 0) {
            const { newItems, allItems } = await fetchAndCache(undefined);
            nextAll = allItems;
            if (newItems.length < TAKE) disable = true;
        } else {
            const buckets: ProductResponse[][] = [];
            for (const c of selectedCategories) {
                const { newItems, allItems } = await fetchAndCache(c);
                buckets.push(allItems);
                if (newItems.length < TAKE) disable = true;
            }
            nextAll = mergeUniqueById(buckets);
        }

        setCards(sortCards(toCards(nextAll, (id) => onNavigateRef.current(id)), sortOption));
        setButtonConf({ text: "Show more", disabled: disable, isLoading: false });
    }, [selectedCategories, fetchAndCache, sortOption]);

    const handleSorterSelect = useCallback((value: string) => {
        const v = (value as SortOption) ?? "none";
        setSortOption(v);
        setCards((prev) => sortCards(prev, v));
    }, []);

    return { cards, sortOption, buttonConf, handleSorterSelect, handleShowMore };
};