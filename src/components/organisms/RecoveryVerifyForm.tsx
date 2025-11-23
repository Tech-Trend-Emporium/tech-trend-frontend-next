"use client";

import { useForm, Controller } from "react-hook-form";
import { InputField, DropdownField, Form } from "@/src/components";
import type { VerifyRecoveryAnswerRequest } from "@/src/models";


interface RecoveryVerifyInputs {
    emailOrUsername: string;
    securityQuestion: string;
    answer: string;
}

interface RecoveryVerifyFormProps {
    securityQuestions: string[];
    isLoading: boolean;
    errorMessage: string | null;
    onSubmit: (data: VerifyRecoveryAnswerRequest) => void;
}

export const RecoveryVerifyForm = ({
    securityQuestions,
    isLoading,
    errorMessage,
    onSubmit,
}: RecoveryVerifyFormProps) => {
    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<RecoveryVerifyInputs>({
        mode: "onChange",
        defaultValues: {
            emailOrUsername: "",
            securityQuestion: "",
            answer: "",
        },
    });

    return (
        <Form
            onSubmit={handleSubmit((formValues) => {
                const payload: VerifyRecoveryAnswerRequest = {
                    emailOrUsername: formValues.emailOrUsername,
                    recoveryQuestionId: securityQuestions.indexOf(formValues.securityQuestion) + 1,
                    answer: formValues.answer,
                };
                onSubmit(payload);
            })}
            submitButton={{
                text: "Verify Identity",
                disabled: !isValid || isLoading,
                isLoading,
                variant: "dark",
            }}
            errorMessage={errorMessage}
            className="space-y-5"
        >
            {/* Email or Username */}
            <Controller
                name="emailOrUsername"
                control={control}
                rules={{ required: "Email or username is required" }}
                render={({ field }) => (
                    <>
                        <InputField
                            {...field}
                            id="emailOrUsername"
                            label="Email or Username"
                            placeholder="Enter your email or username"
                        />
                        {errors.emailOrUsername && (
                            <p className="text-red-600 text-sm mt-1">{errors.emailOrUsername.message}</p>
                        )}
                    </>
                )}
            />

            {/* Security Question Dropdown */}
            <Controller
                name="securityQuestion"
                control={control}
                rules={{ required: "Select your security question" }}
                render={({ field }) => (
                    <>
                        <DropdownField
                            id="securityQuestion"
                            name="securityQuestion"
                            label="Security Question"
                            options={securityQuestions}
                            selected={field.value}
                            handleSelect={field.onChange}
                        />
                        {errors.securityQuestion && (
                            <p className="text-red-600 text-sm mt-1">{errors.securityQuestion.message}</p>
                        )}
                    </>
                )}
            />

            {/* Security Answer */}
            <Controller
                name="answer"
                control={control}
                rules={{ required: "Please provide your answer" }}
                render={({ field }) => (
                    <>
                        <InputField
                            {...field}
                            id="answer"
                            label="Your Answer"
                            placeholder="Enter your security answer"
                        />
                        {errors.answer && (
                            <p className="text-red-600 text-sm mt-1">{errors.answer.message}</p>
                        )}
                    </>
                )}
            />
        </Form>
    );
};