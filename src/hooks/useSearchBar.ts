/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getCachedData, levenshtein } from "../utils";
import { ProductService } from "../services";


export const useSearchBar = () => {
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
    if (!value.trim()) return;

    try {
      const result = await ProductService.getByName(value); 

      if (!result) {
        return;
      }

      //router.push(`/shoplist/${result.id}`);
    } catch (error) {
      console.error("Search API error:", error);
      //router.push("/shoplist/not-found");
    }
  };
    const handleSuggestionClick = (id: string) => {
      router.push(`/shoplist/${id}`);
    };
    
    return { handleSuggestionClick, handleSearchSubmit, handleSearchChange, suggestions, searchValue};
};