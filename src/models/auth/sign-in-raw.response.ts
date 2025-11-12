import type { Role } from ".";

export interface SignInResponseRaw {
    accessToken: string;
    accessTokenExpiresAtUtc: string;   
    refreshToken: string;
    refreshTokenExpiresAtUtc: string;  
    role: Role;
    sessionId: number;
}