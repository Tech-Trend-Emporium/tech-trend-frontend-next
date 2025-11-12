"use client";

import { useEffect, useState } from "react";
import { CategoryService, ProductService } from "../services";
import { swcGet } from "../lib/swcCache";
import { categoryImage } from "../lib/imagePlaceholder";


export type UiCategory = { name: string; productCount: number; imageUrl: string };
export type UiProduct = { id: number; title: string; price: number; imageUrl: string; createdAt: Date; ratingRate: number };

const TTL_TOP_CATS = 12 * 60 * 60 * 1000; 
const TTL_LATEST = 5 * 60 * 1000;       
const TTL_BEST = 60 * 60 * 1000;      

const loadTopCategories = async (): Promise<UiCategory[]> => {
    const page = await CategoryService.list({ skip: 0, take: 200 });

    const results = await Promise.all(
        page.items.map(async (c) => {
            const p = await ProductService.list({ skip: 0, take: 1, category: c.name });
            return { name: c.name, productCount: p.total, imageUrl: categoryImage(c.name) };
        })
    );
    
    return results.sort((a, b) => b.productCount - a.productCount).slice(0, 3);
}

const loadLatest = async (): Promise<UiProduct[]> => {
    const page = await ProductService.list({ skip: 0, take: 200 });

    return page.items
        .map(p => ({ id: p.id, title: p.title, price: p.price, imageUrl: p.imageUrl, createdAt: p.createdAt, ratingRate: p.ratingRate }))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 3);
};

const loadBestSelling = async (): Promise<UiProduct[]> => {
    const page = await ProductService.list({ skip: 0, take: 200 });
    
    return page.items
        .map(p => ({ id: p.id, title: p.title, price: p.price, imageUrl: p.imageUrl, createdAt: p.createdAt, ratingRate: p.ratingRate }))
        .sort((a, b) => b.ratingRate - a.ratingRate)
        .slice(0, 3);
};

export const useHomeData = () => {
    const [loading, setLoading] = useState(true);
    const [topCategories, setTopCategories] = useState<UiCategory[]>([]);
    const [latest, setLatest] = useState<UiProduct[]>([]);
    const [bestSelling, setBestSelling] = useState<UiProduct[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        setError(null);

        (async () => {
            try {
                const [cats, lat, best] = await Promise.all([
                    swcGet("home:topCats", TTL_TOP_CATS, loadTopCategories),
                    swcGet("home:latest", TTL_LATEST, loadLatest),
                    swcGet("home:best", TTL_BEST, loadBestSelling),
                ]);

                if (!mounted) return;

                setTopCategories(cats);
                setLatest(lat);
                setBestSelling(best);
            } catch (e) {
                if (!mounted) return;

                setError(e instanceof Error ? e.message : "Failed to load home data");
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => { mounted = false; };
    }, []);

    return { loading, error, topCategories, latest, bestSelling };
}