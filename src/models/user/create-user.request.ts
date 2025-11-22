import type { Role } from "@/src/models";


export interface CreateUserRequest {
    username: string;
    email: string;
    password: string;
    role?: Role;      
    isActive?: boolean;
}