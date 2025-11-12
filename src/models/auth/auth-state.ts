import type { Role } from ".";

export interface AuthState {
    accessToken?: string;
    accessTokenExpiresAtUtc?: Date;
    refreshToken?: string;
    refreshTokenExpiresAtUtc?: Date;
    role?: Role;
    sessionId?: number;
    isAuthenticated: boolean;
}