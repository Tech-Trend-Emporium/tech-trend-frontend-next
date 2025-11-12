import type { CreateInventoryInlineRequest } from "..";


export interface CreateProductRequest {
    title: string;
    price: number;
    description?: string | null;
    imageUrl?: string | null;
    ratingRate?: number; 
    count?: number;      
    category: string;
    inventory?: CreateInventoryInlineRequest | null;
}