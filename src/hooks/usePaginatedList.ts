import { useEffect, useState, useCallback } from "react";


type ListParams = { skip: number; take: number };
type ListResponse<T> = { items: T[]; total: number };

interface UsePaginatedListReturn<T> {
    page: number;
    setPage: (page: number) => void;
    items: T[];
    total: number;
    totalPages: number;
    loading: boolean;
    refresh: (page?: number) => Promise<void>;
    take: number;
}

export const usePaginatedList = <T,>(
    fetcher: (p: ListParams) => Promise<ListResponse<T>>,
    take = 10
): UsePaginatedListReturn<T> => {
    const [page, setPage] = useState(1);
    const [items, setItems] = useState<T[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async (p = page) => {
        setLoading(true);
        try {
            const res = await fetcher({ skip: (p - 1) * take, take });
            setItems(res.items);
            setTotal(res.total);
        } finally {
            setLoading(false);
        }
    }, [fetcher, page, take]);

    useEffect(() => { refresh(page); }, [page, refresh]);

    return {
        page,
        setPage,
        items,
        total,
        totalPages: Math.ceil(total / take),
        loading,
        refresh,
        take
    };
};