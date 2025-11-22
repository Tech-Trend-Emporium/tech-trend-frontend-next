"use client";

import { useEffect, useState } from "react";


interface UseMountedReturn {
    mounted: boolean;
}

export const useMounted = (): UseMountedReturn => {
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        const id = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(id);
    }, []);

    return { mounted };
};