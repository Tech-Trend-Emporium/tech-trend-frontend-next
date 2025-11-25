"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthTemplate, RecoveryVerifyForm, ResetPasswordForm } from "@/src/components";
import { usePasswordRecovery } from "@/src/hooks";
import { FiCheckCircle, FiArrowLeft } from "react-icons/fi";


const ForgotPasswordPageInner = () => {
    const router = useRouter();
    const {
        securityQuestions,
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
    } = usePasswordRecovery();

    const verifyIsLoading = useMemo(() => isVerifying || loadingQuestions, [isVerifying, loadingQuestions]);
    const canReset = useMemo(() => Boolean(resetToken && tokenExpiresAt), [resetToken, tokenExpiresAt]);

    return (
        <AuthTemplate imageSrc="/icon.png" imageAlt="Password recovery illustration">
            {/* Step: Verify Identity */}
            {currentStep === "verify" && (
                <>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 text-center">
                        Forgot Password
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                        Verify your identity to reset your password
                    </p>

                    <RecoveryVerifyForm
                        securityQuestions={securityQuestions}
                        isLoading={verifyIsLoading}
                        errorMessage={verifyError}
                        onSubmit={handleVerify}
                    />

                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 text-center mt-4">
                        Remember your password?&nbsp;
                        <span className="text-slate-500 dark:text-slate-400">
                            <Link className="hover:underline" href="/auth/sign-in">
                                Sign in
                            </Link>
                        </span>
                    </p>
                </>
            )}

            {/* Step: Reset Password */}
            {currentStep === "reset" && canReset && (
                <>
                    <button
                        onClick={goBackToVerify}
                        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors mb-4"
                    >
                        <FiArrowLeft className="w-4 h-4" />
                        Back
                    </button>

                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 text-center">
                        Reset Password
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                        Create a new secure password for your account
                    </p>

                    <ResetPasswordForm
                        resetToken={resetToken!}
                        expiresAt={tokenExpiresAt!}
                        isLoading={isResetting}
                        errorMessage={resetError}
                        onSubmit={handleReset}
                        currentDate={new Date()}
                    />
                </>
            )}

            {/* Step: Success */}
            {currentStep === "success" && (
                <div className="text-center py-8">
                    <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
                        <FiCheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>

                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                        Password Reset!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Your password has been successfully reset. You can now sign in with your new password.
                    </p>

                    <button
                        onClick={() => router.push("/auth/sign-in")}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                    >
                        Go to Sign In
                    </button>
                </div>
            )}
        </AuthTemplate>
    );
}

export default memo(ForgotPasswordPageInner);