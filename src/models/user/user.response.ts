import type { UserResponseRaw } from ".";


export type UserResponse = Omit<UserResponseRaw, "createdAt" | "updatedAt"> & {
    createdAt: Date;
    updatedAt?: Date | null;
};