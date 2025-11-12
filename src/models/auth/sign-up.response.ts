import type { SignUpResponseRaw } from ".";


export type SignUpResponse = Omit<SignUpResponseRaw, "createdAt" | "updatedAt"> & {
    createdAt: Date;
    updatedAt?: Date | null;
};