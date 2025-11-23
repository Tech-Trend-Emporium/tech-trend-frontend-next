"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/src/auth";
import { RecoveryQuestionService } from "@/src/services";
import { toastSuccess } from "@/src/lib";
import type { SignUpRequest } from "@/src/models";


type UseSignUpReturn = {
    securityQuestions: string[];
    loadingQuestions: boolean;
    isSubmitting: boolean;
    errorMessage: string | null;
    handleSubmit: (payload: SignUpRequest) => Promise<void>;
};

export const useSignUp = (): UseSignUpReturn => {
    const router = useRouter();
    const { signUp } = useAuth();

    const [securityQuestions, setSecurityQuestions] = useState<string[]>([]);
    const [loadingQuestions, setLoadingQuestions] = useState(true);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const loadedRef = useRef(false);

    useEffect(() => {
        if (loadedRef.current) return;
        loadedRef.current = true;

        const ac = new AbortController();
        (async () => {
            setLoadingQuestions(true);
            setErrorMessage(null);
            try {
                const res = await RecoveryQuestionService.list();
                setSecurityQuestions(res.items.map((q) => q.question));
            } catch (err) {
                if (!axios.isCancel(err)) {
                    setErrorMessage("Unable to load security questions");
                }
            } finally {
                setLoadingQuestions(false);
            }
        })();

        return () => ac.abort();
    }, []);

    const handleSubmit = useCallback(
        async (payload: SignUpRequest) => {
            if (isSubmitting) return; // de-dupe
            setIsSubmitting(true);
            setErrorMessage(null);

            try {
                await signUp(payload);
                toastSuccess("Account created. You can log in now");
                router.push("/auth/sign-in");
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    setErrorMessage(
                        error.response?.status === 409
                            ? "Username or email already taken"
                            : "Sign up failed"
                    );
                } else {
                    setErrorMessage("Unexpected error occurred");
                }
            } finally {
                setIsSubmitting(false);
            }
        },
        [isSubmitting, signUp, router]
    );

    const questions = useMemo(() => securityQuestions, [securityQuestions]);

    return useMemo(
        () => ({
            securityQuestions: questions,
            loadingQuestions,
            isSubmitting,
            errorMessage,
            handleSubmit,
        }),
        [questions, loadingQuestions, isSubmitting, errorMessage, handleSubmit]
    );
};