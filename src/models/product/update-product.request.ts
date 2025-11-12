import type { UpdateInventoryInlineRequest } from "../";


export interface UpdateProductRequest {
    title?: string | null;
    price?: number | null;
    description?: string | null;
    imageUrl?: string | null;
    ratingRate?: number | null;
    count?: number | null;
    category?: string | null;
    inventory?: UpdateInventoryInlineRequest | null;
}