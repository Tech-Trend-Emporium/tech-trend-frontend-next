import type { CartResponseRaw } from ".";


export type CartResponse = Omit<CartResponseRaw, "createdAt"> & {
    createdAt: Date;
};