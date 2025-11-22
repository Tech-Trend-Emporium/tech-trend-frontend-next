"use client";

import { useForm, Controller } from "react-hook-form";
import { InputField, Form } from "@/src/components";
import type { ResetPasswordRequest } from "@/src/models";


interface ResetPasswordInputs {
    newPassword: string;
    confirmPassword: string;
}

interface ResetPasswordFormProps {
    resetToken: string;
    expiresAt: Date;
    isLoading: boolean;
    errorMessage: string | null;
    currentDate: Date;
    onSubmit: (data: ResetPasswordRequest) => void;
}

export const ResetPasswordForm = ({
    resetToken,
    expiresAt,
    isLoading,
    errorMessage,
    currentDate,
    onSubmit,
}: ResetPasswordFormProps) => {
    const {
        control,
        handleSubmit,
        getValues,
        formState: { errors, isValid },
    } = useForm<ResetPasswordInputs>({
        mode: "onChange",
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    });

    // Check if token is expired
    const isExpired = new Date() > expiresAt;

    // Format remaining time
    const getRemainingTime = () => {
        const diff = expiresAt.getTime() - currentDate.getTime();
        if (diff <= 0) return "Expired";
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        return `${minutes}m ${seconds}s remaining`;
    };

    return (
        <Form
            onSubmit={handleSubmit((formValues) => {
                const payload: ResetPasswordRequest = {
                    resetToken,
                    newPassword: formValues.newPassword,
                    confirmPassword: formValues.confirmPassword,
                };
                onSubmit(payload);
            })}
            submitButton={{
                text: "Reset Password",
                disabled: !isValid || isLoading || isExpired,
                isLoading,
                variant: "dark",
            }}
            errorMessage={errorMessage}
            className="space-y-5"
        >
            {/* Token Expiration Warning */}
            <div className={`p-3 rounded-lg text-sm ${isExpired
                    ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
                    : "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400"
                }`}>
                {isExpired ? (
                    <p>Your reset token has expired. Please start the recovery process again.</p>
                ) : (
                    <p>Time to complete: <span className="font-semibold">{getRemainingTime()}</span></p>
                )}
            </div>

            {/* New Password */}
            <Controller
                name="newPassword"
                control={control}
                rules={{
                    required: "Password is required",
                    pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/,
                        message: "Password must include upper, lower, number, symbol and 8+ chars",
                    },
                }}
                render={({ field }) => (
                    <>
                        <InputField
                            {...field}
                            id="newPassword"
                            label="New Password"
                            type="password"
                            placeholder="Create a strong password"
                            disabled={isExpired}
                        />
                        {errors.newPassword && (
                            <p className="text-red-600 text-sm mt-1">{errors.newPassword.message}</p>
                        )}
                    </>
                )}
            />

            {/* Confirm Password */}
            <Controller
                name="confirmPassword"
                control={control}
                rules={{
                    required: "Confirm your password",
                    validate: (value) => value === getValues("newPassword") || "Passwords do not match",
                }}
                render={({ field }) => (
                    <>
                        <InputField
                            {...field}
                            id="confirmPassword"
                            label="Confirm New Password"
                            type="password"
                            placeholder="Re-enter your new password"
                            disabled={isExpired}
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>
                        )}
                    </>
                )}
            />
        </Form>
    );
};