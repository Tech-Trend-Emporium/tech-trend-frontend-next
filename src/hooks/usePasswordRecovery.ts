"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { AuthService, RecoveryQuestionService } from "@/src/services";
import { toastSuccess } from "@/src/lib";
import type { VerifyRecoveryAnswerRequest, VerifyRecoveryAnswerResponse, ResetPasswordRequest } from "@/src/models";


export type RecoveryStep = "verify" | "reset" | "success";

interface UsePasswordRecoveryReturn {
    // Questions
    securityQuestions: string[];
    loadingQuestions: boolean;

    // Step management
    currentStep: RecoveryStep;
    goBackToVerify: () => void;

    // Verify step
    isVerifying: boolean;
    verifyError: string | null;
    handleVerify: (payload: VerifyRecoveryAnswerRequest) => Promise<void>;

    // Reset step
    resetToken: string | null;
    tokenExpiresAt: Date | null;
    isResetting: boolean;
    resetError: string | null;
    handleReset: (payload: ResetPasswordRequest) => Promise<void>;
}

export const usePasswordRecovery = (): UsePasswordRecoveryReturn => {
    // Security questions state
    const [securityQuestions, setSecurityQuestions] = useState<string[]>([]);
    const [loadingQuestions, setLoadingQuestions] = useState(true);

    // Step state
    const [currentStep, setCurrentStep] = useState<RecoveryStep>("verify");

    // Verify step state
    const [isVerifying, setIsVerifying] = useState(false);
    const [verifyError, setVerifyError] = useState<string | null>(null);

    // Reset step state
    const [resetToken, setResetToken] = useState<string | null>(null);
    const [tokenExpiresAt, setTokenExpiresAt] = useState<Date | null>(null);
    const [isResetting, setIsResetting] = useState(false);
    const [resetError, setResetError] = useState<string | null>(null);

    // Load security questions
    useEffect(() => {
        const ac = new AbortController();
        setLoadingQuestions(true);
        setVerifyError(null);

        (async () => {
            try {
                const res = await RecoveryQuestionService.list();
                setSecurityQuestions(res.items.map((q) => q.question));
            } catch (err) {
                if (!axios.isCancel(err)) {
                    setVerifyError("Unable to load security questions");
                }
            } finally {
                setLoadingQuestions(false);
            }
        })();

        return () => ac.abort();
    }, []);

    // Handle verify submission
    const handleVerify = useCallback(async (payload: VerifyRecoveryAnswerRequest) => {
        if (isVerifying) return;
        setIsVerifying(true);
        setVerifyError(null);

        try {
            const response: VerifyRecoveryAnswerResponse = await AuthService.verifyRecovery(payload);
            setResetToken(response.resetToken);
            setTokenExpiresAt(response.expiresAtUtc);
            setCurrentStep("reset");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                if (status === 404) {
                    setVerifyError("User not found");
                } else if (status === 400) {
                    setVerifyError("Incorrect security question or answer");
                } else {
                    setVerifyError("Verification failed. Please try again.");
                }
            } else {
                setVerifyError("An unexpected error occurred");
            }
        } finally {
            setIsVerifying(false);
        }
    }, [isVerifying]);

    // Handle reset submission
    const handleReset = useCallback(async (payload: ResetPasswordRequest) => {
        if (isResetting) return;
        setIsResetting(true);
        setResetError(null);

        try {
            await AuthService.resetPassword(payload);
            setCurrentStep("success");
            toastSuccess("Password reset successfully!");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                if (status === 400) {
                    setResetError("Invalid or expired reset token");
                } else if (status === 422) {
                    setResetError("Password does not meet requirements");
                } else {
                    setResetError("Password reset failed. Please try again.");
                }
            } else {
                setResetError("An unexpected error occurred");
            }
        } finally {
            setIsResetting(false);
        }
    }, [isResetting]);

    // Handle going back to verify step
    const goBackToVerify = useCallback(() => {
        setCurrentStep("verify");
        setResetToken(null);
        setTokenExpiresAt(null);
        setResetError(null);
    }, []);

    const questions = useMemo(() => securityQuestions, [securityQuestions]);

    return {
        securityQuestions: questions,
        loadingQuestions,
        currentStep,
        goBackToVerify,
        isVerifying,
        verifyError,
        handleVerify,
        resetToken,
        tokenExpiresAt,
        isResetting,
        resetError,
        handleReset,
    };
};