export interface CartItemResponse {
    productId: number;
    name: string;
    imageUrl: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
}