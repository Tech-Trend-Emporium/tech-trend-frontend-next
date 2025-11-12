import type { Role } from "../";


export interface UpdateUserRequest {
    username?: string | null;
    email?: string | null;
    role?: Role | null;
    isActive?: boolean | null;
}