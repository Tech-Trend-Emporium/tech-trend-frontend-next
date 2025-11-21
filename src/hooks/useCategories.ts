"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CategoryService } from "@/src/services";
import { CheckboxFieldProps } from "@/src/components";


const TAKE = 6 as const;

export interface FilterField {
    id: string;
    label: string;
    name: string;
}

export const useCategories = () => {
    const [filterFields, setFilterFields] = useState<FilterField[]>([]);
    const [selected, setSelected] = useState<string[]>([]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const data = await CategoryService.list({ skip: 0, take: TAKE });
                if (cancelled) return;
                setFilterFields(
                    data.items.map((c: { name: string }) => ({
                        id: c.name,
                        label: c.name,
                        name: c.name,
                    }))
                );
            } catch (e) {
                console.error(e);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const toggle = useCallback((id: string, checked: boolean) => {
        setSelected((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)));
    }, []);

    const checklistItems: CheckboxFieldProps[] = useMemo(
        () =>
            filterFields.map((f) => ({
                ...f,
                checked: selected.includes(f.id),
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => toggle(f.id, e.target.checked),
            })),
        [filterFields, selected, toggle]
    );

    return { checklistItems, selectedCategories: selected };
};