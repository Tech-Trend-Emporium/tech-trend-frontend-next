import type { ProductResponseRaw } from ".";


export type ProductResponse = Omit<ProductResponseRaw, "createdAt" | "updatedAt"> & {
    createdAt: Date;
    updatedAt?: Date | null;
};