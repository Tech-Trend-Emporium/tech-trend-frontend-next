"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/src/auth";
import { readFromStorage } from "@/src/utils";
import { toastSuccess } from "@/src/lib";
import type { SignInRequest } from "@/src/models";


export interface SignInInputs {
    emailOrUsername: string;
    password: string;
    rememberMe: boolean;
}

type UseSignInReturn = {
    isLoading: boolean;
    errorMessage: string | null;
    handleSubmit: (data: SignInInputs) => Promise<void>;
};

const redirectByRole = (role?: string) =>
    role === "ADMIN" || role === "EMPLOYEE" ? "/admin" : "/shoplist";

export const useSignIn = (): UseSignInReturn => {
    const router = useRouter();
    const { signIn, refresh } = useAuth();

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const triedRef = useRef(false);

    useEffect(() => {
        if (triedRef.current) return;
        triedRef.current = true;

        const stored = readFromStorage?.();
        if (!stored?.refreshToken || stored?.accessToken) return;

        (async () => {
            try {
                const auth = await refresh();
                router.replace(redirectByRole(auth.role));
            } catch {
            }
        })();
    }, [refresh, router]);

    const handleSubmit = useCallback(
        async (data: SignInInputs) => {
            if (isLoading) return; // de-dupe clicks
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const payload: SignInRequest = {
                    emailOrUsername: data.emailOrUsername,
                    password: data.password,
                };

                const auth = await signIn(payload);
                toastSuccess("Signed in successfully");
                router.replace(redirectByRole(auth.role));
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    setErrorMessage(
                        error.response?.status === 401 ? "Wrong credentials" : "Sign in failed"
                    );
                } else {
                    setErrorMessage("Unexpected error occurred");
                }
            } finally {
                setIsLoading(false);
            }
        },
        [isLoading, router, signIn]
    );

    return useMemo(
        () => ({
            isLoading,
            errorMessage,
            handleSubmit,
        }),
        [isLoading, errorMessage, handleSubmit]
    );
};