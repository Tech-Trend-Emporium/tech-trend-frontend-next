import type { CategoryResponseRaw } from ".";


export type CategoryResponse = Omit<CategoryResponseRaw, "createdAt" | "updatedAt"> & {
    createdAt: Date;
    updatedAt?: Date | null;
};