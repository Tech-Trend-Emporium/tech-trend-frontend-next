/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo } from "react";
import { useAuth } from "../auth";
import { userNameFromToken } from "../services";


export const useIdentity = () => {
    const { auth } = useAuth();
    const isAuthenticated = !!auth?.isAuthenticated;
    const role = (auth as any)?.role as ("ADMIN" | "EMPLOYEE" | "SHOPPER" | undefined);
    const username = userNameFromToken(auth || {}) || null;

    return useMemo(() => ({ isAuthenticated, role, username }), [isAuthenticated, role, username]);
};