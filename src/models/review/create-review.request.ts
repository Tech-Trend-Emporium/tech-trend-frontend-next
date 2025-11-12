export interface CreateReviewRequest {
    username: string;
    productId: number;
    comment?: string | null;
    rating: number; 
}