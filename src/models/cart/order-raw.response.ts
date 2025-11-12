import type { OrderItemResponse } from ".";


export interface OrderResponseRaw {
    id: number;
    userId: number;
    address?: string | null;
    paymentMethod?: string | null; 
    paymentStatus?: string | null;
    totalAmount?: number | null;
    placedAtUtc?: string | null;   
    paidAtUtc?: string | null;     
    items: OrderItemResponse[];
}