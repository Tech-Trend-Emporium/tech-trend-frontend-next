import type { Role } from "@/src/models";


export interface UpdateUserRequest {
    username?: string | null;
    email?: string | null;
    role?: Role | null;
    isActive?: boolean | null;
}