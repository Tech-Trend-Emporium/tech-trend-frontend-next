import type { CartItemResponse } from ".";


export interface CartResponseRaw {
    id: number;
    userId: number;
    subtotal?: number | null;
    discount?: number | null;
    discountAmount: number;
    total?: number | null;
    couponCode?: string | null;
    items: CartItemResponse[];
    createdAt: string; 
}