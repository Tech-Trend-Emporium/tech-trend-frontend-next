export interface ProductResponseRaw {
    id: number;
    title: string;
    price: number;
    description: string;
    imageUrl: string;
    ratingRate: number;
    count: number;
    category: string;
    createdAt: string;      
    updatedAt?: string | null;
}