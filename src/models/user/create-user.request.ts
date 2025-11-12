import type { Role } from "../";


export interface CreateUserRequest {
    username: string;
    email: string;
    password: string;
    role?: Role;      
    isActive?: boolean;
}