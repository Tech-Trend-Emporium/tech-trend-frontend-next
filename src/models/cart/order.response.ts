import type { OrderResponseRaw } from ".";


export type OrderResponse = Omit<OrderResponseRaw, "placedAtUtc" | "paidAtUtc"> & {
    placedAtUtc?: Date | null;
    paidAtUtc?: Date | null;
};