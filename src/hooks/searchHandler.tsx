"use client";

import { useState } from "react";
import { levenshtein } from "../utils/levenshtein";
import { mapdProducts} from "../utils/produtsTools";
import { useRouter } from "next/navigation";
import { getCachedData } from "../utils/cachedData";
import { ProductService } from "../services";

export function searchBarTools() {
    const router = useRouter();
    const [searchValue, setSearchValue] = useState("");
    const [suggestions, setSuggestions] = useState<
    { title: string; id: string; distance: number }[]
    >([]);
    
    
    const handleSearchChange = (value: string) => {
      setSearchValue(value);
    
      // Si está vacío, limpiar sugerencias
      if (value.trim() === "") {
        setSuggestions([]);
        return;
      }
    
      // Obtener todos los productos desde cache global
      const cached = getCachedData();//JSON.parse(sessionStorage.getItem("category-all") || "{}");
    
      if (!cached.products) {
        setSuggestions([]);
        return;
      }
    
      // Comparar por distancia de Levenshtein
      const scored = cached.products.map((p: any) => ({
        id: p.id,
        title: p.title,
        distance: levenshtein(value.toLowerCase(), p.title.toLowerCase())
      }));
    
      // Obtener los 3 mejores resultados
      const best = scored
        .sort((a:any, b:any) => a.distance - b.distance)
        .slice(0, 3);
    
      setSuggestions(best);
    };

    const handleSearchSubmit = async (value: string) => {
    if (!value.trim()) return;

    try {
      const result = await ProductService.getName(value); 
      // Debe devolver null o [] cuando no hay coincidencias

      if (!result) {
        //router.push("/products/not-found");
        return;
      }

      // Si encuentra un producto, ir a su página de detalles
      console.log("Consulta exitosa");
      //router.push(`/products/${result.id}`);
    } catch (error) {
      console.error("Search API error:", error);
      //router.push("/products/not-found");
    }
  };
    
    const handleSuggestionClick = (id: string) => {
      router.push(`/products/${id}`);
    };
    
    return { handleSuggestionClick, handleSearchSubmit, handleSearchChange, suggestions, searchValue};
    
}