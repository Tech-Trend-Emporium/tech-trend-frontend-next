"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { setAuth, clearAuth, readFromStorage, setAuthCache } from "@/src/utils";
import type { AuthState, SignInRequest, SignInResponse, SignUpRequest, SignUpResponse } from "@/src/models";
import { AuthService } from "@/src/services";


type AuthContextType = {
    auth: AuthState;
    signIn: (payload: SignInRequest) => Promise<SignInResponse>;
    signUp: (payload: SignUpRequest) => Promise<SignUpResponse>;
    refresh: () => Promise<SignInResponse>;
    signOut: (opts: { allSessions: boolean; refreshToken?: string }) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children, initialAuth }: { children: React.ReactNode; initialAuth?: Partial<AuthState>; }) => {
    const [auth, setAuthState] = useState<AuthState>(() => {
        if (initialAuth?.isAuthenticated) {
            return { ...initialAuth, isAuthenticated: true } as AuthState;
        }

        const stored = readFromStorage();
        return stored?.accessToken ? { ...stored, isAuthenticated: true } : { isAuthenticated: false };
    });

    useEffect(() => {
        const stored = readFromStorage();
        if (stored?.accessToken) setAuthCache(stored);
    }, []);

    const syncCookies = async (next: AuthState) => {
        await fetch("/api/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(next),
        });
    };
    const clearCookies = async () => {
        await fetch("/api/session", { method: "DELETE" });
    };

    const signIn = useCallback(async (payload: SignInRequest): Promise<SignInResponse> => {
        const data = await AuthService.signIn(payload);
        const next: AuthState = { ...data, isAuthenticated: true };
        setAuthState(next);
        setAuth(next);
        await syncCookies(next);
        return data;
    }, []);

    const signUp = useCallback(async (payload: SignUpRequest): Promise<SignUpResponse> => {
        const data = await AuthService.signUp(payload);
        return data;
    }, []);

    const refresh = useCallback(async (): Promise<SignInResponse> => {
        const stored = readFromStorage();
        const refreshToken = stored?.refreshToken ?? auth.refreshToken;
        if (!refreshToken) throw new Error("No refresh token");

        const data = await AuthService.refresh(refreshToken);
        const next: AuthState = { ...data, isAuthenticated: true };
        setAuthState(next);
        setAuth(next);
        await syncCookies(next);

        return data;
    }, [auth.refreshToken]);

    const signOut = useCallback(async (opts: { allSessions: boolean; refreshToken?: string }): Promise<void> => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const body: any = { allSessions: !!opts.allSessions };
        if (!body.allSessions) body.refreshToken = opts.refreshToken ?? readFromStorage()?.refreshToken ?? auth.refreshToken;

        await AuthService.signOut(body);
        clearAuth();
        setAuthState({ isAuthenticated: false });
        await clearCookies();
    }, [auth.refreshToken]);

    const value = useMemo<AuthContextType>(() => ({ auth, signIn, signUp, refresh, signOut }), [auth, signIn, signUp, refresh, signOut]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");

    return ctx;
};