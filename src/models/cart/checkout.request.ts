import type { PaymentMethod } from ".";


export interface CheckoutRequest {
    address: string;
    paymentMethod: PaymentMethod;
}