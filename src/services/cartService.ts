import { http } from "../lib/http";
import type { AddCartItemRequest, ApplyCouponRequest, CartResponse, CartResponseRaw, CheckoutRequest, OrderResponse, OrderResponseRaw, Page, UpdateCartItemRequest } from "../models";


const BASE = "/Cart";

const toDate = (iso?: string | null) => (iso ? new Date(iso) : null);
const mapCart = (c: CartResponseRaw): CartResponse => ({
    ...c,
    createdAt: new Date(c.createdAt),
});
const mapOrder = (o: OrderResponseRaw): OrderResponse => ({
    ...o,
    placedAtUtc: toDate(o.placedAtUtc) ?? null,
    paidAtUtc: toDate(o.paidAtUtc) ?? null,
});

export const CartService = {
    get: () => {
        return http.get<CartResponseRaw>(`${ BASE }`).then(r => mapCart(r.data));
    },

    addItem: (payload: AddCartItemRequest) => {
        return http.post<CartResponseRaw>(`${ BASE }/items`, payload).then(r => mapCart(r.data));
    },

    updateQuantity: (payload: UpdateCartItemRequest) => {
        return http.put<CartResponseRaw>(`${ BASE }/items`, payload).then(r => mapCart(r.data));
    },

    removeItem: (productId: number) => {
        return http.delete<CartResponseRaw>(`${ BASE }/items/${ productId }`).then(r => mapCart(r.data));
    },

    clear: () => {
        return http.post<CartResponseRaw>(`${ BASE }/clear`).then(r => mapCart(r.data));
    },

    applyCoupon: (payload: ApplyCouponRequest) => {
        return http.post<CartResponseRaw>(`${ BASE }/coupon`, payload).then(r => mapCart(r.data));
    },

    removeCoupon: () => {
        return http.delete<CartResponseRaw>(`${ BASE }/coupon`).then(r => mapCart(r.data));
    },

    checkout: (payload: CheckoutRequest) => {
        return http.post<void>(`${ BASE }/checkout`, payload).then(r => r.data);
    },

    listMyOrders: (opts?: { skip?: number; take?: number }): Promise<Page<OrderResponse>> => {
        return http.get<Page<OrderResponseRaw>>(`${ BASE }/orders`, {
                        params: { skip: opts?.skip ?? 0, take: opts?.take ?? 50 },
                    })
                    .then(r => ({
                        total: r.data.total,
                        items: r.data.items.map(mapOrder),
                    }));
    },
};