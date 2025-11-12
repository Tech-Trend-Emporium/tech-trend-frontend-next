import type { Role } from "../";


export interface UserResponseRaw {
    id: number;
    email: string;
    username: string;
    role: Role;    
    isActive: boolean;
    createdAt: string; 
    updatedAt?: string | null;
}