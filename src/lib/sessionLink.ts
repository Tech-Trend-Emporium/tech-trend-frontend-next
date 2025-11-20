"use client";

let syncing = false;
let lastAccessToken: string | undefined;
let inflight: Promise<void> | null = null;


export type SessionPayload = {
    accessToken?: string;
    refreshToken?: string;
    role?: string;
    accessTokenExpiresAtUtc?: string | Date;
    refreshTokenExpiresAtUtc?: string | Date;
    isAuthenticated?: boolean;
    rememberMe?: boolean;
};

export const syncSessionCookies = async (next: SessionPayload): Promise<void> => {
    const currentToken = next?.accessToken ?? "";
    if (!currentToken) return;

    if (lastAccessToken === currentToken && !inflight) return;

    if (syncing && inflight) {
        return inflight;
    }

    syncing = true;
    inflight = fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
        keepalive: true,
    })
        .then(() => {
            lastAccessToken = currentToken;
        })
        .finally(() => {
            syncing = false;
            inflight = null;
        });

    return inflight;
};

export const clearSessionCookies = async (): Promise<void> => {
    if (syncing && inflight) await inflight;

    await fetch("/api/session", { method: "DELETE", keepalive: true });
    
    lastAccessToken = undefined;
};