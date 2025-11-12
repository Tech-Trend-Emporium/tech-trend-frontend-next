export interface SignOutRequest {
    refreshToken?: string | null;
    allSessions: boolean;
}