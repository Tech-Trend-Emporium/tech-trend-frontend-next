/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getCachedData, levenshtein } from "@/src/utils";
import { ProductService } from "@/src/services";


interface UseSearchBarReturn {
  handleSearchChange: (value: string) => void;
  handleSearchSubmit: (value: string) => void;
  handleSuggestionClick: (id: string) => void;
  suggestions: { title: string; id: string; distance: number }[];
  searchValue: string;
}

export const useSearchBar = (): UseSearchBarReturn => {
    const router = useRouter();
    const [searchValue, setSearchValue] = useState("");
    const [suggestions, setSuggestions] = useState<
      { title: string; id: string; distance: number }[]
    >([]);

    
    const handleSearchChange = (value: string) => {
      setSearchValue(value);
    
      if (value.trim() === "") {
        setSuggestions([]);
        return;
      }
    
      const cached = getCachedData();
    
      if (!cached.products) {
        setSuggestions([]);
        return;
      }
    
      const scored = cached.products.map((p: any) => ({
        id: p.id,
        title: p.title,
        distance: levenshtein(value.toLowerCase(), p.title.toLowerCase())
      }));
    
      const best = scored
        .sort((a:any, b:any) => a.distance - b.distance)
        .slice(0, 3);
    
      setSuggestions(best);
    };

    const handleSearchSubmit = async (value: string) => {
     setSearchValue(value);

const term = value.trim().toLowerCase();
if (!term) return;

const cached = getCachedData();
if (!cached.products || cached.products.length === 0) {
  setSuggestions([]);
  return;
}


const filtered = cached.products.filter((p: any) =>
  p.title.toLowerCase().trim().includes(term)
);

console.log("Filtered candidates:", filtered);


const candidates = filtered.length > 0 ? filtered : cached.products;


const scored = candidates.map((p: any) => ({
  id: p.id,
  title: p.title,
  distance: levenshtein(term, p.title.toLowerCase())
}));

console.log("Scored results:", scored);


const best = scored
  .sort((a: any, b: any) => a.distance - b.distance)
  .slice(0, 2);

console.log("Best:", best);

if (best.length > 0) {
  router.push(`/shoplist/${best[0].id}`);
}


  };
    const handleSuggestionClick = (id: string) => {
      router.push(`/shoplist/${id}`);
    };
    
    return { handleSuggestionClick, handleSearchSubmit, handleSearchChange, suggestions, searchValue};
};