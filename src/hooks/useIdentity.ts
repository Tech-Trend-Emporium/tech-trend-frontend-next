/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo } from "react";
import { useAuth } from "@/src/auth";
import { userNameFromToken } from "@/src/services";


interface UseIdentityReturn {
    isAuthenticated: boolean;
    role: "ADMIN" | "EMPLOYEE" | "SHOPPER" | undefined;
    username: string | null;
}

export const useIdentity = (): UseIdentityReturn => {
    const { auth } = useAuth();
    const isAuthenticated = !!auth?.isAuthenticated;
    const role = (auth as any)?.role as ("ADMIN" | "EMPLOYEE" | "SHOPPER" | undefined);
    const username = userNameFromToken(auth || {}) || null;

    return useMemo(() => ({ isAuthenticated, role, username }), [isAuthenticated, role, username]);
};